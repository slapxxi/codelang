import { Pencil, Trash2 } from 'lucide-react';
import { data, Form, href, Link, redirect } from 'react-router';
import { ERROR_TYPES, STATUS_CODES } from '~/app/const';
import { emitter } from '~/app/emitter.server';
import { getSession } from '~/app/session.server';
import { useAuth } from '~/hooks';
import { deleteSnippet, getSnippet } from '~/lib/http';
import { postComment } from '~/lib/http/post-comment.http';
import type { DataWithResponseInit, TComment, TSnippet } from '~/types';
import {
  Button,
  CommentsSection,
  LoginMessage,
  SnippetCard,
  SnippetCardBody,
  SnippetCardFooter,
  SnippetCardHeader,
} from '~/ui';
import { PostCommentForm, PostCommentFormSchema } from '../forms';
import { useCommentEvents } from '../hooks/useCommentEvents';
import type { Route } from './+types/snippet.route';

const SnippetRoute = ({ loaderData, actionData }: Route.ComponentProps) => {
  const { snippet } = loaderData;
  const user = useAuth();

  useCommentEvents();

  function handleDelete(e: React.FormEvent<HTMLFormElement>) {
    if (!confirm('Are you sure you want to delete this snippet?')) {
      e.preventDefault();
    }
  }

  return (
    <div className="mt-4 flex w-full flex-col gap-8 overflow-x-hidden px-1 md:mt-0">
      <div className="top-0 flex max-w-full flex-col gap-8 self-center md:min-w-128 md:self-start">
        <div className="flex flex-col gap-4">
          {user && snippet.user.id === user.id && (
            <div className="flex gap-2">
              <Button variant="link" asChild>
                <Link
                  to={href('/snippets/:snippetId/edit', { snippetId: snippet.id })}
                  className="flex items-center gap-2 text-sm text-olive-900 hover:text-olive-600"
                >
                  <Pencil size={16} />
                  <span>Edit Snippet</span>
                </Link>
              </Button>

              <Form method="post" onSubmit={handleDelete}>
                <input type="hidden" name="intent" value="delete-snippet" />
                <Button variant="destructive">
                  Delete Snippet <Trash2 size={16} />
                </Button>
              </Form>
            </div>
          )}

          <SnippetCard snippet={snippet} className="max-w-full min-w-0">
            <SnippetCardHeader iconLeft={null} />
            <SnippetCardBody />
            <SnippetCardFooter />
          </SnippetCard>
        </div>

        {user ? (
          <section className="flex flex-col gap-2">
            <PostCommentForm key={actionData?.postedComment?.id} />
          </section>
        ) : (
          <LoginMessage>to be able to post a comment</LoginMessage>
        )}
      </div>

      <CommentsSection title="Comments" data={snippet.comments}>
        {(comment) => comment.content}
      </CommentsSection>
    </div>
  );
};

type LoaderResult = {
  snippet: TSnippet;
};

export async function loader({ params }: Route.LoaderArgs): Promise<LoaderResult> {
  const snippetResult = await getSnippet({ id: params.snippetId });

  if (snippetResult.data) {
    return { snippet: snippetResult.data };
  }

  throw data(null, { status: STATUS_CODES.NOT_FOUND });
}

type ActionResult = {
  errorMessage?: string;
  postedComment?: TComment;
};

export async function action({
  request,
  params,
}: Route.ActionArgs): Promise<Response | ActionResult | DataWithResponseInit<ActionResult>> {
  const session = await getSession(request.headers.get('Cookie'));
  const token = session.get('token');

  if (!token) {
    return redirect('/login');
  }

  const formData = await request.formData();
  const form = Object.fromEntries(formData);

  if (form.intent === 'delete-snippet') {
    const deleteResult = await deleteSnippet({ id: params.snippetId, token });

    if (deleteResult.data) {
      return redirect(href('/snippets'));
    }

    return data({}, { status: STATUS_CODES.SERVER });
  }

  if (form.intent === 'create-comment') {
    const parseResult = PostCommentFormSchema.safeParse(form);

    if (parseResult.success) {
      const { comment } = parseResult.data;
      const postResult = await postComment({ snippetId: params.snippetId, comment, token });

      if (postResult.data) {
        emitter.emit('comment', postResult.data);
        return data({ postedComment: postResult.data }, { status: STATUS_CODES.CREATED });
      }

      const { error } = postResult;
      return data(
        { errorMessage: error.message },
        { status: error.type === ERROR_TYPES.SERVER ? error.status : STATUS_CODES.SERVER }
      );
    }

    return data({ errorMessage: 'Invalid data submitted' }, { status: STATUS_CODES.BAD_REQUEST });
  }

  return {};
}

export function meta() {
  return [{ title: 'Codelang | Snippet' }, { name: 'description', content: 'Codelang snippet' }];
}

export default SnippetRoute;

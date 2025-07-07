import { Pencil, Trash2 } from 'lucide-react';
import { data, Form, href, Link, redirect } from 'react-router';
import { ERROR_TYPE_SERVER, STATUS_BAD_REQUEST, STATUS_NOT_FOUND, STATUS_SERVER } from '~/app/const';
import { getSession } from '~/app/session.server';
import { useAuth } from '~/hooks';
import { deleteSnippet, getSnippet } from '~/lib/http';
import { postComment } from '~/lib/http/post-comment.http';
import type { TComment } from '~/types';
import {
  Badge,
  Button,
  Card,
  LoginMessage,
  SnippetCard,
  SnippetCardBody,
  SnippetCardFooter,
  SnippetCardHeader,
  Title,
} from '~/ui';
import { PostCommentForm, PostCommentFormSchema } from '../forms';
import type { Route } from './+types/snippet.route';

const SnippetRoute = ({ loaderData, actionData }: Route.ComponentProps) => {
  const { snippet } = loaderData;
  const user = useAuth();

  function handleDelete(e: React.FormEvent<HTMLFormElement>) {
    if (!confirm('Are you sure you want to delete this snippet?')) {
      e.preventDefault();
    }
  }

  return (
    <div className="overflow-x-hidden w-full flex flex-col gap-8 mt-4 px-1 md:mt-0">
      <div className="md:min-w-128 max-w-full top-0 self-center md:self-start gap-8 flex flex-col">
        <div className="flex flex-col gap-4">
          {user && snippet.user.id === user.id && (
            <div className="flex gap-2">
              <Button variant="link" asChild>
                <Link
                  to={href('/snippets/:snippetId/edit', { snippetId: snippet.id })}
                  className="flex gap-2 items-center text-sm text-olive-900 hover:text-olive-600"
                >
                  <Pencil size={16} />
                  <span>Edit Snippet</span>
                </Link>
              </Button>

              <Form method="post" onSubmit={handleDelete}>
                <input type="hidden" name="method" value="delete" />
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

      <section className="flex-1 mt-8 md:mt-0 flex flex-col gap-4 max-w-prose mx-auto md:mx-0 w-full">
        <Title level={3} className="font-bold font-mono text-lg text-olive-900 flex gap-2">
          <span>Comments</span>
          <Badge>{snippet.comments.length}</Badge>
        </Title>

        <ul className="flex flex-col gap-4 pl-2">
          {snippet.comments.map((comment) => (
            <Card asChild variant="secondary" key={comment.id}>
              <li className="p-2">{comment.content}</li>
            </Card>
          ))}
          <div className="h-32 shrink-0" />
        </ul>
      </section>
    </div>
  );
};

export async function loader({ params }: Route.LoaderArgs) {
  const snippetResult = await getSnippet({ id: params.snippetId });

  if (snippetResult.data) {
    return { snippet: snippetResult.data };
  }

  throw data(null, { status: STATUS_NOT_FOUND });
}

type ActionResult = {
  errorMessage?: string;
  postedComment?: TComment;
};

export async function action({ request, params }: Route.ActionArgs) {
  const result: ActionResult = { errorMessage: undefined, postedComment: undefined };
  const session = await getSession(request.headers.get('Cookie'));
  const token = session.get('token');

  if (!token) {
    return redirect('/login');
  }

  const formData = await request.formData();
  const form = Object.fromEntries(formData);

  if (form.method === 'delete') {
    const deleteResult = await deleteSnippet({ id: params.snippetId, token });

    if (deleteResult.data) {
      return redirect(href('/snippets'));
    }

    return data(result, { status: STATUS_SERVER });
  }

  const parseResult = PostCommentFormSchema.safeParse(form);

  if (parseResult.success) {
    const { comment } = parseResult.data;
    const postResult = await postComment({ snippetId: params.snippetId, comment, token });

    if (postResult.data) {
      return { ...result, postedComment: postResult.data };
    }

    const { error } = postResult;
    return data(
      { ...result, errorMessage: error.message },
      { status: error.type === ERROR_TYPE_SERVER ? error.status : STATUS_SERVER }
    );
  }

  return data({ ...result, errorMessage: 'Invalid data submitted' }, { status: STATUS_BAD_REQUEST });
}

export function meta() {
  return [{ title: 'Codelang | Snippet' }, { name: 'description', content: 'Codelang snippet' }];
}

export default SnippetRoute;

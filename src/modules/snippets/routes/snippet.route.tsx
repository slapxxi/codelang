import type { Route } from './+types/snippet.route';
import { data, redirect, href, Link, Form, useNavigation } from 'react-router';
import { useAuth } from '~/hooks';
import { deleteSnippet, getSnippet } from '~/lib/http';
import { Button, Card, CardBody, SnippetCard, Title } from '~/ui';
import { postComment } from '~/lib/http/post-comment.http';
import { getSession } from '~/app/session.server';
import { Pencil, Trash2 } from 'lucide-react';
import { PostCommentForm, PostCommentFormSchema } from '../forms';
import {
  ERROR_TYPE_SERVER,
  MESSAGE_INVALID_DATA,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_SERVER,
} from '~/app/const';

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
              <Link
                to={href('/snippets/:snippetId/edit', { snippetId: snippet.id })}
                className="flex gap-2 items-center text-sm text-olive-900 hover:text-olive-600"
              >
                <Pencil size={16} />
                <span>Edit Snippet</span>
              </Link>

              <Form method="post" onSubmit={handleDelete}>
                <input type="hidden" name="method" value="delete" />
                <Button variant="destructive">
                  Delete Snippet <Trash2 size={16} />
                </Button>
              </Form>
            </div>
          )}

          <SnippetCard snippet={snippet} expand={false} className="max-w-full min-w-0" />
        </div>

        {user && (
          <section className="flex flex-col gap-2">
            <PostCommentForm key={actionData?.data?.id} />
          </section>
        )}
      </div>

      <section className="flex-1 mt-8 md:mt-0 flex flex-col gap-4 max-w-prose mx-auto md:mx-0 w-full">
        <Title level={3} className="font-bold font-mono text-lg text-olive-900 flex gap-2">
          <span>Comments</span>
          <span className="leading-none p-1.5 bg-olive-700 text-white rounded-sm px-2 inline-flex items-center justify-center text-sm">
            {snippet.comments.length}
          </span>
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

export async function action({ request, params }: Route.ActionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const token = session.get('token');

  if (!token) {
    return redirect('/login');
  }

  const formData = await request.formData();
  const form = Object.fromEntries(formData);
  const parseResult = PostCommentFormSchema.safeParse(form);

  if (form.method === 'delete') {
    const deleteResult = await deleteSnippet({ id: params.snippetId, token });

    if (deleteResult.data) {
      return redirect(href('/snippets'));
    }

    return data(null, { status: STATUS_SERVER });
  }

  if (parseResult.success) {
    const { comment } = parseResult.data;
    const postResult = await postComment({ snippetId: params.snippetId, comment, token });

    if (postResult.data) {
      return { data: postResult.data, error: null };
    }

    if (postResult.error.type === ERROR_TYPE_SERVER) {
      const { message, status } = postResult.error;
      return data({ error: { message: message, status: status } }, { status: status });
    }

    const { message, e } = postResult.error;
    return data({ error: { message, e } }, { status: STATUS_BAD_REQUEST });
  }

  return data({ error: { message: MESSAGE_INVALID_DATA } }, { status: STATUS_BAD_REQUEST });
}

export function meta() {
  return [{ title: 'Codelang | Snippet' }, { name: 'description', content: 'Codelang snippet' }];
}

export default SnippetRoute;

import type { Route } from './+types/snippet.route';
import { data, redirect, href, Link } from 'react-router';
import { useAuth } from '~/hooks';
import { getSnippet } from '~/lib/http';
import { SnippetCard, Title } from '~/ui';
import { postComment } from '~/lib/http/post-comment.http';
import { getSession } from '~/app/session.server';
import { Pencil } from 'lucide-react';
import { PostCommentForm, PostCommentFormSchema } from '../forms';
import { MESSAGE_INVALID_DATA, STATUS_NOT_FOUND, STATUS_VALIDATION } from '~/app/const';

const SnippetRoute = ({ loaderData, actionData }: Route.ComponentProps) => {
  const { snippet } = loaderData;
  const user = useAuth();

  return (
    <div className="overflow-x-hidden w-full flex flex-col gap-8 mt-4 px-1 md:mt-0 lg:flex-row">
      <div className="top-0 self-center w-full lg:flex-1 md:self-start gap-8 flex flex-col lg:w-1/2 lg:sticky">
        <div className="flex flex-col gap-4">
          {user && snippet.user.id === user.id && (
            <Link
              to={href('/snippets/:snippetId/edit', { snippetId: snippet.id })}
              className="flex gap-2 items-center text-sm text-olive-900 hover:text-olive-600"
            >
              <Pencil size={16} />
              <span>Edit Snippet</span>
            </Link>
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

        <ul className="flex flex-col gap-4 pl-2 lg:w-full">
          {snippet.comments.map((comment) => (
            <li key={comment.id} className="bg-gray-50 shadow rounded-lg p-4 border border-gray-200">
              {comment.content}
            </li>
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

  if (parseResult.success) {
    const { comment } = parseResult.data;
    const postResult = await postComment({ snippetId: params.snippetId, comment, token });

    if (postResult.data) {
      return { data: postResult.data, error: null };
    }

    if (postResult.error.type === 'server') {
      const { message, status } = postResult.error;
      return data({ error: { message: message, status: status } }, { status: status });
    }

    const { message, e } = postResult.error;
    return data({ error: { message, e } }, { status: STATUS_VALIDATION });
  }

  return data({ error: { message: MESSAGE_INVALID_DATA } }, { status: STATUS_VALIDATION });
}

export function meta() {
  return [{ title: 'Codelang | Snippet' }, { name: 'description', content: 'Codelang snippet' }];
}

export default SnippetRoute;

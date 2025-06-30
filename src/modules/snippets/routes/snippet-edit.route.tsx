import { getSnippet, markSnippet } from '~/lib/http';
import type { Route } from './+types/snippet-edit.route';
import { Code, PageTitle } from '~/ui';
import { getSession } from '~/app/session.server';
import type { TMark } from '~/types';
import { href, redirect } from 'react-router';

export async function loader({ params }: Route.LoaderArgs) {
  const { data, error } = await getSnippet({ id: params.snippetId });

  if (data) {
    return { snippet: data.snippet };
  }

  return { error };
}

export async function action({ request, params }: Route.ActionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const formData = await request.formData();
  const mark = formData.get('mark') as TMark['type'];
  const token = session.get('token');

  if (!token) {
    return redirect(href('/login'));
  }

  if (mark) {
    const { data, error } = await markSnippet({ id: params.snippetId, token, mark });

    if (data) {
      return data;
    }

    return { error };
  }
}

const SnippetEditRoute = ({ loaderData }: Route.ComponentProps) => {
  const { snippet, error } = loaderData;

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div>
      <PageTitle>Edit Snippet</PageTitle>

      {snippet.language}
      <Code code={snippet.code}></Code>
    </div>
  );
};

export default SnippetEditRoute;

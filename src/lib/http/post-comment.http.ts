import * as z from 'zod/v4';
import { API_URL } from './const';
import { CommentSchema, UserSchema } from './schema';
import type { TResult, TComment } from '~/types';

const PostCommentResponse = z.object({
  ...CommentSchema.shape,
  user: UserSchema,
});

type Params = {
  comment: string;
  token: string;
};

type Result = TResult<TComment>;

export async function postComment(params: Params): Promise<Result> {
  const url = new URL(`${API_URL}/comments`);
  const response = await fetch(url, {
    method: 'post',
    body: JSON.stringify({ commentId: 195, content: params.comment }),
    headers: {
      'Content-Type': 'application/json',
      Cookie: `token=${params.token}`,
    },
  });

  if (response.ok) {
    const json = await response.json();
    const { success, data, error } = PostCommentResponse.safeParse(json.data);
    if (success) {
      return { data, error: null };
    }

    return { error: { type: 'unknown', message: 'Error parsing server response', e: error }, data: null };
  }

  console.log(response);
  return { error: { type: 'server', message: response.statusText, status: response.status }, data: null };
}

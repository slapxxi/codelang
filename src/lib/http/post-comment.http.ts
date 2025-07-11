import * as z from 'zod/v4';
import { ERROR_MESSAGES, ERROR_TYPE_EXCEPTION, ERROR_TYPE_SERVER } from '~/app/const';
import type { TComment, TResult } from '~/types';
import { API_URL } from './const';
import { CommentSchema, UserSchema } from './schema';

const PostCommentResponse = z.object({
  ...CommentSchema.shape,
  user: UserSchema,
});

type Params = {
  snippetId: string;
  comment: string;
  token: string;
};

type Result = TResult<TComment>;

export async function postComment(params: Params): Promise<Result> {
  try {
    const url = new URL(`${API_URL}/comments`);
    const response = await fetch(url, {
      method: 'post',
      body: JSON.stringify({ snippetId: params.snippetId, content: params.comment }),
      headers: {
        'Content-Type': 'application/json',
        Cookie: `token=${params.token}`,
      },
    });

    if (response.ok) {
      const json = await response.json();
      const data = PostCommentResponse.parse(json.data);
      return { data, error: null };
    }

    try {
      const json = await response.clone().json();
      return { error: { type: ERROR_TYPE_SERVER, message: json.message, status: response.status }, data: null };
    } catch {
      const body = await response.text();
      return { error: { type: ERROR_TYPE_SERVER, message: body, status: response.status }, data: null };
    }
  } catch (e) {
    return { error: { type: ERROR_TYPE_EXCEPTION, message: ERROR_MESSAGES.EXCEPTION, e }, data: null };
  }
}

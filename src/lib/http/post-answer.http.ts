import { ERROR_MESSAGES, ERROR_TYPES } from '~/app/const';
import type { TAnswer, TResult } from '~/types';
import { API_URL } from './const';
import { AnswerSchema } from './schema';

const PostAnswerResponse = AnswerSchema;

type Params = {
  questionId: string;
  content: string;
  token: string;
};

type Result = TResult<TAnswer>;

export async function postAnswer(params: Params): Promise<Result> {
  try {
    const url = new URL(`${API_URL}/answers`);
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ questionId: params.questionId, content: params.content }),
      headers: {
        'Content-Type': 'application/json',
        Cookie: `token=${params.token}`,
      },
    });

    if (response.ok) {
      const json = await response.json();
      const data = PostAnswerResponse.parse(json.data);
      return { data, error: null };
    }

    return { error: { type: ERROR_TYPES.SERVER, message: response.statusText, status: response.status }, data: null };
  } catch (e) {
    return { error: { type: ERROR_TYPES.EXCEPTION, message: ERROR_MESSAGES.EXCEPTION, e }, data: null };
  }
}

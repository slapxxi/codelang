import * as z from 'zod/v4';
import { API_URL } from './const';
import type { TResult } from '~/types';
import { ERROR_TYPE_EXCEPTION, ERROR_TYPE_SERVER, MESSAGE_EXCEPTION, MESSAGE_PARSING_ERROR } from '~/app/const';
import { QuestionSchema } from './schema';

const DeleteQuestionResponse = QuestionSchema.pick({ title: true, description: true, attachedCode: true, user: true });

type Params = {
  id: string;
  token: string;
};

type Result = TResult<z.infer<typeof DeleteQuestionResponse>>;

export async function deleteQuestion(params: Params): Promise<Result> {
  try {
    const url = new URL(`${API_URL}/questions/${params.id}`);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `token=${params.token}`,
      },
    });

    if (response.ok) {
      const json = await response.json();
      const { success, data } = DeleteQuestionResponse.safeParse(json.data);

      if (success) {
        return {
          data,
          error: null,
        };
      }

      return {
        error: { type: ERROR_TYPE_SERVER, message: MESSAGE_PARSING_ERROR, status: response.status },
        data: null,
      };
    }

    return {
      error: { type: ERROR_TYPE_SERVER, message: `Error deleting question`, status: response.status },
      data: null,
    };
  } catch (e) {
    return { error: { type: ERROR_TYPE_EXCEPTION, message: MESSAGE_EXCEPTION, e }, data: null };
  }
}

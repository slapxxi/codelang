import * as z from 'zod/v4';
import { ERROR_MESSAGES, ERROR_TYPES } from '~/app/const';
import type { TResult } from '~/types';
import { API_URL } from './const';
import { QuestionSchema } from './schema';

const UpdateQuestionResponse = QuestionSchema.pick({
  id: true,
  title: true,
  description: true,
  attachedCode: true,
  user: true,
});

type Params = {
  id: string;
  title: string;
  description: string;
  code: string;
  token: string;
};

type Result = TResult<z.infer<typeof UpdateQuestionResponse>>;

export async function updateQuestion(params: Params): Promise<Result> {
  try {
    const url = new URL(`${API_URL}/questions/${params.id}`);
    const response = await fetch(url, {
      method: 'PATCH',
      body: JSON.stringify({ title: params.title, description: params.description, attachedCode: params.code }),
      headers: { 'Content-Type': 'application/json', Cookie: `token=${params.token}` },
    });

    if (response.ok) {
      const json = await response.json();
      const { success, data } = UpdateQuestionResponse.safeParse(json.data);

      if (success) {
        return { data, error: null };
      }

      return {
        error: { type: ERROR_TYPES.SERVER, message: ERROR_MESSAGES.PARSING_ERROR, status: response.status },
        data: null,
      };
    }

    return {
      error: { type: ERROR_TYPES.SERVER, message: ERROR_MESSAGES.RESPONSE_NOT_OK, status: response.status },
      data: null,
    };
  } catch (e) {
    return { error: { type: ERROR_TYPES.EXCEPTION, message: ERROR_MESSAGES.EXCEPTION, e }, data: null };
  }
}

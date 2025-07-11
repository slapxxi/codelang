import * as z from 'zod/v4';
import { ERROR_MESSAGES, ERROR_TYPES } from '~/app/const';
import type { TResult } from '~/types';
import { API_URL } from './const';
import { QuestionSchema } from './schema';

const CreateQuestionResponse = QuestionSchema.omit({ answers: true, isResolved: true });

type Params = {
  title: string;
  description: string;
  code: string;
  token: string;
};

type Result = TResult<z.infer<typeof CreateQuestionResponse>>;

export async function createQuestion(params: Params): Promise<Result> {
  try {
    const url = new URL(`${API_URL}/questions`);
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ title: params.title, description: params.description, attachedCode: params.code }),
      headers: { 'Content-Type': 'application/json', Cookie: `token=${params.token}` },
    });

    if (response.ok) {
      const json = await response.json();
      const { success, data } = CreateQuestionResponse.safeParse(json.data);

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

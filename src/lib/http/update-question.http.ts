import { API_URL } from './const';
import { QuestionSchema } from './schema';
import type { TResult } from '~/types';
import {
  ERROR_TYPE_EXCEPTION,
  ERROR_TYPE_SERVER,
  MESSAGE_EXCEPTION,
  MESSAGE_PARSING_ERROR,
  MESSAGE_RESPONSE_NOT_OK,
} from '~/app/const';
import * as z from 'zod/v4';

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
        error: { type: ERROR_TYPE_SERVER, message: MESSAGE_PARSING_ERROR, status: response.status },
        data: null,
      };
    }

    return {
      error: { type: ERROR_TYPE_SERVER, message: MESSAGE_RESPONSE_NOT_OK, status: response.status },
      data: null,
    };
  } catch (e) {
    return { error: { type: ERROR_TYPE_EXCEPTION, message: MESSAGE_EXCEPTION, e }, data: null };
  }
}

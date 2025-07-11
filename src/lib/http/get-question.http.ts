import * as z from 'zod/v4';
import { ERROR_MESSAGES, ERROR_TYPES } from '~/app/const';
import type { TQuestion, TResult } from '~/types';
import { API_URL } from './const';
import { QuestionSchema, QuestionSchemaWithCodeHighlighted } from './schema';

const GetQuestionResponse = QuestionSchema;

type Params = {
  id: z.infer<typeof QuestionSchema>['id'] | null;
};

type Result = TResult<TQuestion>;

export async function getQuestion(params: Params): Promise<Result> {
  try {
    const url = new URL(`${API_URL}/questions/${params.id}`);
    const response = await fetch(url);

    if (response.ok) {
      const json = await response.json();
      const data = GetQuestionResponse.parse(json.data);
      const question = await QuestionSchemaWithCodeHighlighted.parseAsync(data);
      return { data: question, error: null };
    }

    try {
      const json = await response.clone().json();
      return {
        error: {
          type: ERROR_TYPES.SERVER,
          message: json.message || ERROR_MESSAGES.RESPONSE_NOT_OK,
          status: response.status,
        },
        data: null,
      };
    } catch {
      const body = await response.text();
      return {
        error: { type: ERROR_TYPES.SERVER, message: body || ERROR_MESSAGES.RESPONSE_NOT_OK, status: response.status },
        data: null,
      };
    }
  } catch (e) {
    return { error: { type: ERROR_TYPES.EXCEPTION, message: ERROR_MESSAGES.EXCEPTION, e }, data: null };
  }
}

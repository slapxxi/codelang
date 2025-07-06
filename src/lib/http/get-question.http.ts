import * as z from 'zod/v4';
import { API_URL } from './const';
import { QuestionSchema, QuestionSchemaWithCodeHighlighted } from './schema';
import type { TQuestion, TResult } from '~/types';
import { ERROR_TYPE_EXCEPTION, ERROR_TYPE_SERVER, MESSAGE_EXCEPTION, MESSAGE_RESPONSE_NOT_OK } from '~/app/const';

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
        error: { type: ERROR_TYPE_SERVER, message: json.message || MESSAGE_RESPONSE_NOT_OK, status: response.status },
        data: null,
      };
    } catch {
      const body = await response.text();
      return {
        error: { type: ERROR_TYPE_SERVER, message: body || MESSAGE_RESPONSE_NOT_OK, status: response.status },
        data: null,
      };
    }
  } catch (e) {
    return { error: { type: ERROR_TYPE_EXCEPTION, message: MESSAGE_EXCEPTION, e }, data: null };
  }
}

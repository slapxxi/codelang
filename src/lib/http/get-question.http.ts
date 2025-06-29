import * as z from 'zod/v4';
import { API_URL } from './const';
import { QuestionSchema, QuestionSchemaWithCodeHighlighted } from './schema';
import type { Question } from '~/types';

const GetQuestionResponse = QuestionSchema;

type Params = {
  id: z.infer<typeof QuestionSchema>['id'] | null;
};

type Result =
  | {
      question: Question;
      error: null;
    }
  | {
      question: null;
      error: ReturnType<typeof GetQuestionResponse.safeParse>['error'];
    };

export async function getQuestion(params: Params): Promise<Result> {
  const id = QuestionSchema.shape.id.parse(params.id);
  const url = new URL(`${API_URL}/questions/${id}`);
  const response = await fetch(url);
  const json = await response.json();
  const { success, data, error } = GetQuestionResponse.safeParse(json.data);

  if (success) {
    const question = await QuestionSchemaWithCodeHighlighted.parseAsync(data);
    return { question, error: null };
  }

  return { error, question: null };
}

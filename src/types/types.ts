import * as z from 'zod/v4';
import type {
  CommentSchema,
  MarkSchema,
  QuestionSchemaWithCodeHighlighted,
  SnippetSchemaWithLikes,
  UserSchema,
  UserStatsSchema,
} from '~/lib/http';

export type TUser = z.infer<typeof UserSchema>;
export type TUserStats = z.infer<typeof UserStatsSchema>;

export type UserRole = 'admin' | 'user';

export type TSnippet = z.infer<typeof SnippetSchemaWithLikes>;

export type TComment = z.infer<typeof CommentSchema>;

export type TQuestion = z.infer<typeof QuestionSchemaWithCodeHighlighted>;

export type TFormErrors<FormSchema> = { [K in keyof FormSchema]?: string[] };

export type TMark = Omit<z.infer<typeof MarkSchema>, 'type'> & { type: 'like' | 'dislike' | 'none' };

export type TResult<T> =
  | {
      data: T;
      error: null;
    }
  | { data: null; error: TResultError };

export type TResultError = TServerError | TExceptionError;

export type TServerError = {
  type: 'server';
  status: number;
  message: string;
  e?: unknown;
  response?: Response;
};

export type TExceptionError = {
  type: 'exception';
  message: string;
  e: unknown;
};

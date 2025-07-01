import * as z from 'zod/v4';
import type { CommentSchema, MarkSchema, QuestionSchema, SnippetSchema, UserSchema, UserStatsSchema } from '~/lib/http';

export type TUser = z.infer<typeof UserSchema>;
export type TUserStats = z.infer<typeof UserStatsSchema>;

export type UserRole = 'admin' | 'user';

export type TSnippet = z.infer<typeof SnippetSchema> & { likes: number; dislikes: number; formattedCode: string };

export type TComment = z.infer<typeof CommentSchema>;

export type Question = z.infer<typeof QuestionSchema>;

export type TFormErrors<FormSchema> = { [K in keyof FormSchema]?: string[] };

export type TMark = Omit<z.infer<typeof MarkSchema>, 'type'> & { type: 'like' | 'dislike' | 'none' };

export type TResult<T> =
  | {
      data: T;
      error: null;
    }
  | { data: null; error: TResultError };

export type TResultError =
  | {
      type: 'unknown';
      message: string;
      e: unknown;
    }
  | { type: 'server'; message: string; status: number };

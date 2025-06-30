import * as z from 'zod/v4';
import type { CommentSchema, MarkSchema, QuestionSchema, SnippetSchema, UserSchema } from '~/lib/http';

export type TUser = z.infer<typeof UserSchema>;

export type UserRole = 'admin' | 'user';

export type Snippet = z.infer<typeof SnippetSchema> & { likes: number; dislikes: number };

export type Comment = z.infer<typeof CommentSchema>;

export type Question = z.infer<typeof QuestionSchema>;

export type TFormErrors<FormSchema> = { [K in keyof FormSchema]?: string[] };

export type TMark = Omit<z.infer<typeof MarkSchema>, 'type'> & { type: 'like' | 'dislike' | 'none' };

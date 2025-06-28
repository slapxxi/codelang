import * as z from 'zod/v4';
import type { CommentSchema, QuestionSchema, SnippetSchema, UserSchema } from '~/lib/http';

export type User = z.infer<typeof UserSchema>;

export type UserRole = 'admin' | 'user';

export type Snippet = z.infer<typeof SnippetSchema> & { likes: number; dislikes: number };

export type Comment = z.infer<typeof CommentSchema>;

export type Question = z.infer<typeof QuestionSchema>;

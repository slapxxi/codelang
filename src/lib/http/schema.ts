import * as z from 'zod/v4';
import { highlighter } from '~/lib/shiki';

export const UserRoleSchema = z.enum(['user', 'admin']);

export const UserSchema = z.object({ id: z.string(), username: z.string(), role: UserRoleSchema });

export const MarkSchema = z.object({ id: z.string(), type: z.string(), user: UserSchema });

export const CommentSchema = z.object({ id: z.string(), content: z.string() });

export const SnippetSchema = z.object({
  id: z.string(),
  code: z.string(),
  language: z.string(),
  user: UserSchema,
  marks: MarkSchema.array(),
  comments: CommentSchema.array(),
});

export const SnippetSchemaWithLikes = SnippetSchema.transform((snippet) => {
  return {
    ...snippet,
    likes: snippet.marks.reduce((acc, mark) => (mark.type === 'like' ? acc + 1 : acc), 0),
    dislikes: snippet.marks.reduce((acc, mark) => (mark.type === 'dislike' ? acc + 1 : acc), 0),
  };
});

export const SnippetSchemaWithCodeHighlighted = SnippetSchema.transform(async (snippet) => {
  const hl = await highlighter;
  const code = hl.codeToHtml(snippet.code, { lang: snippet.language, theme: 'vitesse-light' });
  return { ...snippet, code };
});

export const QuestionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  attachedCode: z.string(),
  user: UserSchema,
  answers: CommentSchema.array(),
  isResolved: z.boolean(),
});

export const QuestionSchemaWithCodeHighlighted = QuestionSchema.transform(async (question) => {
  const hl = await highlighter;
  const attachedCode = hl.codeToHtml(question.attachedCode, { lang: 'css', theme: 'vitesse-light' });
  return { ...question, attachedCode };
});

export const MetaSchema = z.object({
  currentPage: z.number(),
  itemsPerPage: z.number(),
  totalItems: z.number(),
  totalPages: z.number(),
  sortBy: z.string().array(),
});

export const LinksSchema = z.object({ current: z.string() });

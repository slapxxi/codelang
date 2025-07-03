import * as z from 'zod/v4';
import { highlighter } from '~/lib/shiki';

export const UserRoleSchema = z.enum(['user', 'admin']);

export const UserSchema = z.object({ id: z.string(), username: z.string(), role: UserRoleSchema });

export const UserStatsSchema = UserSchema.extend({
  statistic: z.object({
    snippetsCount: z.number(),
    rating: z.number(),
    commentsCount: z.number(),
    likesCount: z.number(),
    dislikesCount: z.number(),
    questionsCount: z.number(),
    correctAnswersCount: z.number(),
    regularAnswersCount: z.number(),
  }),
});

export const MarkSchema = z.object({ id: z.string(), type: z.enum(['like', 'dislike']), user: UserSchema });

export const CommentSchema = z.object({ id: z.string(), content: z.string() });

export const SnippetSchema = z.object({
  id: z.string(),
  code: z.string(),
  language: z.string(),
  user: UserSchema,
  marks: MarkSchema.array(),
  comments: CommentSchema.array(),
});

export const SnippetSchemaWithCodeHighlighted = SnippetSchema.transform(async (snippet) => {
  const hl = await highlighter;
  const code = hl.codeToHtml(snippet.code, { lang: matchLang(snippet.language), theme: 'vitesse-dark' });
  return { ...snippet, formattedCode: code };
});

export const SnippetSchemaWithLikes = SnippetSchemaWithCodeHighlighted.transform((snippet) => {
  return {
    ...snippet,
    likes: snippet.marks.reduce((acc, mark) => (mark.type === 'like' ? acc + 1 : acc), 0),
    dislikes: snippet.marks.reduce((acc, mark) => (mark.type === 'dislike' ? acc + 1 : acc), 0),
  };
});

function matchLang(lang: string) {
  const l = lang.toLowerCase();
  const map = {
    [l]: l,
    'c/c++': 'cpp',
  };
  return ['javascript', 'typescript', 'css', 'go', 'c/c++'].includes(l) ? map[l] : 'text';
}

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
  const formattedCode = hl.codeToHtml(question.attachedCode, { lang: 'text', theme: 'vitesse-dark' });
  return { ...question, formattedCode };
});

export const MetaSchema = z.object({
  currentPage: z.number(),
  itemsPerPage: z.number(),
  totalItems: z.number(),
  totalPages: z.number(),
  sortBy: z.string().array(),
});

export const LinksSchema = z.object({ current: z.string() });

export const EndpointFailureSchema = z.object({
  statusCode: z.number(),
  endpoint: z.string(),
  message: z.string(),
  errors: z
    .array(
      z.object({
        field: z.string(),
        receivedValue: z.string().optional(),
        failures: z.array(z.string()),
      })
    )
    .optional(),
});

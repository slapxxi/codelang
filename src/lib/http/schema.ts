import * as z from 'zod/v4';

export const UserRoleSchema = z.enum(['user', 'admin']);

export const UserSchema = z.object({ id: z.string(), username: z.string(), role: UserRoleSchema });

export const MarkSchema = z.object({ id: z.string(), type: z.string(), user: UserSchema });

export const Comment = z.object({ id: z.string(), content: z.string() });

export const SnippetSchema = z.object({
  id: z.string(),
  code: z.string(),
  language: z.string(),
  user: UserSchema,
  marks: MarkSchema.array(),
  comments: Comment.array(),
});

export const MetaSchema = z.object({
  currentPage: z.number(),
  itemsPerPage: z.number(),
  totalItems: z.number(),
  totalPages: z.number(),
  sortBy: z.string().array(),
});

export const LinksSchema = z.object({ current: z.string() });

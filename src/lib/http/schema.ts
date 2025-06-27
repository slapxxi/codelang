import * as z from 'zod/v4';

export const UserRole = z.enum(['user', 'admin']);

export const User = z.object({ id: z.string(), username: z.string(), role: UserRole });

export const Mark = z.object({ id: z.string(), type: z.string(), user: User });

export const Comment = z.object({ id: z.string(), content: z.string() });

export const Snippet = z.object({
  id: z.string(),
  code: z.string(),
  language: z.string(),
  user: User,
  marks: Mark.array(),
  comments: Comment.array(),
});

export const Meta = z.object({
  currentPage: z.number(),
  itemsPerPage: z.number(),
  totalItems: z.number(),
  totalPages: z.number(),
  sortBy: z.string().array(),
});

export const Links = z.object({ current: z.string() });

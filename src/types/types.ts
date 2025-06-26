export type User = {
  id: number;
  username: string;
  role: UserRole;
};

export type UserRole = 'admin' | 'user';

export type Snippet = { id: string; language: string; code: string; user: User; likes: number; dislikes: number };

export type Comment = {
  id: string;
  content: string;
  user: User;
};

export type Question = {
  id: string;
  title: string;
  description: string;
  attachedCode: string;
  user: User;
  answers: Comment[];
  isResolved: boolean;
};

export type Mark = {
  id: string;
  type: 'like' | 'dislike';
  user: User;
};

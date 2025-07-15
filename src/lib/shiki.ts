import { createHighlighter } from 'shiki';

// `createHighlighter` is async, it initializes the internal and
// loads the themes and languages specified.
export const highlighter = createHighlighter({
  themes: ['vitesse-dark'],
  langs: ['javascript', 'java', 'kotlin', 'python', 'go', 'ruby', 'cpp', 'c#'],
});

import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';

export default [
  route('/register', './routes/register.route.tsx'),
  route('/login', './routes/login.route.tsx'),

  layout('./layouts/main.layout.tsx', [
    index('./routes/home.route.tsx'),
    route('/profile', './routes/profile.route.tsx'),

    route('/users', '../modules/users/routes/users.route.tsx', [
      route(':userId', '../modules/users/routes/user.route.tsx'),
    ]),

    route('/snippets', '../modules/snippets/routes/snippets.route.tsx', [
      route(':snippetId', '../modules/snippets/routes//snippet.route.tsx'),
      route(':snippetId/edit', '../modules/snippets/routes/snippet-edit.route.tsx'),
    ]),

    route('/questions', '../modules/questions/routes/questions.route.tsx', [
      route('new', '../modules/questions/routes/questions-new.route.tsx'),
      route(':questionId', '../modules/questions/routes/question.route.tsx'),
      route(':questionId/edit', '../modules/questions/routes/question-edit.route.tsx'),
    ]),
  ]),
] satisfies RouteConfig;

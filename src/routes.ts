import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';

export default [
  route('/register', './modules/auth/routes/register.route.tsx'),
  route('/login', './modules/auth/routes/login.route.tsx'),

  layout('./app/layouts/main.layout.tsx', [
    index('./app/routes/home.route.tsx'),
    route('/profile', './modules/auth/routes/profile.route.tsx'),

    route('/users', './modules/users/routes/users.route.tsx'),
    route('/users/:userId', './modules/users/routes/user.route.tsx'),

    route('/snippets', './modules/snippets/routes/snippets.route.tsx', [
      route(':snippetId/edit', './modules/snippets/routes/snippet-edit.route.tsx'),
    ]),
    route('/snippets/:snippetId', './modules/snippets/routes/snippet.route.tsx'),

    route('/questions', './modules/questions/routes/questions.route.tsx', [
      route('new', './modules/questions/routes/questions-new.route.tsx'),
      route(':questionId/edit', './modules/questions/routes/question-edit.route.tsx'),
    ]),
    route('/questions/:questionId', './modules/questions/routes/question.route.tsx'),
  ]),
] satisfies RouteConfig;

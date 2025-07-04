import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';

export default [
  layout('./modules/auth/layouts/auth.layout.tsx', [
    route('/register', './modules/auth/routes/register.route.tsx'),
    route('/login', './modules/auth/routes/login.route.tsx'),
    route('/logout', './modules/auth/routes/logout.route.tsx'),
  ]),

  layout('./app/layouts/main.layout.tsx', [
    index('./app/routes/home.route.tsx'),
    route('/profile', './modules/users/routes/profile.route.tsx'),

    route('/users', './modules/users/routes/users.route.tsx'),
    route('/users/:userId', './modules/users/routes/user.route.tsx'),

    route('/snippets', './modules/snippets/routes/snippets.route.tsx'),
    route('/snippets/new', './modules/snippets/routes/snippets-new.route.tsx'),
    route('/snippets/:snippetId', './modules/snippets/routes/snippet.route.tsx'),
    route('/snippets/:snippetId/edit', './modules/snippets/routes/snippet-edit.route.tsx'),

    route('/questions', './modules/questions/routes/questions.route.tsx', []),
    route('/questions/new', './modules/questions/routes/questions-new.route.tsx'),
    route('/questions/:questionId', './modules/questions/routes/question.route.tsx'),
    route('/questions/:questionId/edit', './modules/questions/routes/question-edit.route.tsx'),
    route('/questions/:questionId/delete', './modules/questions/routes/question-delete.route.tsx'),
    route('/questions/:questionId/answers', './modules/questions/routes/question-answers.route.tsx'),
  ]),

  route('/api/me', './modules/api/routes/me.route.tsx'),
] satisfies RouteConfig;

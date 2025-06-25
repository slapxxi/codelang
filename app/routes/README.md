App routes

In `routes.ts`:

```ts
import { type RouteConfig, route } from '@react-router/dev/routes';

export default [route('some/path', '~/routes/some-path.route.tsx')] satisfies RouteConfig;
```

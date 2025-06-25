import type { Route } from './+types/home.route';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Codelang' }, { name: 'description', content: 'Codelang' }];
}

const HomeRoute = () => <div className="container mx-auto p-4 pt-16">Home</div>;

export default HomeRoute;

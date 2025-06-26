import type { Route } from './+types/home.route.tsx';
import { usePointerPosition } from '~/hooks';
import { LayoutContainer, Logo, Navbar } from '~/ui';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Codelang' }, { name: 'description', content: 'Codelang' }];
}

const HomeRoute = () => {
  const ref = usePointerPosition<HTMLDivElement>({ disabled: false });

  return (
    <LayoutContainer ref={ref}>
      <Logo />
      <Navbar className="absolute m-2" />
    </LayoutContainer>
  );
};

export default HomeRoute;

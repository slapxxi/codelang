import { Outlet } from 'react-router';
import { LayoutContainer, Logo } from '~/ui';

const AuthLayout = () => {
  return (
    <LayoutContainer className="flex flex-col justify-center gap-4">
      <header className="flex justify-center p-4">
        <Logo size="lg" className="-translate-x-2" />
      </header>

      <Outlet />
    </LayoutContainer>
  );
};

export default AuthLayout;

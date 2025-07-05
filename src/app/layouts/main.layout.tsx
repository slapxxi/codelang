import type { Route } from './+types/main.layout';
import { Code, FileQuestionMark, Home, Menu, User, Users } from 'lucide-react';
import { LayoutContainer, Logo, Navbar } from '~/ui';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '~/ui/base';
import { useState } from 'react';
import { href, Link, Outlet } from 'react-router';
import { getUserFromSession } from '../get-user-from-session.server';

const MainLayout = ({ loaderData }: Route.ComponentProps) => {
  const { user } = loaderData ?? {};
  const [open, setOpen] = useState(false);

  return (
    <LayoutContainer disableMotion>
      <header className="pl-4 bg-zinc-900 text-white flex items-center justify-between md:hidden">
        <Logo light />

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="p-4">
              <Menu />
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle hidden>Hello</DialogTitle>
            <ul className="flex flex-col gap-2">
              {[
                { path: href('/'), Icon: Home, text: 'Home' },
                { path: href('/questions'), Icon: FileQuestionMark, text: 'Questions' },
                { path: href('/snippets'), Icon: Code, text: 'Snippets' },
                { path: href('/users'), Icon: Users, text: 'Users' },
                { path: href('/profile'), Icon: User, text: 'Profile' },
              ].map((p, i) => (
                <li key={i}>
                  <Link to={p.path} className="flex gap-2 items-center">
                    <p.Icon />
                    {p.text}
                  </Link>
                </li>
              ))}
            </ul>
          </DialogContent>
        </Dialog>
      </header>

      <div className="overflow-y-auto h-screen md:flex gap-4 md:p-2 max-w-[1500px] mx-auto [scrollbar-width:none] relative">
        <Navbar className="hidden self-start sticky top-0 md:flex" user={user} />

        <Outlet />

        <Logo className="fixed bottom-0 right-0 hidden md:flex p-2" size="sm" />
      </div>
    </LayoutContainer>
  );
};

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUserFromSession(request);
  return { user: user ?? undefined };
}

export default MainLayout;

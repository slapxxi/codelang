import type { Route } from './+types/main.layout';
import { Code, FileQuestionMark, Home, Menu, User, Users } from 'lucide-react';
import { LayoutContainer, Logo, Navbar } from '~/ui';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '~/ui/base';
import { useState } from 'react';
import { href, Link, Outlet } from 'react-router';
import { getUserFromSession } from '../get-user-from-session.server';
import { cn } from '~/utils';

const MainLayout = ({ loaderData }: Route.ComponentProps) => {
  const { user } = loaderData ?? {};
  const [open, setOpen] = useState(false);

  return (
    <LayoutContainer disableMotion>
      <header className="flex items-center justify-between bg-zinc-900 pl-4 text-white md:hidden">
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
                  <Link to={p.path} className="flex items-center gap-2">
                    <p.Icon />
                    {p.text}
                  </Link>
                </li>
              ))}
            </ul>
          </DialogContent>
        </Dialog>
      </header>

      <div className={cn('md:flex gap-4 md:p-2 max-w-[1500px] mx-auto [scrollbar-width:thin] relative')}>
        <Navbar className="sticky top-2 left-2 hidden self-start md:flex" user={user} />
        <Outlet />
        <Logo className="fixed right-0 bottom-0 hidden p-2 md:flex" size="sm" />
      </div>
    </LayoutContainer>
  );
};

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUserFromSession(request);
  return { user: user ?? undefined };
}

export default MainLayout;

import { Code, FileQuestionMark, Home, Menu, User, Users } from 'lucide-react';
import { usePointerPosition } from '~/hooks';
import { Avatar, LayoutContainer, Logo, Navbar } from '~/ui';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '~/ui/base';
import { useState } from 'react';
import { href, Link, Outlet } from 'react-router';

const MainLayout = () => {
  const ref = usePointerPosition<HTMLDivElement>({ disabled: true });
  const [open, setOpen] = useState(false);

  return (
    <LayoutContainer ref={ref}>
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

      <div className="overflow-y-auto max-h-screen md:flex gap-2 md:p-2 max-w-[1500px] mx-auto [scrollbar-width:none] relative">
        <Navbar className="hidden self-start sticky top-0 md:flex" />

        <Outlet />

        <aside className="hidden self-start lg:flex flex-col p-2  bg-olive-500/80 min-w-2/12 ml-auto sticky top-0 backdrop-blur-[1px] rounded-lg shadow border border-olive-500/30">
          <h2 className="font-mono font-semibold text-olive-950 text-center">Sidebar</h2>
        </aside>

        <Logo className="fixed bottom-0 right-0 hidden md:flex" />
      </div>
    </LayoutContainer>
  );
};

export default MainLayout;

import { Code, FileQuestionMark, Home, Menu, User, Users } from 'lucide-react';
import { Avatar, LayoutContainer, Logo, Navbar } from '~/ui';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '~/ui/base';
import { useState } from 'react';
import { href, Link, Outlet } from 'react-router';

const MainLayout = () => {
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
        <Navbar className="hidden self-start sticky top-0 md:flex">
          <Link to={href('/register')}>
            <Avatar className="absolute top-full left-1/2 -translate-x-1/2 mt-4" />
          </Link>
        </Navbar>

        <Outlet />

        <aside className="hidden lg:flex flex-col flex-1 max-w-72 px-4 p-2 bg-olive-100 min-w-2/12 ml-auto sticky top-0 backdrop-blur-[1px] rounded-xl shadow border border-olive-500/30">
          <h2 className="font-mono font-semibold text-olive-600 text-shadow-xs text-shadow-olive-50">Sidebar</h2>
        </aside>

        <Logo className="fixed bottom-0 right-0 hidden md:flex" />
      </div>
    </LayoutContainer>
  );
};

export default MainLayout;

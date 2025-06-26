import { Code, FileQuestionMark, Home, Menu, User, Users } from 'lucide-react';
import type { Route } from './+types/home.route.tsx';
import { usePointerPosition } from '~/hooks';
import { getSnippets } from '~/lib/http';
import { LayoutContainer, Logo, Navbar } from '~/ui';
import { SnippetCard } from '~/ui/snippet-card.ui.js';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '~/ui/base';
import { useState } from 'react';
import { Link } from 'react-router';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Codelang' }, { name: 'description', content: 'Codelang' }];
}

export async function loader() {
  const snippets = await getSnippets();
  return { snippets };
}

const HomeRoute = ({ loaderData }: Route.DataArgs) => {
  const { snippets } = loaderData;
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
                { path: '/', Icon: Home, text: 'Home' },
                { path: '/', Icon: FileQuestionMark, text: 'Questions' },
                { path: '/', Icon: Code, text: 'Snippets' },
                { path: '/', Icon: Users, text: 'Users' },
                { path: '/', Icon: User, text: 'Profile' },
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

      <div className="overflow-y-auto max-h-screen md:flex gap-2 md:p-2">
        <Navbar className="hidden self-start sticky top-0 md:flex" />

        <ul className="flex flex-col md:grid grid-cols-2 gap-2">
          {intoColumns(snippets, 2).map((col, i) => (
            <div key={i} className="contents md:flex flex-col gap-2 pb-12">
              {col.map((s) => (
                <SnippetCard snippet={s} key={s.id} />
              ))}
            </div>
          ))}
        </ul>

        <aside className="hidden lg:flex squircle squircle-radius-10 bg-olive-400 squircle-fill-olive-500 min-w-2/12 ml-auto sticky top-0">
          <h2>Sidebar</h2>
        </aside>
      </div>

      <Logo className="fixed bottom-4 right-8 hidden md:flex" />
    </LayoutContainer>
  );
};

function intoColumns(items: any[], cols: number) {
  const result = [];
  for (let i = 0; i < items.length; i++) {
    const colNumber = i % cols;
    if (!result[colNumber]) {
      result[colNumber] = [];
    }
    result[colNumber].push(items[i]);
  }
  return result;
}

export default HomeRoute;

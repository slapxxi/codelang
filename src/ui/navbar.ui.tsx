import { href, Link, NavLink } from 'react-router';
import { Code, FileQuestionMark, Home, LogIn, User, Users } from 'lucide-react';

import { cn } from '~/utils';
import { useAuth, useNavbar } from '~/hooks';
import { Avatar } from './avatar.ui';

type NavbarProps = {
  className?: string;
  children?: React.ReactNode;
};

export const Navbar: React.FC<NavbarProps> = (props) => {
  const { className, children } = props;
  const { open, toggle: toggleOpen } = useNavbar();
  const user = useAuth();

  return (
    <div
      className={cn(
        'squircle squircle-fill-zinc-950/90 backdrop-blur-[1px]',
        'flex flex-col text-zinc-50 drop-shadow-lg drop-shadow-zinc-500/30 ',
        className
      )}
    >
      <nav>
        <ul className="flex p-2 gap-4 flex-col">
          {[
            { Icon: Home, text: 'Home', path: href('/') },
            { Icon: FileQuestionMark, text: 'Questions', path: href('/questions') },
            { Icon: Code, text: 'Snippets', path: href('/snippets') },
            { Icon: Users, text: 'Users', path: href('/users') },
            user && { Icon: User, text: 'Profile', path: href('/profile') },
          ].map(
            (item, i) =>
              item !== null && (
                <li key={i}>
                  <NavLink
                    to={item.path}
                    className={({ isActive, isPending }) =>
                      cn(
                        'flex gap-2 hover:bg-zinc-800 p-2 rounded-lg',
                        isActive && 'bg-zinc-700 hover:bg-zinc-700 shadow-sm',
                        isPending && 'animate-shimmer hover:bg-transparent shimmer bg-transparent'
                      )
                    }
                    style={({ isPending }) => ({ animationDelay: isPending ? '0' : `${i * 45}ms` })}
                  >
                    <item.Icon />
                    <span className={cn(open ? 'flex-1 overflow-hidden inline-flex' : 'hidden', 'delay-[inherit]')}>
                      <span className={cn(open ? 'animate-slide-in delay-[inherit]' : 'hidden')}>{item.text}</span>
                    </span>
                  </NavLink>
                </li>
              )
          )}
        </ul>
      </nav>

      <div className="h-8" />

      <button
        className="inline-flex gap-2 p-2 rounded-lg group cursor-pointer text-zinc-400 hover:text-zinc-50 mt-auto mb-2"
        onClick={() => toggleOpen()}
      >
        <span className="p-2 rounded-lg group-hover:bg-zinc-800 group-active:bg-zinc-900 w-full">
          <svg viewBox="0 0 24 24" className="size-6 cap-round join-round stroke-2 stroke-current fill-none">
            {open ? (
              <>
                <clipPath id="clip0">
                  <rect width="14" height="24" fill="none" x="0" />
                </clipPath>
                <g clipPath="url(#clip0)">
                  <g className="group-hover:animate-point-reverse">
                    <path d="m9 6-6 6 6 6" />
                    <path d="M3 12h14" />
                  </g>
                </g>
                <path d="M21 19V5" />
              </>
            ) : (
              <>
                <clipPath id="clip0">
                  <rect width="24" height="24" fill="none" x="10" />
                </clipPath>
                <path d="M3 5v14" />
                <g clipPath="url(#clip0)">
                  <g className="group-hover:animate-point">
                    <path d="M21 12H7" />
                    <path d="m15 18 6-6-6-6" />
                  </g>
                </g>
              </>
            )}
          </svg>
        </span>
      </button>

      {user ? (
        <Link to={href('/logout')}>
          <Avatar className="absolute top-full left-1/2 -translate-x-1/2 mt-4" />
        </Link>
      ) : (
        <Link to={href('/login')}>
          <LogIn className="absolute top-full left-1/2 -translate-x-1/2 mt-4 text-zinc-600" />
        </Link>
      )}

      {children}
    </div>
  );
};

import { Code, FileQuestionMark, Home, LogIn, User, Users } from 'lucide-react';
import { useId } from 'react';
import { href, Link, NavLink } from 'react-router';
import { useNavbar } from '~/hooks';
import type { TUser } from '~/types';
import { Avatar } from '~/ui';
import { cn } from '~/utils';

type NavbarProps = {
  user?: TUser;
} & React.ComponentProps<'nav'>;

export const Navbar: React.FC<NavbarProps> = (props) => {
  const { className, children, user } = props;
  const { open, toggle: toggleOpen } = useNavbar();
  const clip1 = useId();
  const clip2 = useId();

  return (
    <div className={cn('flex flex-col   text-zinc-50 filter drop-shadow-zinc-800/30 drop-shadow-md', className)}>
      <div
        className={cn('bg-zinc-900 absolute inset-0 pointer-events-none -z-10')}
        style={{ clipPath: open ? `url(#${clip2})` : `url(#${clip1})` }}
      />

      <svg className="pointer-events-none absolute h-0 w-0" aria-hidden>
        <clipPath id={clip1} clipPathUnits="objectBoundingBox">
          <path d="M.643 0C.925.001 1.003.018 1 .078V.922C1.003.982.925.999.643 1H.357C.075.999-.003.982 0 .922V.078C-.003.018.075.001.357 0H.643Z" />
        </clipPath>
        <clipPath id={clip2} clipPathUnits="objectBoundingBox">
          <path d="M.821 0C.991.001 1.001.008 1 .078V.922C1.001.992.991.999.821 1H.179C.009.999-.001.992 0 .922V.078C-.001.008.009.001.179 0H.821Z" />
        </clipPath>
      </svg>

      <nav>
        <ul className="flex flex-col gap-4 p-2">
          {[
            { Icon: Home, text: 'Home', path: href('/') },
            { Icon: FileQuestionMark, text: 'Questions', path: href('/questions') },
            { Icon: Code, text: 'Snippets', path: href('/snippets') },
            { Icon: Users, text: 'Users', path: href('/users') },
            user && { Icon: User, text: 'Profile', path: href('/profile') },
          ].map(
            (item, i) =>
              item !== undefined && (
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
        className="group mt-auto mb-2 inline-flex cursor-pointer gap-2 rounded-lg p-2 text-zinc-400 hover:text-zinc-50"
        onClick={() => toggleOpen()}
      >
        <span className="w-full rounded-lg p-2 group-hover:bg-zinc-800 group-active:bg-zinc-900">
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
          <Avatar user={user} className="absolute top-full left-1/2 mt-4 -translate-x-1/2" />
        </Link>
      ) : (
        <Link to={href('/login')}>
          <LogIn className="absolute top-full left-1/2 mt-4 -translate-x-1/2 text-zinc-600" />
        </Link>
      )}

      {children}
    </div>
  );
};

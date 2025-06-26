import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import { Code, FileQuestionMark, Home, User, Users } from 'lucide-react';

import { cn } from '~/utils';

type NavbarProps = {
  className?: string;
};

export const Navbar: React.FC<NavbarProps> = (props) => {
  const { className } = props;
  const [open, setOpen] = useState(false);

  function handleClick() {
    setOpen((o) => !o);
  }

  return (
    <div className={cn('squircle', 'flex flex-col text-zinc-50 drop-shadow-lg drop-shadow-zinc-500/30 ', className)}>
      <nav>
        <ul className="flex p-2 gap-4 flex-col">
          {[
            { Icon: Home, text: 'Home' },
            { Icon: FileQuestionMark, text: 'Questions' },
            { Icon: Code, text: 'Snippets' },
            { Icon: Users, text: 'Users' },
            { Icon: User, text: 'Profile' },
          ].map((item, i) => (
            <li key={i}>
              <NavLink
                to="/"
                className="flex gap-2 hover:bg-zinc-800 p-2 rounded-lg"
                style={{ animationDelay: `${i * 45}ms` }}
              >
                <item.Icon />
                <span className={cn(open ? 'flex-1 overflow-hidden inline-flex' : 'hidden', 'delay-[inherit]')}>
                  <span className={cn(open ? 'animate-slide-in delay-[inherit]' : 'hidden')}>{item.text}</span>
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <button
        className="inline-flex gap-2 p-2 rounded-lg group cursor-pointer text-zinc-400 hover:text-zinc-50 
        mt-[min(100px, 10px)] mb-2"
        onClick={handleClick}
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
    </div>
  );
};

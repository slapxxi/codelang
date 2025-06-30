import { createContext } from 'react';
import type { TUser } from '~/types';

type AuthProviderProps = {
  user: TUser | null;
  children?: React.ReactNode;
};

export const AuthContext = createContext<TUser | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = (props) => {
  const { user, children } = props;
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

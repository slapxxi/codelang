import { useContext } from 'react';
import { AuthContext } from '~/app/providers';

export function useAuth() {
  const authContext = useContext(AuthContext);
  return authContext;
}

import { useContext, createContext } from 'react';
import type { TSnippet } from '~/types';

type Context = {
  snippet: TSnippet;
  expand: boolean;
  showMore: boolean;
  codeRef: React.RefObject<HTMLDivElement | null>;
  setExpand: React.Dispatch<React.SetStateAction<boolean>>;
};

const SnippetContext = createContext<Context | null>(null);

export function useSnippetContext() {
  return useContext(SnippetContext);
}

type SnippetProviderProps = {
  value: Context;
  children: React.ReactNode;
};

export const SnippetProvider: React.FC<SnippetProviderProps> = (props) => {
  const { children, value } = props;
  return <SnippetContext.Provider value={value}>{children}</SnippetContext.Provider>;
};

import { Button, CardBody, Code } from '~/ui';
import { useSnippetContext } from './snippet-card.provider';
import { cn } from '~/utils';

export const SnippetCardBody: React.FC = () => {
  const ctx = useSnippetContext();

  function handleClick() {
    ctx?.setExpand((e) => !e);
  }

  if (ctx) {
    const { snippet, expand, showMore, codeRef } = ctx;

    return (
      <CardBody className="flex flex-col gap-2">
        <Code
          ref={codeRef}
          code={snippet.formattedCode}
          showScrollbar={showMore}
          className={cn('w-full max-w-full min-w-0', expand ? 'max-h-[600px]' : 'max-h-[300px]')}
        />
        {showMore && <Button onClick={handleClick}>Show {expand ? 'less' : 'more'}</Button>}
      </CardBody>
    );
  }

  return null;
};

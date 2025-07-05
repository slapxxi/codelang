import { FilePlus } from 'lucide-react';
import { href, Link } from 'react-router';
import { PageTitle } from '~/ui';
import { Button } from '~/ui';

const SnippetsRoute = () => {
  return (
    <div>
      <PageTitle className="flex gap-4 items-center">
        Snippets
        <Button asChild>
          <Link to={href('/snippets/new')}>
            <FilePlus size={16} />
            <span>New Snippet</span>
          </Link>
        </Button>
      </PageTitle>
    </div>
  );
};

export default SnippetsRoute;

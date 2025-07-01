import { href, Link } from 'react-router';
import { PageTitle } from '~/ui';
import { Button } from '~/ui';

const SnippetsRoute = () => {
  return (
    <div>
      <PageTitle className="flex gap-2 items-center">
        Snippets
        <Button>
          <Link to={href('/snippets/new')}>Create Snippet</Link>
        </Button>
      </PageTitle>
    </div>
  );
};

export default SnippetsRoute;

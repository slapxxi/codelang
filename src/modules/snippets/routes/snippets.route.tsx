import { redirect } from 'react-router';

export function loader() {
  return redirect('/');
}

const SnippetsRoute = () => {
  return <h1>Snippets</h1>;
};

export default SnippetsRoute;

export function urlToSearchParamsRef(url: string) {
  const pathname = new URL(url).pathname;
  const searchParams = new URLSearchParams();
  searchParams.set('ref', pathname);
  return searchParams;
}

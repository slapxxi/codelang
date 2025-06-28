export function replaceSearchParamsValue<T>(searchParams: URLSearchParams, key: string, value: T) {
  const sp = new URLSearchParams(searchParams);
  sp.delete(key);
  sp.append(key, String(value));
  return sp.toString();
}

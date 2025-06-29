export function getSession(request: Request) {
  return request.headers.get('Cookie');
}

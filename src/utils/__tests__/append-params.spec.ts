import { beforeEach, describe, expect, test } from 'vitest';

import { appendParams } from '../append-params.util';

describe('appendParams', () => {
  let url: URL;

  beforeEach(() => {
    url = new URL('https://example.com');
  });

  test('appends simple values', () => {
    appendParams(url, { a: 1, b: 'string' });
    expect(url.search).toBe('?a=1&b=string');
  });

  test('appends array values', () => {
    appendParams(url, { searchBy: ['username', 'id'] });
    expect(url.search).toBe('?searchBy=username&searchBy=id');
  });

  test('appends objects', () => {
    appendParams(url, { sortBy: { username: 'ASC', id: 'DESC' } });
    expect(url.search).toBe('?sortBy=username%3AASC&sortBy=id%3ADESC');
  });
});

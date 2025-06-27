type Params = {
  [key: string]: string | number | unknown[] | { [key: string]: unknown };
};

export function appendParams(url: URL, params?: Params) {
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (Array.isArray(value)) {
        for (const v of value) {
          url.searchParams.append(key, String(v));
        }
        continue;
      }
      if (typeof value === 'object') {
        for (const [k, v] of Object.entries(value)) {
          url.searchParams.append(key, `${k}:${v}`);
        }
        continue;
      }
      url.searchParams.append(key, String(value));
    }
  }
}

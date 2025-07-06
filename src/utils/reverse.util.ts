export function reverse<T>(iter: T[]) {
  return iter;
  const result = new Array(iter.length);
  for (let i = 0; i < iter.length; i++) {
    result[iter.length - i - 1] = iter[i];
  }
  return result;
}

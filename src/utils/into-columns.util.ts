export function intoColumns<T>(items: T[], cols: number) {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i++) {
    const colNumber = i % cols;
    if (!result[colNumber]) {
      result[colNumber] = [];
    }
    result[colNumber].push(items[i]);
  }
  return result;
}

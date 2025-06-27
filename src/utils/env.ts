import { isBrowser } from './is-browser';
import { isNode } from './is-node';

export function env(name: string) {
  if (isBrowser) {
    throw new Error('Not implemented');
  }
  if (isNode) {
    return process.env[name];
  }
}

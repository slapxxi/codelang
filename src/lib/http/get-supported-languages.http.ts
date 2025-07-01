import * as z from 'zod/v4';
import { API_URL } from './const';
import type { TResult } from '~/types';

const GetSupportedLanguagesResponse = z.array(z.string());

type Params = {
  token: string;
};

type Result = TResult<string[]>;

export async function getSupportedLanguages(params: Params): Promise<Result> {
  const url = new URL(`${API_URL}/snippets/languages`);
  const response = await fetch(url, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `token=${params.token}`,
    },
  });
  const json = await response.json();
  const { success, data } = GetSupportedLanguagesResponse.safeParse(json.data);

  if (response.ok) {
    if (success) {
      return { data, error: null };
    }

    return { error: { type: 'server', message: 'Error parsing server response', status: response.status }, data: null };
  }

  return { error: { type: 'unknown', message: 'Error getting supported languages', e: response }, data: null };
}

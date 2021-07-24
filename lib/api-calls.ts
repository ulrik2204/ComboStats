import { GetIsLoggedInResponse } from './types';

const useFetch = (url: string, method: string, body?: any) => {
  return fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body });
};

/**
 * Sending a POST request to the api creating a temp user.
 * The token for the temp user is set using the Set-Cookie header server side.
 */
export const createTempUser = async (): Promise<Response> => {
  const response = await useFetch('/api/user/temp-user', 'POST');
  return response;
};

/**
 * Sending a request to the api checking if the user is logged in with a valid token.
 * @return True if the user is logged in with a valid token and
 */
export const isLoggedIn = async (): Promise<boolean> => {
  const response: GetIsLoggedInResponse = await useFetch('/api/user', 'GET').then((res) => res.json());
  return response.isLoggedIn;
};

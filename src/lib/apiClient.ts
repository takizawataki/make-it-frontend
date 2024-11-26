import { fetchAuthSession } from 'aws-amplify/auth';
import Axios, { AxiosRequestConfig } from 'axios';

export const AXIOS_INSTANCE = Axios.create(); // use your own URL here or environment variable

// add a second `options` argument here if you want to pass extra options to each generated query
export const customInstance = async <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const idToken = await fetchAuthSession();
  config.headers = {
    Authorization: idToken.tokens?.idToken?.toString(),
  };
  // eslint-disable-next-line import/no-named-as-default-member
  const source = Axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  return promise;
};

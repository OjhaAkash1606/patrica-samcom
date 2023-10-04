import axios from 'axios';
import qs from 'qs';
import {
  getLocalStorage,
  isPublicApi,
  stringifyError,
} from 'utils/common.utils';
import { baseURL } from 'constants/config';
import type {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { GUEST_TOKEN } from 'constants/localstorage.constants';
import { Responses } from './responses';

export enum METHODS {
  GET = 'get',
  DELETE = 'delete',
  HEAD = 'head',
  OPTIONS = 'options',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
}
const axiosConfig: AxiosRequestConfig = {
  baseURL,
};
function createAxiosInstance() {
  return axios.create(axiosConfig);
}
const request: AxiosInstance = createAxiosInstance();
const cache: { [key: string]: Responses } = {};
export interface ClientConfig extends AxiosRequestConfig {
  useCache?: boolean;
  invalidateQuery?: boolean;
  url?: string;
  isPublic?: boolean;
  isGuestAllowed?: boolean;
}
const client = <T extends Responses>({
  method = METHODS.POST,
  url = baseURL,
  data,
  useCache = false,
  invalidateQuery = false,
  ...rest
}: ClientConfig): Promise<T> =>
  useCache && !invalidateQuery && cache[url]
    ? (Promise.resolve(cache[url]) as Promise<T>)
    : request({
        method,
        url,
        data,
        paramsSerializer,
        ...rest,
      }).then((res: AxiosResponse<T>) => {
        if (useCache) cache[url] = res.data;
        return res.data;
      });

export const clientWithHeaders = <T extends Responses>({
  method = METHODS.POST,
  url = baseURL,
  data,
  useCache = false,
  invalidateQuery = false,
  ...rest
}: ClientConfig): Promise<AxiosResponse<T>> =>
  request({
    method,
    url,
    data,
    paramsSerializer,
    ...rest,
  }).then((res: AxiosResponse<T>) => {
    return res;
  });

request.interceptors.request.use(
  (req: ClientConfig) => {
    if (isPublicApi(req.url) || req.isPublic) {
      delete req.headers.Authorization;
    }
    if (
      req.isGuestAllowed &&
      getLocalStorage(GUEST_TOKEN, null) &&
      !req.headers.Authorization
    ) {
      req.headers.Authorization = `Bearer ${getLocalStorage(
        GUEST_TOKEN,
        null
      )}`;
    }
    return req;
  },
  (error: AxiosError) => {}
);

request.interceptors.response.use(
  (res: AxiosResponse) => {
    return res;
  },
  (err: AxiosError) => {
    const originalRequest = err.config;
    const status = err.response?.status;
    if (status === 503) {
      const error = {
        originalRequest,
        status,
        message:
          'This service is unavailable right now, please try again later',
      };
      throw error;
    }
    if (status === 500) {
      const error = {
        originalRequest,
        status,
        message: 'An unexpected error occurred, please try again later',
      };
      throw error;
    }
    if (status === 404) {
      const error = {
        originalRequest,
        status,
        message: 'The requested content does not exist, please try again later',
      };
      throw error;
    }
    if (status === 403) {
      const error = {
        originalRequest,
        status,
        message: 'Action not allowed',
      };
      throw error;
    }

    const response: Record<string, string[]> | undefined = err.response?.data;
    const message = response ? stringifyError(response) : err.message;

    const error = { originalRequest, message, status };
    throw error;
  }
);
export function setHeaderToken(token?: string) {
  if (token) request.defaults.headers.Authorization = `Bearer ${token}`;
  else delete request.defaults.headers.Authorization;
}

function paramsSerializer(params: AxiosRequestConfig['params']) {
  return qs.stringify(params, { arrayFormat: 'repeat' });
}

export default client;

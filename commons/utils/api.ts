export type * from '../types/api';
import type { __RequestFunctionHelper, AccountResponseData, AccountsRequestBody, AccountsResponseData, ApiError, ApiResponse, BranchesResponseData, Endpoint, LoginRequestBody, LoginResponseData, RequestFunctionParams } from '../types/api';

export function responseIsError(response: ApiResponse | ApiError): response is ApiError {
  return 'error' in response;
}

export class Api {
  public static isError = responseIsError;
  public isError = responseIsError;
  private static createError(message: string): ApiError {
    return { error: message };
  }
  public readonly serverUrl: string
  constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
  }
  private async refresh(retries: number = 1): Promise<boolean> {
    const response = await fetch('/auth/refresh', { credentials: 'include' });
    return response.ok
      ? true
      : response.status >= 500 && retries > 0
      ? this.refresh(retries - 1)
      : false
  }
  private async request<D extends { [key: string]: any } | null = { [key: string]: any }>(endpoint: string, options: RequestInit = {}, retries: number = 1): Promise<ApiResponse<D> | ApiError> {
    const retry = () => retries > 0
      ? this.request<D>(endpoint, options, retries - 1)
      : Api.createError('Maximum retry attempts exceeded.');
    try {
      const response = await fetch(`${this.serverUrl}${endpoint}`, { credentials: 'include', ...options });
      return response.status >= 500
        ? retry()
        : response.status === 401
        ? await this.refresh()
          ? retry()
          : Api.createError('Failed to refresh authentication token.')
        : response.json();
    } catch (error) {
      console.error(error);
      return retry();
    }
  }
  private createRequestFunction<D extends { [key: string]: any } | null = null, B extends { [key: string]: any } = never>(method: Uppercase<string>, endpoint: string) {
    return (body?: B) => this.request<D>(endpoint, { method, ...(body && { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }) });
  }

  private get<D extends { [key: string]: any } | null = null>(endpoint: string) {
    return this.createRequestFunction<D, never>('GET', endpoint);
  }
  private post<D extends { [key: string]: any } | null = null, B extends { [key: string]: any } = never>(endpoint: string) {
    return this.createRequestFunction<D, B>('POST', endpoint);
  }
  private patch<D extends { [key: string]: any } | null = null, B extends { [key: string]: any } = never>(endpoint: string) {
    return this.createRequestFunction<D, B>('PATCH', endpoint);
  }
  private delete<D extends { [key: string]: any } | null = null>(endpoint: string) {
    return this.createRequestFunction<D, never>('DELETE', endpoint);
  }

  public readonly ENDPOINTS = {
    auth: {
      login: {
        post: this.post<LoginResponseData, LoginRequestBody>('/auth/login'),
      },
      logout: {
        post: this.post('/auth/logout'),
      },
      refresh: {
        post: this.post('/auth/refresh'),
      },  
    },
    branches: {
      get: this.get<BranchesResponseData>('/branches'),
    },
    accounts: {
      get: this.get<AccountsResponseData>('/accounts'),
      post: this.post<AccountResponseData, AccountsRequestBody>('/accounts'),
      me: {
        get: this.get<AccountResponseData>('/accounts/me'),
      },
      userId: (userId: string) => ({
        delete: this.delete(`/accounts/${userId}`),
        patch: this.patch<AccountResponseData, Partial<AccountsRequestBody>>(`/accounts/${userId}`),
      }),
    },
  } as const;

  public getRequestFunction<E extends Endpoint>(endpoint: E, params?: RequestFunctionParams<E>): RequestFunction<E> {
    const [METHOD, ...pathParts] = endpoint
      .split('/')
      .map(part => part.trim())
      .filter(part => part.length);
    
    let curr: Record<string, any> = this.ENDPOINTS;
    for (const part of pathParts) {
      if (typeof curr !== 'object' || curr === null || typeof curr === 'function')
        throw new Error(`Invalid endpoint: ${endpoint}`);
      if (part.startsWith(':')) {
        const paramName = part.slice(1);
        if (!params || !(paramName in params))
          throw new Error(`Missing parameter: ${paramName}`);
        if (!(paramName in curr) || typeof curr[paramName] !== 'function')
          throw new Error(`Invalid endpoint: ${endpoint}`);
        curr = curr[paramName](params[paramName]);
      } else {
        if (!(part in curr))
          throw new Error(`Invalid endpoint: ${endpoint}`);
        curr = curr[part];
      }
    }
    const method = METHOD.toLowerCase();
    if (!(method in curr) || typeof curr[method] !== 'function')
      throw new Error(`Invalid endpoint: ${endpoint}`);
    return curr[method];
  }
}

export type RequestFunction<E extends Endpoint> =
  E extends `${infer METHOD} /${infer PATH}`
  ? __RequestFunctionHelper<Api['ENDPOINTS'], `${PATH}/${METHOD}`>
  : never;


//
export const SERVER_BASE_URL = 'http://localhost:6020';
export const API = new Api(SERVER_BASE_URL);
export default API;

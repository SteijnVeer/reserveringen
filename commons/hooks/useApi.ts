import { useState } from 'react';
import api, { type ApiError, type ApiResponse, type Endpoint, type RequestFunction, type RequestFunctionParams } from '../utils/api';

export type RequestState = 'idle' | 'loading' | 'success' | 'error';

export default function useApi<E extends Endpoint>(endpoint: E, params?: RequestFunctionParams<E>):
  RequestFunction<E> extends (body?: infer B | undefined) => Promise<ApiError | ApiResponse<infer D>>
    ? {
        requestState: RequestState;
        makeRequest: (body?: B) => Promise<{ success: boolean; data: D | null; error: string | null }>;
        data: D | null;
        error: string | null;
      }
    : never
{
  try {
    const requestFunction = api.getRequestFunction(endpoint, params);
    const [requestState, setRequestState] = useState<RequestState>('idle');
    const [data, setData] = useState<(ReturnType<RequestFunction<E>> extends Promise<infer R> ? R : null) | null>(null);
    const [error, setError] = useState<string | null>(null);
    const makeRequest = async (body?: Parameters<RequestFunction<E>>[0]) => {
      setRequestState('loading');
      const response = await (requestFunction as any)(body);
      if (api.isError(response)) {
        setError(response.error);
        setData(null);
        setRequestState('error');
        return { success: false, data: null, error: response.error };
      } else {
        setData(response.data);
        setError(null);
        setRequestState('success');
        return { success: true, data: response.data, error: null };
      }
    };
    return {
      requestState,
      makeRequest,
      data,
      error,
    } as any;
  } catch {
    return {
      requestState: 'error',
      makeRequest: () => Promise.resolve({ success: false, data: null, error: 'Invalid endpoint' }),
      data: null,
      error: 'Invalid endpoint',
    } as any;
  }
}

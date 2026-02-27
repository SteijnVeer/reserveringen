export type ApiResponse<D extends { [key: string]: any } | null = { [key: string]: any }> = {
  success: true;
  message: string;
  data: D;
};

export type ApiError = {
  error: string;
};

export type Method = 'get' | 'post' | 'patch' | 'delete';
export type Endpoint = `${Method} /${string}`;

export type __RequestFunctionHelper<C extends Record<string, any>, P extends string> = 
  P extends `${infer Segment}/${infer Rest}`
  ? Segment extends `:${infer Param}`
    ? Param extends keyof C
      ? __RequestFunctionHelper<ReturnType<C[Param]>, Rest>
      : never
    : Segment extends keyof C
      ? __RequestFunctionHelper<C[Segment], Rest>
      : never
  : C[P] extends (...args: any[]) => any
    ? C[P]
    : never;

export type __RequestFunctionParamsHelper<P extends string, ACC extends string[] = []> = 
  P extends `${infer Segment}/${infer Rest}`
  ? Segment extends `:${infer Param}`
    ? __RequestFunctionParamsHelper<Rest, [...ACC, Param]>
    : __RequestFunctionParamsHelper<Rest, ACC>
  : ACC extends []
    ? never
    : Record<ACC[number], string>;

export type RequestFunctionParams<E extends Endpoint> = 
  E extends `${infer METHOD} /${infer PATH}`
    ? __RequestFunctionParamsHelper<`${PATH}/${METHOD}`>
    : never;

// bodies
export type LoginRequestBody = {
  username: string;
  password: string;
  branch: string;
};
export type AccountsRequestBody = {
  username: string;
  password: string;
  permissionLevel: 1 | 2 | 3;
};

// responses
export type BranchesResponseData = {
  branches: string[];
};
export type Account = {
  userId: string;
  username: string;
  branch: string;
  permissionLevel: 1 | 2 | 3;
};
export type LoginResponseData = {
  user: Account;
};
export type AccountResponseData = {
  account: Account;
};
export type AccountsResponseData = {
  accounts: Account[];
};

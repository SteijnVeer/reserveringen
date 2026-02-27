declare const __BRAND__: unique symbol;
export type Branded<T, B> = T & { [__BRAND__]: B };
export type Unbranded<T> = T extends Branded<infer U, any> ? U : T;

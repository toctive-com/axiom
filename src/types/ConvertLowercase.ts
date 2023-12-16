export type LowerCase<S extends string> = S extends `${infer T}${infer U}`
  ? `${Lowercase<T>}${LowerCase<U>}`
  : S;

export type ConvertLowercase<T> = {
  [P in keyof T as LowerCase<string & P>]: P;
};

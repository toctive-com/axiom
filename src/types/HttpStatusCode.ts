import { Response } from '..';

/**
 * All HTTP status code as string message. This type is used in
 * `Response.setStatus()` to help the developer by autocomplete the input of
 * this method.
 *
 * @example `"CONTINUE" | "OK" | "INTERNAL_SERVER_ERROR"`
 *
 */
export type HttpStatusMessage = keyof typeof Response.StatusCodes;

/**
 * All HTTP status codes as number.
 *
 * @example `100 | 200 | 500`
 */
export type HttpStatusCode =
  (typeof Response.StatusCodes)[keyof typeof Response.StatusCodes];

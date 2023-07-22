import { Request, Response, Application } from '@/Core';

export type RouteActionParameters = {
  next?: Function;
  request?: Request;
  req?: Request;
  response?: Response;
  res?: Response;
  app?: Application;
  [key: string]: unknown;
};

export type RouteAction = (
  params: RouteActionParameters,
) => unknown | Promise<unknown>;

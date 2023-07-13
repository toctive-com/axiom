import { HttpRequest, HttpResponse, Application } from '../Foundation';

export type RouteActionParameters = {
  next?: Function;
  request?: HttpRequest;
  req?: HttpRequest;
  response?: HttpResponse;
  res?: HttpResponse;
  app?: Application;
  [key: string]: unknown;
};

export type RouteAction = (
  params: RouteActionParameters,
) => unknown | Promise<unknown>;

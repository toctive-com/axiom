import { RouteAction, RouteActionParameters } from '@/types';

export abstract class Middleware {
  abstract getAction(): RouteAction;
  public abstract authorize(
    routeActionParameters: RouteActionParameters,
  ): boolean;
  public abstract validate(
    routeActionParameters: RouteActionParameters,
  ): unknown;
}

export default Middleware;

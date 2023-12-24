import { RouteAction } from '@/types';

export abstract class Middleware {
  abstract getAction(): RouteAction;
}

export default Middleware;

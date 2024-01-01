import { RouteAction, RouteActionParameters } from '@/types';
import { ZodSchema } from 'zod';
import Middleware from '../Middleware';

export abstract class RequestValidator extends Middleware {
  public readonly routeActionParameters: RouteActionParameters;
  public readonly schema: ZodSchema;
  errors: any;

  constructor(routeActionParameters: RouteActionParameters) {
    super();
    this.routeActionParameters = routeActionParameters;
  }

  public isValid(): boolean {
    return this.authorize(this.routeActionParameters);
  }

  public getAction(): RouteAction {
    return (params: RouteActionParameters) => {
      if (!this.authorize(params)) {
        params.res.setStatus('UNAUTHORIZED');
        return { success: false, message: 'UNAUTHORIZED' };
      }

      if ((this.validate(params) as any).success === false) {
        params.res.setStatus('BAD_REQUEST');
        return { success: false, message: 'BAD_REQUEST' };
      }

      return params.next();
    };
  }
}

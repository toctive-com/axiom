import { stringify } from '@/utils';
import { makeFunctionsChain } from '@/utils/helpers/makeFunctionsChain';
import { ServiceProvider } from '../ServiceProvider';
import { Router } from './Router';

export class RouteServiceProvider extends ServiceProvider {
  /**
   * Registers routes on a router and handles executing the matched route and
   * writing the result to the response.
   *
   * @param {Router} router - The `router` parameter is an instance of the
   * `Router` class. It is used to define and match routes for incoming
   * requests.
   *
   */
  protected registerRoutes(router: Router): void {
    this.app.add(async (req, res, next) => {
      let result = await router.dispatch(req, res, next);

      if (typeof result === 'string') {
        // if result is string write it to response
        res.write(result);
      } else if (result === null || result === undefined) {
        // if the route action didn't return anything, end the function
      } else if (typeof result === 'object') {
        res.addHeader('Content-Type', 'application/json; charset=utf-8');

        if (result['toJSON']) result = result['toJSON']();
        else result = stringify(result);

        res.write(result);
      } else {
        res.write(result?.toString() ?? result);
      }
    });
  }

  /**
   * Adds a route to the app that writes "Route not found" to the response.
   *
   */
  protected handlerNotFoundError(): void {
    this.app.add((req, res) => {
      // TODO add default views for errors
      res.statusCode = 404;
      res.write('Route not found');
    });
  }
}

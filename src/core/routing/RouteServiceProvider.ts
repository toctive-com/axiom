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
      const matchedRoutes = router.match(req);
      let result = null;

      if (matchedRoutes) {
        try {
          const nextFunctions = matchedRoutes
            .slice(1)
            .map((r) => r.actions)
            .flat();
          nextFunctions.push(next);
          const nextFunctionsStack = makeFunctionsChain(nextFunctions, {
            req,
            res,
          });

          result = await matchedRoutes[0].dispatch(req, res, nextFunctionsStack);
        } catch (error) {
          // TODO add error handler object
          return res.write('Error: ' + error.message);
        }

        if (typeof result === 'string') {
          // if result is string write it to response
          res.write(result);
        } else if (
          (typeof result === 'object' && result === null) ||
          typeof result === 'undefined'
        ) {
          // if the route action didn't return anything, end the function
        } else if (typeof result === 'object') {
          res.addHeader('Content-Type', 'application/json; charset=utf-8');

          if (result['toJSON']) result = result['toJSON']();
          else result = stringify(result);

          res.write(result);
        } else {
          res.write(result?.toString() ?? result);
        }
      } else {
        // If there is no matched route call the next function
        return await next();
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

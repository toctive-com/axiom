import { stringify } from '@/Utils';
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
    this.app.add((req, res, next) => {
      const matchedRoute = router.match(req);
      let result = null;

      if (matchedRoute) {
        try {
          result = matchedRoute.execute(req, res);
        } catch (error) {
          // TODO add error handler object
          return res.write('Error: ' + error.message);
        }

        // if result is string write it to response
        if (typeof result === 'string') {
          return res.write(result);
        } else if (typeof result === 'object') {
          res.appendHeader('Content-Type', 'application/json; charset=utf-8');
          return res.write(stringify(result));
        } else if (typeof result === 'undefined') {
          // if the route action didn't return anything call the next function
          return next();
        } else {
          return res.write(result?.toString() ?? result);
        }
      }

      // If there is no matched route call the next function
      return next();
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

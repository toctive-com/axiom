import { stringify } from '@/Utils';
import { ServiceProvider } from '../ServiceProvider';
import { Router } from './Router';

export class RouteServiceProvider extends ServiceProvider {
  protected registerRoutes(router: Router): void {
    this.app.add((req, res, next) => {
      const matchedRoute = router.match(req);
      let result = null;

      if (matchedRoute) {
        result = matchedRoute.execute(req, res);
        // if result is string write it to response
        if (typeof result === 'string') {
          return res.write(result);
        } else if (typeof result === 'object') {
          return res.write(stringify(result));
        } else {
          return res.write(result?.toString() ?? result);
        }
      }

      return next();
    });
  }
}

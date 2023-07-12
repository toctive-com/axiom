import { Router, RouteServiceProvider as ServiceProvider } from 'axiom';
import { join } from 'path';

export class RouteServiceProvider extends ServiceProvider {
  public async register(): Promise<void> {
    // ...
  }

  public async boot(): Promise<void> {
    await Router.loadFile(join(__dirname, '..', 'routes', 'api.ts'));

    // ...
  }
}

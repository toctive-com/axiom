import { Container } from '@/core/Container';
import { ServiceProvider } from '@/core/ServiceProvider';
import { Maintenance } from '@/core/maintenance/Maintenance';
import {
  ApplicationParameters,
  RouteAction,
  RouteActionParameters,
} from '@/types';
import { HookType } from '@/types/HookType';
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import { existsSync } from 'node:fs';
import {
  IncomingMessage,
  Server,
  ServerResponse,
  createServer,
} from 'node:http';
import { join } from 'node:path';
import { Request } from './http/Request';
import { Response } from './http/Response';
import { Logger } from './logger';

/**
 * The `Application` class represents the core of the Axiom framework and
 * provides methods for managing service providers, handling middleware, and
 * more.
 *
 * @class Application
 * @extends Container
 */
export class Application extends Container {
  /**
   * Defining a version number for the Axiom framework.
   *
   * @var string
   */
  readonly VERSION = '0.1.2';

  /**
   * Indicates if the application is booted or not. method boot in all Service
   * Providers won't run if until this property be true.
   *
   * @var boolean
   *
   */
  protected booted: boolean = false;

  /**
   * keeps track of whether the service providers have been registered or not.
   * It is initially set to `false` and will be set to `true` once the service
   * providers are registered.
   *
   * @var boolean
   *
   */
  protected providersRegistered: boolean = false;

  /**
   * This property is used to store instances of service providers that are
   * registered by the application.
   *
   * @var {[key:string]: ServiceProvider}
   *
   */
  protected registeredProviders: { [key: string]: ServiceProvider } = {};

  /**
   * Here, we store all service provider for the developer. These providers will
   * be loaded automatically when the application boots.
   *
   * @var ServiceProvider[]
   *
   */
  public providers: ServiceProvider[] = [];

  /**
   * The base path for the Laravel installation.
   *
   * @var string
   */
  private _basePath: string;

  /**
   * All application configurations are stored here
   *
   * @var Object
   *
   */
  protected _config = {};

  /**
   * It is used to create and manage the HTTP server for the application.
   *
   * @var Server
   *
   */
  protected _server: Server;

  private _middleware: ((
    req?: Request,
    res?: Response,
    next?: Function,
  ) => any)[] = [];
  public get middleware(): ((
    req?: Request,
    res?: Response,
    next?: Function,
  ) => any)[] {
    return this._middleware;
  }

  /**
   * Store an instance of the `Logger` class, which is responsible for logging
   * messages and events in the application.
   */
  logger: Logger = new Logger();

  /**
   * An object that stores hooks for different stages in the request-response
   * cycle. The keys are hook names, and the values are arrays of hook actions.
   */
  private hooks: Record<HookType | string, RouteAction[]> = {};

  /**
   * Registers a hook or multiple hooks for a specific stage in the
   * request-response cycle. If a hook with the same name already exists, the
   * new hook(s) will be appended.
   *
   * @param hookName - The name of the hook (e.g., 'preRequest', 'postRoute').
   * @param action - A single hook action or an array of hook actions to be
   * executed.
   * @returns The array of hook actions registered for the specified hookName.
   */
  public readonly useHook = (
    hookName: HookType,
    action: RouteAction | RouteAction[],
  ): RouteAction[] => {
    // Ensure action is an array
    if (!Array.isArray(action)) action = [action];

    if (!Object.keys(this.hooks).includes(hookName)) this.hooks[hookName] = [];

    // Retrieve existing hooks for the specified hookName
    const prevHooks = this.hooks[hookName];

    // Combine existing hooks with the new ones and update the hooks object
    this.hooks[hookName] =
      prevHooks !== undefined ? [...prevHooks, ...action] : [...action];

    // Return the array of hook actions for the specified hookName
    return this.hooks[hookName];
  };

  /**
   * Executes hooks for a specific stage in the request-response cycle by hook
   * name.
   *
   * @param hookName - The name of the hook (e.g., 'preRequest', 'postRoute').
   * @param params - The parameters to pass to the hook actions.
   */
  public readonly executeHook = async (
    hookName: HookType,
    params: RouteActionParameters,
  ): Promise<void> => {
    const actions = this.hooks[hookName];

    // Execute each hook in the order they were registered
    if (actions) actions.forEach((action) => action(params));
  };

  /**
   * Removes a specific function from a hook.
   *
   * @param hookName - The name of the hook to remove the function from.
   * @param targetFunction - The function to be removed from the hook.
   * @returns True if the function was successfully removed, false otherwise.
   */
  public readonly removeFunctionFromHook = (
    hookName: HookType,
    targetFunction: RouteAction,
  ): boolean => {
    const hooks = this.hooks[hookName];

    if (hooks) {
      const index = hooks.indexOf(targetFunction);

      if (index !== -1) {
        // Remove the function from the array
        hooks.splice(index, 1);
        return true;
      }
    }

    return false;
  };

  /**
   * Clears a hook completely, removing all registered functions.
   *
   * @param hookName - The name of the hook to be cleared.
   */
  public readonly clearHook = (hookName: HookType): void => {
    if (this.hooks[hookName]) this.hooks[hookName] = [];
  };

  /**
   * Adds a middleware function to an array of middleware functions that will be
   * executed on incoming requests.
   *
   * @param middleware
   *
   */
  public add(
    middleware: (
      req: Request,
      res: Response,
      next?: Function,
    ) => Promise<any> | unknown,
  ) {
    this.middleware.push(
      async (req: Request, res: Response, next?: Function) => {
        const hookParams = {
          req,
          request: req,
          res,
          response: res,
          app: this,
          next,
        };

        await this.executeHook('pre-middleware', hookParams);

        await middleware(req, res, next);

        await this.executeHook('post-middleware', hookParams);
      },
    );
  }

  /**
   * Create Application instance
   *
   * @param ApplicationParameters
   *
   */
  constructor(parameters?: ApplicationParameters) {
    super();

    // Register the base path of the application
    this.basePath = parameters?.basePath ?? process.cwd();

    // load env variables before developer config. Allowing to use env variables
    // inside config files.
    this.loadEnv();

    // Load all project config files
    this._config = this.loadConfig();

    // Register all singletons that are used by the application
    this.registerSingletons();
  }

  /**
   * made to be override by developer's Application class
   *
   * @returns {Object} { }
   *
   */
  protected loadConfig(): Object {
    return {};
  }

  /**
   * Loads environment variables from a .env file and returns the parsed output.
   *
   * @returns The loadEnv() function returns an Object.
   *
   */
  protected loadEnv(): Object {
    // importing based on NODE_ENV
    let envFile = '.env';
    if (['test', 'testing'].includes(process.env.NODE_ENV)) {
      envFile = '.env.test';
    }

    if (existsSync(join(this._basePath, envFile))) {
      const output = config({ path: join(this._basePath, envFile) });
      if (output.error) console.error(output.error);

      // extend env variables allowing to use variables inside env variables
      // @see https://github.com/motdotla/dotenv-expand/
      expand(output);

      return output.parsed;
    }
  }

  /**
   * Registers the kernels that will be used to boot the application as
   * singletons in the service container.
   *
   * @returns {void}
   *
   */
  protected registerSingletons(): void {}

  /**
   * Returns the value of the `_basePath` property.
   *
   * @returns {string} _basePath property is being returned as a string.
   *
   */
  protected get basePath(): string {
    return this._basePath;
  }

  /**
   * Sets the base path value.
   *
   * @param {string} value - Represents the new base path value that will be
   * assigned to the _basePath property.
   *
   */
  protected set basePath(value: string) {
    this._basePath = value;
  }

  /**
   * Returns the server object.
   *
   * @returns {Server} Server - The server object is being returned.
   *
   */
  public get server(): Server {
    return this._server;
  }

  /**
   * Checks if the application is already booted and if not, it runs the boot
   * method in all service providers.
   *
   * @returns {Application} The method is returning the current instance of the
   * class.
   *
   */
  public async boot(): Promise<this> {
    if (this.isBooted()) return this;

    // All service providers must be registered before booting the application.
    // Booting the application without registering all service providers, may
    // result many logical errors and bugs. For example, the app will boot
    // without loading config files.
    if (!this.isProvidersRegistered()) await this.registerServiceProviders();

    // run boot method in all Service Providers
    await this.bootServiceProviders();

    this.booted = true;
    return this;
  }

  /**
   * Indicates whether the system is booted or not.
   *
   * @returns true, if the application is already booted before.
   *
   */
  public isBooted(): boolean {
    return this.booted;
  }

  /**
   * Checks if service providers are registered or not.
   *
   * @returns true, if the service providers are already registered.
   *
   */
  public isProvidersRegistered(): boolean {
    return this.providersRegistered;
  }

  /**
   * The `register` function takes a `ServiceProvider` and registers it if it is
   * not already registered, returning the registered provider.
   *
   * @param provider - The `provider` parameter is an instance of the
   * `ServiceProvider` class.
   *
   * @returns The method is returning the registered provider.
   *
   */
  protected async register(
    provider: ServiceProvider,
  ): Promise<ServiceProvider> {
    if (this.isRegistered(provider)) {
      return this.registeredProviders[provider.constructor.name];
    }

    await provider.register();
    return (this.registeredProviders[provider.constructor.name] = provider);
  }

  /**
   * The function checks if a given service provider is registered.
   * @param {ServiceProvider} provider - The parameter "provider" is of type
   * "ServiceProvider".
   *
   * @returns a boolean value.
   *
   */
  public isRegistered(provider: ServiceProvider): boolean {
    return Object.keys(this.registeredProviders).includes(
      provider.constructor.name,
    );
  }

  /**
   * The function iterates over the registered providers and calls the boot
   * method on each one.
   *
   * @return void
   *
   */
  protected async bootServiceProviders(): Promise<void> {
    for (const provider of Object.keys(this.registeredProviders)) {
      await this.registeredProviders[provider].boot();
    }
  }

  /**
   * The function iterates over an array of service providers and registers each
   * one.
   *
   * @returns void
   *
   */
  public async registerServiceProviders(): Promise<void> {
    if (this.isProvidersRegistered()) return;

    for (const provider of this.providers) {
      await this.register(provider);
    }

    this.providersRegistered = true;
  }

  /**
   * Handles the maintenance mode by calling the handle method of the
   * Maintenance class.
   *
   * @param request - The incoming HTTP request object.
   * @param response - The server response object.
   */
  public async handleMaintenanceMode(
    request: Request,
    response: Response,
  ): Promise<void> {
    if (!this.getConfig('app.maintenanceMode.enabled')) return;

    const handler = this.make<Maintenance>('Maintenance');
    await handler.handle({ request, response });
  }

  /**
   * Returns a singleton instance of the Application class with the given
   * parameters.
   *
   * @param {ApplicationParameters} parameters - The `parameters` parameter in
   * the `getInstance` method is an object of type `ApplicationParameters`. It
   * is likely that this object contains various properties and values that are
   * used to configure and initialize the `Application` instance that is being
   * returned. The specific properties and values of the `ApplicationParameters`
   * object
   *
   * @returns Application
   *
   */
  public static getInstance(parameters: ApplicationParameters) {
    return this.set('Application', () => new Application(parameters));
  }

  /**
   * Retrieves a value from the application's configuration based on the given
   * name, with an optional default value if the configuration value is not
   * found.
   *
   * @param name - The name of the configuration property to retrieve, using dot
   * notation for nested properties.
   * @param defaultValue - The default value to return if the configuration
   * value is not found.
   * @returns The retrieved configuration value.
   */
  public getConfig<T>(name: string, defaultValue: T = null): T {
    let value = this._config;

    for (const configName of name.split('.')) {
      if (!Object.keys(value).includes(configName)) return defaultValue;
      value = value[configName];
    }

    return value as T;
  }

  /**
   * Creates an HTTP server using the `createServer()` function and assigns it
   * to the "server" property of the application.
   *
   * @param callback - An optional callback function to handle server requests.
   * @returns The created server instance.
   */
  public createHttpServer(
    callback?: (request: IncomingMessage, response: ServerResponse) => void,
  ): Server<typeof IncomingMessage, typeof ServerResponse> {
    return (this._server = createServer(callback));
  }
}

export default Application;

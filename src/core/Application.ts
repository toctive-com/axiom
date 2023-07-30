import { Container } from '@/core/Container';
import { Maintenance } from '@/core/Maintenance';
import { ServiceProvider } from '@/core/ServiceProvider';
import { ApplicationParameters } from '@/types';
import {
  IncomingMessage,
  Server,
  ServerResponse,
  createServer,
} from 'node:http';

import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import { join } from 'path';
import { Request } from './http/Request';
import { Response } from './http/Response';

export class Application extends Container {
  /**
   * Defining a version number for Axiom framework
   *
   * @var string
   *
   */
  readonly VERSION = '0.1.2';

  /**
   * Indicates if the application is booted or not.
   * method boot in all Service Providers won't run if until this property be
   * true.
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

  public add(
    middleware: (res: Request, req: Response, next?: Function) => any,
  ) {
    this.middleware.push(middleware);
  }

  /**
   * Create Application instance
   *
   * @param ApplicationParameters
   *
   */
  constructor({ basePath = process.cwd() }: ApplicationParameters) {
    super();

    // Register the base path of the application
    if (basePath) this.basePath = basePath;

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

    const output = config({ path: join(this._basePath, envFile) });
    if (output.error) console.error(output.error);

    // extend env variables allowing to use variables inside env variables
    // @see https://github.com/motdotla/dotenv-expand/
    expand(output);

    return output.parsed;
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
   * Checks if the application is already booted and if not,
   * it runs the boot method in all service providers.
   *
   * @returns {Application} The method is returning the current instance of the class.
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
   * @param provider - The `provider` parameter is an instance of
   * the `ServiceProvider` class.
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
   * The function iterates over the registered providers and calls the boot method
   * on each one.
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
   * @param request: The incoming HTTP request object.
   * @param response: The server response object.
   *
   */
  public async handleMaintenanceMode({ request, response }): Promise<void> {
    if (!this.config('app.maintenanceMode.enabled')) return;

    const handler = Application.make<Maintenance>('Maintenance');
    await handler.handle({ request, response });
  }

  /**
   * Returns a singleton instance of the Application class with the given parameters.
   *
   * @param {ApplicationParameters} parameters - The `parameters` parameter in the
   * `getInstance` method is an object of type `ApplicationParameters`. It is
   * likely that this object contains various properties and values that are used
   * to configure and initialize the `Application` instance that is being returned.
   * The specific properties and values of the `ApplicationParameters` object
   *
   * @returns Application
   *
   */
  public static getInstance(parameters: ApplicationParameters) {
    return this.set('Application', () => new Application(parameters));
  }

  /**
   * Get the number version of the application
   *
   * @return string
   */
  public get version(): string {
    return this.VERSION;
  }

  /**
   * Retrieves a value from a nested object based on a given string
   * path, with an optional default value if the path does not exist.
   *
   * @param {string} name - A string representing the name of the configuration
   * property to retrieve. It can be a nested property, separated by dots (e.g.
   * "database.host").
   * @param {unknown} [defaultValue=null] - defaultValue is an optional parameter
   * with a default value of null. It is used to specify the default value to be
   * returned if the requested configuration value is not found.
   *
   * @returns unknown
   *
   */
  public config<T>(name: string, defaultValue: T = null): T {
    let value = this._config;

    for (const configName of name.split('.')) {
      if (!Object.keys(value).includes(configName)) return defaultValue;
      value = value[configName];
    }

    return value as T;
  }

  /**
   * Creates a server using the `createServer()` function and assigns it
   * to the "server" property of the current object.
   *
   * @returns The `createServer()` function is being returned.
   *
   */
  public createServer(
    callback?: (request: IncomingMessage, response: ServerResponse) => void,
  ): Server<typeof IncomingMessage, typeof ServerResponse> {
    return (this._server = createServer(callback));
  }
}

export default Application;

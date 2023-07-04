import { existsSync } from "node:fs";
import {
  IncomingMessage,
  Server,
  ServerResponse,
  createServer,
} from "node:http";
import { join } from "node:path";
import { ApplicationParameters } from "../Types";
import { Container } from "./Container";
import { Maintenance } from "./Maintenance";
import { ServiceProvider } from "./ServiceProvider";

export class Application extends Container {
  /**
   * Defining a version number for MakeX framework
   *
   * @var string
   *
   */
  readonly VERSION = "1.0.0";

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
  protected basePath: string;

  /**
   * All application configurations are stored here
   *
   * @var Object
   *
   */
  private _config = {};

  /**
   * It is used to create and manage the HTTP server for the application.
   *
   * @var Server
   *
   */
  private _server: Server;
  public get server(): Server {
    return this._server;
  }

  /**
   * Create Application instance
   *
   * @param ApplicationParameters
   *
   */
  constructor({ basePath, config = {} }: ApplicationParameters) {
    super();

    if (basePath) this.basePath = basePath;

    // Load all config files
    this._config = config;
  }

  /**
   * The boot function checks if the application is already booted and if not,
   * it runs the boot method in all service providers and sets the booted flag
   * to true.
   *
   * @returns The method is returning the current instance of the class.
   *
   */
  public async boot(): Promise<this> {
    if (this.isBooted()) return this;
    if (!this.isProvidersRegistered()) await this.registerServiceProviders();

    // run boot method in all Service Providers
    await this.bootServiceProviders();

    this.booted = true;
    return this;
  }

  /**
   * Returns a boolean value indicating whether the system is booted or not.
   *
   * @returns boolean
   *
   */
  public isBooted(): boolean {
    return this.booted;
  }

  /**
   * Checks if providers are registered and returns a boolean value.
   *
   * @returns boolean
   *
   */
  public isProvidersRegistered(): boolean {
    return this.providersRegistered;
  }

  /**
   * The `register` function takes a `ServiceProvider` and registers it if it is
   * not already registered, returning the registered provider.
   *
   * @param {ServiceProvider} provider - The `provider` parameter is an instance of
   * the `ServiceProvider` class.
   *
   * @returns The method is returning the registered provider.
   *
   */
  protected async register(
    provider: ServiceProvider
  ): Promise<ServiceProvider> {
    if (this.isRegistered(provider)) {
      return this.registeredProviders[provider.toString()];
    }

    await provider.register();
    return (this.registeredProviders[provider.toString()] = provider);
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
    return Object.keys(this.registeredProviders).includes(provider.toString());
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
  }

  /**
   * Handles the maintenance mode by calling the handle method of the
   * Maintenance class.
   *
   * @param request: The incoming HTTP request object.
   * @param response: The server response object.
   *
   */
  async handleMaintenanceMode({ request, response }): Promise<void> {
    if (!existsSync(join(this.basePath, "down.json"))) return;

    const handler: Maintenance = Application.make(Maintenance);
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
  public static getInstance(parameters: ApplicationParameters): Application {
    return this.singleton("Application", this, parameters);
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

    for (const configName of name.split(".")) {
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
  createServer(): Server<typeof IncomingMessage, typeof ServerResponse> {
    return (this._server = createServer());
  }
}

export default Application;

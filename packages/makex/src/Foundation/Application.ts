import { existsSync } from "node:fs";
import { IncomingMessage, Server, ServerResponse, createServer } from "node:http";
import { join } from "node:path";
import { ApplicationParameters } from "../Types";
import { Container } from "./Container";
import Maintenance from "./Maintenance";

export class Application extends Container {
  /**
   * Defining a version number for MakeX framework
   *
   * @var string
   *
   */
  readonly VERSION = "1.0.0";

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
  public config(name: string, defaultValue: unknown = null): unknown {
    let value = this._config;

    for (const configName of name.split(".")) {
      if (!Object.keys(value).includes(configName)) return defaultValue;
      value = value[configName];
    }

    return value;
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

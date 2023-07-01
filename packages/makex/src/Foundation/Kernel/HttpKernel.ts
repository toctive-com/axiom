import { HttpTerminator, createHttpTerminator } from "http-terminator";
import { IncomingMessage, Server, ServerResponse } from "node:http";
import setPrototypeOf from "setprototypeof";
import Application from "../Application";
import { HttpRequest } from "../Http/Request";
import { HttpResponse } from "../Http/Response";
import { Router } from "../Routing";

export class HttpKernel {
  /**
   * This property is used to store an instance of the `Server` class, which is
   * used to create an HTTP server.
   *
   * @var Server
   *
   */
  private server: Server;

  /**
   * This property is used to store an instance of the `HttpTerminator` class,
   * which is used to gracefully shut down the HTTP server.
   *
   * @var HttpTerminator
   *
   */
  private httpTerminator: HttpTerminator;

  /**
   * Creates a server and starts it on port 8000, while also creating
   * an httpTerminator to gracefully shut down the server.
   *
   * @param Server
   *
   */
  constructor({ server, port = 8000 }: { server: Server; port: number }) {
    this.server = server;

    this.httpTerminator = createHttpTerminator({
      server: this.server,
    });

    this.server.listen(port, () => {
      console.log(`server started on http://localhost:${port}/`);
    });
  }

  /**
   * Captures an HTTP request and returns a promise that resolves with
   * the request and its corresponding response.
   *
   * @returns A Promise that resolves to an object containing an HttpRequest and an
   * HttpResponse.
   *
   */
  captureRequest() {
    return new Promise<{ request: HttpRequest; response: HttpResponse }>(
      (resolve, reject) => {
        this.server.on(
          "request",
          (req: IncomingMessage, res: ServerResponse) => {
            const request = setPrototypeOf(req, HttpRequest.prototype);
            const response = setPrototypeOf(res, HttpResponse.prototype);
            Application.singleton(HttpRequest, request);
            Application.singleton(HttpResponse, response);
            return resolve({ request, response });
          }
        );

        this.server.on("error", (error) => reject(error));
      }
    );
  }

  /**
   * Handles an HTTP request and returns an HTTP response.
   *
   * @param {HttpRequest} request - HttpRequest is an object that represents an HTTP
   * request made by a client to a server. It contains information such as the
   * request method, headers, and body.
   * @param {HttpResponse} response - The `response` parameter is an instance of the
   * `HttpResponse` class, which is used to send a response back to the client that
   * made the HTTP request. It contains information such as the status code, headers,
   * and body of the response. In the given code snippet, the `handle` function
   *
   * @returns The `response` object is being returned.
   *
   */
  async handle(
    request: HttpRequest,
    response: HttpResponse
  ): Promise<HttpResponse> {
    /**
     * Check If The Application Is Under Maintenance
     * --------------------------------------------------------------------------
     * If there is a file called `down` in the current working directory,
     * This means the website is under maintenance and all incoming request will
     * get 503 status code.
     *
     */
    await Application.make<Application>(Application).handleMaintenanceMode({
      request,
      response,
    });

    // TODO trim slashes from the request url and from every route.
    const firstMatchedRoute = Router.match(
      request.method.toLowerCase(),
      request.url
    );
    if (firstMatchedRoute) {
      // TODO Convert the return of the execute function to a string.
      response.write(firstMatchedRoute.execute(request, response));
    } else {
      // TODO implement handle 404 error.
      response.write("404 Not Found");
    }

    return response;
  }

  /**
   * Terminates an HTTP server using an HTTP terminator.
   *
   * @param {HttpRequest} request - HttpRequest is an object that represents an
   * incoming HTTP request. It contains information such as the request method,
   * headers, URL, and body.
   * @param {HttpResponse} response - The `response` parameter is an instance of the
   * `HttpResponse` class, which represents the HTTP response that will be sent back
   * to the client. It contains information such as the status code, headers, and
   * body of the response. In this case, it is not being used directly in the
   * `terminate
   *
   */
  async terminate(request: HttpRequest, response: HttpResponse) {
    await this.httpTerminator.terminate();
  }
}

import { IncomingMessage } from "node:http";
import Application from "../Application";

export class HttpRequest extends IncomingMessage {
  /**
   * The `app` property is used to store an instance of the`Application` class, 
   * which represents the application being served by the HTTP server.
   * 
   * @var Application
   * 
   */
  public readonly app: Application;

  static locals: any = {};
  public get locals(): any {
    return HttpRequest.locals;
  }
  public set locals(value: any) {
    HttpRequest.locals = { ...HttpRequest.locals, value };
  }

  static params: any = {};
  public get params(): any {
    return HttpRequest.params;
  }
  public set params(value: any) {
    HttpRequest.params = value;
  }
}

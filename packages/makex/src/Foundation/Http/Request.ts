import { IncomingMessage } from "node:http";

export class HttpRequest extends IncomingMessage {
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

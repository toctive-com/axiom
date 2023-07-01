import { IncomingMessage } from "node:http";

export class HttpRequest extends IncomingMessage {
  static locals: any = {};
  public get locals(): any {
    return HttpRequest.locals;
  }
  public set locals(value: any) {
    HttpRequest.locals = { ...HttpRequest.locals, value };
  }
}

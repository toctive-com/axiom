import { IncomingMessage, ServerResponse } from "node:http";

export class HttpResponse extends ServerResponse<IncomingMessage> {
  /**
   * Ends the response to prepare it for termination
   *
   * @returns A Promise object is being returned.
   *
   */
  send(contents?: string): Promise<this> {
    return new Promise((resolve) => {
      if (contents) {
        this.end(contents, () => resolve(this));
      } else {
        this.end(() => resolve(this));
      }
    });
  }
}

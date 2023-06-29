import { METHODS } from "node:http";

export class Router {
  /**
   * There are all supported HTTP verbs in node.js v18
   * We use these verbs as a fallback if http.METHODS are removed in the future
   * 
   * @var string[]
   * 
   */
  static readonly defaultSupportedHttpVerbs = [
    "acl",
    "bind",
    "checkout",
    "connect",
    "copy",
    "delete",
    "get",
    "head",
    "link",
    "lock",
    "m-search",
    "merge",
    "mkactivity",
    "mkcalendar",
    "mkcol",
    "move",
    "notify",
    "options",
    "patch",
    "post",
    "propfind",
    "proppatch",
    "purge",
    "put",
    "rebind",
    "report",
    "search",
    "source",
    "subscribe",
    "trace",
    "unbind",
    "unlink",
    "unlock",
    "unsubscribe",
  ];

  /**
   * All HTTP verbs that supported by node.js HTTP server
   *
   * @see https://nodejs.org/api/http.html#httpmethods
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
   *
   */
  static readonly httpVerbs = METHODS || Router.defaultSupportedHttpVerbs;
}

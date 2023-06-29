import { Router } from "./Router";

export class Route {
  constructor(
    httpVerb: string|string[],
    uri: string | string[],
    action: CallableFunction[]|CallableFunction|null
  ) {}
}

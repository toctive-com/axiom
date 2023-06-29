import { Router } from "./Router";

export class Route {
  constructor(
    httpVerb: string[],
    uri: string[] | RegExp[],
    action: CallableFunction[] | null
  ) {}
}

export class Route {
  constructor(
    httpVerb: string[],
    uri: string[] | RegExp[],
    action: CallableFunction[] | null
  ) {}
}

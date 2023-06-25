import { Container } from "./Container";


export class Application extends Container {
  /**
   * Defining a version number for MakeX framework
   *
   * @var string
   *
   */
  readonly VERSION = "1.0.0";

  /**
   * Get the number version of the application
   *
   * @return string
   */
  public get version() {
    return this.VERSION;
  }
}

export default Application;
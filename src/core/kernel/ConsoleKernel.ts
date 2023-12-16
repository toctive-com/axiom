import Application from '@/core/Application';
import DefaultCommands from '@/core/console/DefaultCommands';
import { Command } from 'commander';

export class ConsoleKernel {
  /**
   * The `app` property is used to store an instance of the`Application` class,
   * which represents the application being served by the HTTP server.
   *
   * @var Application
   *
   */
  public readonly app: Application;

  /**
   * Creates a server and starts it on port 8000, while also creating
   * an httpTerminator to gracefully shut down the server.
   *
   * @param Server
   *
   */
  constructor(app: Application) {
    this.app = app;
    this.loadDefaultCommands();
    this.program.hook('postAction', () => {
      console.log('Done by Axiom CLI');
    });
  }

  private loadDefaultCommands() {
    DefaultCommands.map((c) => {
      this.program.addCommand(c.init(this.app), { hidden: false });
    });
  }

  /**
   * capture inputs from the command line
   */
  public async captureRequest(program?: Command) {
    const p = program ?? this.program;
    p.parse();
  }

  private _program: Command;
  public get program(): Command {
    if (this._program) return this._program;
    this._program = this.programFactory();
    return this._program;
  }
  public set program(value: Command) {
    this._program = value;
  }

  public programFactory() {
    const program = new Command();
    program.version(this.app.VERSION);
    program.description(
      'Axiom CLI is a tool for managing and creating Axiom projects',
    );
    program.showSuggestionAfterError(true);
    program.showHelpAfterError(true);
    return program;
  }
}
export default ConsoleKernel;

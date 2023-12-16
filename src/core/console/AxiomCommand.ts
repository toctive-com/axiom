import { Command } from 'commander';
import Application from '../Application';

export abstract class AxiomCommand {
  protected app: Application;

  protected command: Command;

  protected abstract name: string;
  public getName(): string {
    return this.name;
  }

  protected description: string;

  constructor() {
    this.command = new Command();
  }

  public async execute(
    args?: Record<string, unknown>,
    program?: Command,
  ): Promise<void> {}

  public init(app?: Application): Command {
    this.app = app;
    this.command.name(this.name);
    this.command.description(this.description);
    this.command.action((args, program) => this.execute(args, program));
    return this.command;
  }
}

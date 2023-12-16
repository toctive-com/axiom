import { Command } from 'commander';
import { AxiomCommand } from '../AxiomCommand';
import chalk from 'chalk';

export class ListCommand extends AxiomCommand {
  protected name = 'list';
  protected description =
    'List all commands available with a description for every command';

  public async execute(
    args?: Record<string, unknown>,
    program?: Command,
  ): Promise<void> {
    console.log(program.parent.helpInformation());

    const commands: string[][] = this.getCommands(program);
    commands.forEach((cmd) => console.log(cmd.join(' ')));
  }

  private getCommands(program: Command) {
    const commands: string[][] = [];

    program.parent.commands.map((cmd) => {
      const name = chalk.bold.green(cmd.name());
      const description = chalk.bold.blue(cmd.description());

      const maxLengthOfLine =
        process.stdout.columns - name.length - description.length;
      const lengthOfLine = maxLengthOfLine < 1 ? 1 : maxLengthOfLine;
      const line = '.'.repeat(lengthOfLine);

      commands.push([name, line, description]);
    });

    return commands;
  }
}

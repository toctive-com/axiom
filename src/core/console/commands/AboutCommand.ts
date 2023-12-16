import { Command } from 'commander';
import { AxiomCommand } from '../AxiomCommand';

export class AboutCommand extends AxiomCommand {
  protected name = 'about';
  protected description = 'About this application';

  public async execute(
    args?: Record<string, unknown>,
    program?: Command,
  ): Promise<void> {
    let parent = this.command;
    while (true) {
      if (this.command.parent) parent = this.command.parent;
      else break;
    }
    console.log(parent.name);
    console.log(parent.description);
    console.log(parent.commands);
  }
}

import * as boxen from 'boxen';
import chalk from 'chalk';
import { Command } from 'commander';
import { existsSync, renameSync } from 'fs';
import { join } from 'node:path';
import { cwd } from 'process';
import { AxiomCommand } from '../AxiomCommand';

export class UpCommand extends AxiomCommand {
  protected name = 'up';
  protected description = 'Turn off the maintenance mode';

  public async execute(
    args?: Record<string, unknown>,
    program?: Command,
  ): Promise<void> {
    this.checkIfMaintenanceModeDisabled();

    this.enableMaintenanceModeIfDisabled();

    console.log(
      boxen.default(chalk.green('Maintenance mode disabled'), {
        width: process.stdout.columns,
        padding: 1,
        textAlignment: 'center',
      }),
    );
  }

  protected checkIfMaintenanceModeDisabled() {
    if (existsSync(join(cwd(), '.down'))) {
      console.log(chalk.yellow('Maintenance mode already disabled'));
      process.exit();
    }
  }

  protected enableMaintenanceModeIfDisabled() {
    if (existsSync(join(cwd(), 'down'))) {
      renameSync(join(cwd(), 'down'), join(cwd(), '.down'));
    }
  }
}

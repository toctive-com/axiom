import * as boxen from 'boxen';
import chalk from 'chalk';
import { Command } from 'commander';
import { existsSync, renameSync, writeFileSync } from 'fs';
import { join } from 'path';
import { cwd } from 'process';
import { AxiomCommand } from '../AxiomCommand';

export class DownCommand extends AxiomCommand {
  protected name = 'down';
  protected description = 'Turn on the maintenance mode';

  public async execute(
    args?: Record<string, unknown>,
    program?: Command,
  ): Promise<void> {
    this.checkIfMaintenanceModeEnabled();

    this.enableMaintenanceModeIfDisabled();

    this.createDownFile();

    console.log(
      boxen.default(chalk.green('Maintenance mode enabled'), {
        width: process.stdout.columns,
        padding: 1,
        textAlignment: 'center',
      }),
    );
  }

  protected checkIfMaintenanceModeEnabled() {
    if (existsSync(join(cwd(), 'down'))) {
      console.log(chalk.yellow('Maintenance mode already enabled'));
      process.exit();
    }
  }

  protected enableMaintenanceModeIfDisabled() {
    if (existsSync(join(cwd(), '.down'))) {
      renameSync(join(cwd(), '.down'), 'down');
    }
  }

  protected createDownFile() {
    if (!existsSync(join(cwd(), 'down'))) {
      writeFileSync(
        join(cwd(), 'down'),
        `# About This File

This file is create to determine if the application is in maintenance mode or not.
If the website is in maintenance mode, then the application will use the configurations in \`./src/config/maintenance.ts\`

To enable maintenance mode just rename this file to \`down\` instead of \`.down\` and Axiom will detect this change with every incoming request, then take actions based on maintenance configurations.

You can, also, use Axiom CLI to enable and disable maintenance mode by running the next commands:

\`\`\`bash
npx x down  # Enable maintenance mode, This stops your website completely
npx x up  # Disable maintenance mode, Making your website works again
\`\`\`
`,
      );
    }
  }
}

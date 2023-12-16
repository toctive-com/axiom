import { Command } from 'commander';
import { AxiomCommand } from '../AxiomCommand';
import { execSync } from 'child_process';

export class ServeCommand extends AxiomCommand {
  protected name = 'serve';
  protected description = 'Start the development server';

  public async execute(
    args?: Record<string, unknown>,
    program?: Command,
  ): Promise<void> {
    execSync('npm run dev', { stdio: 'inherit' });
  }
}

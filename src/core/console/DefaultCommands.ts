import { AxiomCommand } from './AxiomCommand';
import { AboutCommand } from './commands/AboutCommand';
import { DownCommand } from './commands/DownCommand';
import { ListCommand } from './commands/ListCommand';
import { ServeCommand } from './commands/ServeCommand';
import { UpCommand } from './commands/UpCommand';

export const DefaultCommands: AxiomCommand[] = [
  new AboutCommand(),
  // new ListCommand(),
  // new DownCommand(),
  // new UpCommand(),
  // new ServeCommand(),
];

export default DefaultCommands;

import { LogDetails } from '../LogDetails';
import { LogTransport } from './LogTransport';

export class FileTransport implements LogTransport {
  constructor(private filePath: string) {}

  async log(logDetails: LogDetails): Promise<void> {
    // TODO Implement file log writing logic using logDetails
  }
}

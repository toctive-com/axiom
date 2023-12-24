import { randomUUID } from 'crypto';
import { writeFileSync } from 'fs';
import { writeFile } from 'fs/promises';
import * as mimeTypes from 'mime-types';

export class File {
  public readonly originalFileName: string;
  public fileName: string;
  private buffer: Buffer;
  protected mimeType?: string;
  protected encoding?: string;
  protected extension?: string | boolean;

  constructor(fileData: {
    originalFileName: string;
    buffer: Buffer;
    mimeType?: string;
    encoding?: string;
    extension?: string | boolean;
  }) {
    this.originalFileName = fileData.originalFileName;
    this.fileName = `${randomUUID()}${
      this.getExtension() ? '.' + this.getExtension() : ''
    }`;
    this.buffer = fileData.buffer;
    this.extension = fileData.extension;
    this.mimeType = fileData.mimeType;
    this.encoding = fileData.encoding;
  }

  getSize(): number {
    return this.buffer.length;
  }

  getMimeType(): string {
    if (this.mimeType) return this.mimeType;
    return (this.mimeType =
      mimeTypes.lookup(this.originalFileName) || 'application/octet-stream');
  }

  getExtension(): string | boolean {
    if (this.extension) return this.extension;
    return (this.extension = mimeTypes.extension(this.getMimeType()));
  }

  async saveToFile(filePath: string): Promise<void> {
    await writeFile(filePath, this.buffer);
  }

  saveToFileSync(filePath: string): void {
    writeFileSync(filePath, this.buffer);
  }
}

export default File;

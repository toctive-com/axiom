import Application from '@/core/Application';
import { Jsonable } from '@/types/Jsonable';
import { stringify } from '@/utils/helpers/stringify';
import Busboy from 'busboy';
import { IncomingMessage } from 'node:http';
import { Stream } from 'node:stream';
import * as querystring from 'querystring';
import { File } from '../file-system';

export class Request extends IncomingMessage implements Jsonable {
  /**
   * The `app` property is used to store an instance of the`Application` class,
   * which represents the application being served by the HTTP server.
   *
   * @var Application
   *
   */
  public app: Application;

  _body: any = {};
  public get body(): any {
    return this._body;
  }

  public set body(value: unknown) {
    if (typeof value !== 'object') {
      this._body = value;
      return;
    }

    this._body = { ...this._body, ...value };
  }

  public files: Record<string, File> = {};

  public async parseBody(): Promise<void> {
    const contentType = this.headers['content-type'] || '';
    if (contentType.includes('application/json')) {
      this.body = await this.parseJson();
    }

    if (contentType.includes('application/x-www-form-urlencoded')) {
      this.body = await this.parseUrlEncoded();
    }

    if (contentType.includes('multipart/form-data')) {
      const parsedData = await this.parseMultipart();
      this.files = parsedData.files;
      this.body = parsedData.fields;
    }

    if (contentType.includes('text/plain')) {
      this.body = await this.parseText();
    }
  }

  private async parseJson(): Promise<any> {
    return new Promise((resolve, reject) => {
      let data = '';

      this.on('data', (chunk) => {
        data += chunk;
      });

      this.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(new Error('Invalid JSON format'));
        }
      });
    });
  }

  private async parseUrlEncoded(): Promise<any> {
    return new Promise((resolve, reject) => {
      let data = '';

      this.on('data', (chunk) => {
        data += chunk;
      });

      this.on('end', () => {
        resolve(querystring.parse(data));
      });
    });
  }

  private async parseMultipart(): Promise<{
    fields: Record<string, unknown>;
    files: Record<string, File>;
  }> {
    return new Promise((resolve, reject) => {
      const busboy = Busboy({ headers: this.headers });

      const files = {};
      const fields: { [key: string]: any } = {};

      busboy.on(
        'file',
        (
          fieldName: string,
          fileStream: Stream,
          fileData: { filename: string; encoding: string; mimeType: string },
        ) => {
          const buffers: Buffer[] = [];
          fileStream.on('data', (data: Buffer) => buffers.push(data));
          fileStream.on('end', () => {
            files[fieldName] = new File({
              buffer: Buffer.concat(buffers),
              originalFileName: fileData.filename,
              encoding: fileData.encoding,
              mimeType: fileData.mimeType,
            });
          });
        },
      );

      busboy.on('field', (fieldName, value) => {
        // Support nested keys
        const keys = fieldName.split('.');
        let currentObj = fields;

        keys.forEach((key, index) => {
          if (!currentObj[key]) {
            if (index === keys.length - 1) {
              // Last key, assign the value
              currentObj[key] = value;
            } else {
              // Create an object for the nested key
              currentObj[key] = {};
              currentObj = currentObj[key];
            }
          } else if (index === keys.length - 1) {
            // Last key, append the value (in case of repeated fields)
            if (!Array.isArray(currentObj[key])) {
              currentObj[key] = [currentObj[key]];
            }
            currentObj[key].push(value);
          } else {
            // Continue with the nested object
            currentObj = currentObj[key];
          }
        });
      });

      busboy.on('finish', () => {
        resolve({ fields, files });
      });

      this.pipe(busboy);
    });
  }

  private async parseText(): Promise<string> {
    return new Promise((resolve, reject) => {
      let data = '';

      this.on('data', (chunk) => {
        data += chunk;
      });

      this.on('end', () => {
        resolve(data);
      });
    });
  }

  static locals: any = {};
  public get locals(): any {
    return Request.locals;
  }
  public set locals(value: any) {
    Request.locals = { ...Request.locals, value };
  }

  static params: any = {};
  public get params(): any {
    return Request.params;
  }
  public set params(value: any) {
    Request.params = value;
  }

  /**
   * Converts The request to a JSON string representation with optional
   * indentation.
   *
   * @param [spaces=0] - The number of spaces to use for indentation when
   * converting the object to JSON. By default, it is set to 0, which means no
   * indentation will be used.
   * @returns A string representation of the object.
   *
   * @example
   *```js
   *Router.get('/request', ({ request }: RouteActionParameters) =>{
   *    return request.toJson(),
   *});
   *```
   *
   */
  toJson(spaces: number = 0): string {
    return stringify(this, spaces);
  }
}

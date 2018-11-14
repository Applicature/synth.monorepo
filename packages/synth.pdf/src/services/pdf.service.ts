import * as fs from 'fs';
import * as pdf from 'html-pdf';
import {CreateOptions} from 'html-pdf';

export class PdfService {
    public async generateBuffer(html: string, options: CreateOptions): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            pdf.create(html, options).toBuffer((err: Error, buffer: Buffer) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(buffer);
                }
            });
        });
    }

    public async generatePipe(html: string, options: CreateOptions): Promise<fs.ReadStream> {
        return new Promise<fs.ReadStream>((resolve, reject) => {
            pdf.create(html, options).toStream((err: Error, stream: fs.ReadStream) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(stream);
                }
            });
        });
    }
}

import * as fs from 'fs';
import { PdfService } from '../../src/services/pdf.service';

const testHtml = fs.readFileSync(__dirname + '/test.html');

describe('service', () => {
    it('generate pdf', async () => {
        const service = new PdfService();

        const options = {
            height: '50mm',
            width: '50mm',
        };

        const buffer = await service.generateBuffer(testHtml.toString('utf-8'), options);

        expect(buffer).toBeTruthy();
    });

    it('generate pdf & store to filesystem', async () => {
        const service = new PdfService();

        const options = {
            height: '50mm',
            width: '50mm',
        };

        const buffer = await service.generateBuffer(testHtml.toString('utf-8'), options);

        expect(buffer).toBeTruthy();

        fs.writeFileSync(__dirname + '/test.pdf', buffer);
    });
});

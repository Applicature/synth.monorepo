import { get as getConfig } from 'config';
import { createCipher, createDecipher, createHash } from 'crypto';

export function encrypt(text: string): string {
    const cipher = createCipher(getConfig('crypt.algo'), getConfig('crypt.secret'));

    let crypted = cipher.update(text, 'utf8', 'hex');

    crypted += cipher.final('hex');

    return crypted;
}

export function decrypt(text: string): string {
    const decipher = createDecipher(getConfig('crypt.algo'), getConfig('crypt.secret'));

    let dec = decipher.update(text, 'hex', 'utf8');

    dec += decipher.final('utf8');

    return dec;
}

export function encryptBuffer(buffer: Buffer) {
    const cipher = createCipher(getConfig('crypt.algo'), getConfig('crypt.secret'));

    const crypted = Buffer.concat([cipher.update(buffer), cipher.final()]);

    return crypted;
}

export function decryptBuffer(buffer: Buffer) {
    const decipher = createDecipher(getConfig('crypt.algo'), getConfig('crypt.secret'));

    const dec = Buffer.concat([decipher.update(buffer), decipher.final()]);

    return dec;
}

export function sha256(data: string): string {
    return createHash('sha256').update(data).digest('base64');
}

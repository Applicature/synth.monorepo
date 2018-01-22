import { 
    encrypt,
    decrypt,
    encryptBuffer,
    decryptBuffer,
    sha256,
} from '../../src/services/crypt';

describe('crypt', () => {

    it('should encrypt string', () =>  {
        const text = 'test string';
        const encrypted = encrypt(text);
        expect(encrypted).toBeTruthy();
    });

    it('should decrypt string', () => {
        const text = 'test string';
        const encrypted = encrypt(text);
        const decrypted = decrypt(encrypted);
        expect(decrypted).toBe(text);
    });

    it('should not decrypt bad input', () => {
        expect(() => {
            decrypt('test string');
        }).toThrow();
    });

    it('should encrypt and decrypt buffer', () => {
        const buffer = Buffer.allocUnsafe(10);
        const encrypted = encryptBuffer(buffer);
        const decrypted = decryptBuffer(encrypted);
        expect(buffer.equals(decrypted)).toBeTruthy();
    });

    it('should do sha256', () => {
        const text = 'test string';
        const hash = sha256(text);
        expect(hash).toBe('1VecRt/MfxggcBPmW0Tky04sIpj0rEV7qPgnQ/Mekws=');
    });
})

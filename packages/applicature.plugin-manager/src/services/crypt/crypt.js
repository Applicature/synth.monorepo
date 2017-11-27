const config = require('config');
const crypto = require('crypto');

function encrypt(text) {
    const cipher = crypto.createCipher(config.get('crypt.algo'), config.get('crypt.secret'));

    let crypted = cipher.update(text, 'utf8', 'hex');

    crypted += cipher.final('hex');

    return crypted;
}

function decrypt(text) {
    const decipher = crypto.createDecipher(config.get('crypt.algo'), config.get('crypt.secret'));

    let dec = decipher.update(text, 'hex', 'utf8');

    dec += decipher.final('utf8');

    return dec;
}

function encryptBuffer(buffer) {
    const cipher = crypto.createCipher(config.get('crypt.algo'), config.get('crypt.secret'));

    const crypted = Buffer.concat([cipher.update(buffer), cipher.final()]);

    return crypted;
}

function decryptBuffer(buffer) {
    const decipher = crypto.createDecipher(config.get('crypt.algo'), config.get('crypt.secret'));

    const dec = Buffer.concat([decipher.update(buffer), decipher.final()]);

    return dec;
}

function sha256(data) {
    return crypto.createHash('sha256').update(data).digest('base64');
}

module.exports = {
    encrypt,
    decrypt,
    encryptBuffer,
    decryptBuffer,
    sha256,
};

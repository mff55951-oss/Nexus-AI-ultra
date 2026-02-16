const crypto = require('crypto');

// Function to encrypt API keys
function encrypt(text, secret) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secret), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Function to decrypt API keys
function decrypt(text, secret) {
    const parts = text.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const encryptedText = Buffer.from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secret), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

// Example usage
const secretKey = 'your-32-char-long-secret-key';
const apiKey = 'your-api-key-here';

const encryptedAPIKey = encrypt(apiKey, secretKey);
const decryptedAPIKey = decrypt(encryptedAPIKey, secretKey);

console.log('Encrypted API Key:', encryptedAPIKey);
console.log('Decrypted API Key:', decryptedAPIKey);

module.exports = { encrypt, decrypt };
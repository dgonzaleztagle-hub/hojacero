import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const ENCRYPTION_KEY = process.env.PAYMENT_ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
    throw new Error('PAYMENT_ENCRYPTION_KEY environment variable is required');
}

// Asegurar que la clave tenga 32 bytes
const key = Buffer.from(ENCRYPTION_KEY.padEnd(64, '0').slice(0, 64), 'hex');

export function encryptCredentials(credentials: Record<string, string>): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(JSON.stringify(credentials), 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return JSON.stringify({
        iv: iv.toString('hex'),
        encrypted,
        authTag: authTag.toString('hex')
    });
}

export function decryptCredentials(encryptedData: string): Record<string, string> {
    const { iv, encrypted, authTag } = JSON.parse(encryptedData);

    const decipher = crypto.createDecipheriv(
        ALGORITHM,
        key,
        Buffer.from(iv, 'hex')
    );

    decipher.setAuthTag(Buffer.from(authTag, 'hex'));

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
}

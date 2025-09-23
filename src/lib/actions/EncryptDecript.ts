// src/lib/security/encryption.ts
import crypto from 'crypto';

// 🔐 ENCRYPT: Turn readable key into gibberish
export function encryptAPIKey(plainKey: string): string {
  const password = process.env.ENCRYPTION_SECRET;
  if (!password) {
    throw new Error('ENCRYPTION_SECRET environment variable is not set.');
  }

  const key = crypto.scryptSync(password, 'salt', 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  
  let encrypted = cipher.update(plainKey, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  const authTag = cipher.getAuthTag();
  
  // Combine IV, auth tag, and encrypted data into a single Base64 string
  const payload = Buffer.concat([iv, authTag, Buffer.from(encrypted, 'base64')]);
  return payload.toString('base64');
}

// 🔓 DECRYPT: Turn gibberish back into readable key
export function decryptAPIKey(encryptedKey: string): string {
  const password = '3hGj5K!p$z@W9q&tY#f2Bv7x^*(l2k39';
  if (!password) {
    throw new Error('ENCRYPTION_SECRET environment variable is not set.');
  }

  const key = crypto.scryptSync(password, 'salt', 32);
  const payload = Buffer.from(encryptedKey, 'base64');
  
  // Split the payload back into its components
  const iv = payload.slice(0, 16);
  const authTag = payload.slice(16, 32);
  const encrypted = payload.slice(32);
  
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted.toString('base64'), 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted; // Returns the original API key
}



export const generateProxyKey = () => {
  // Generates a cryptographically strong pseudo-random data string in a specified format.
  // We'll use a 16-byte buffer and convert it to a hexadecimal string.
  return crypto.randomBytes(16).toString('hex');
};
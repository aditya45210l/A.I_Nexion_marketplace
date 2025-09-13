// src/lib/security/encryption.ts
import crypto from 'crypto';

// 🔐 ENCRYPT: Turn readable key into gibberish
export function encryptAPIKey(plainKey: string): string {
  // 1. Get secret password from environment
  const password = process.env.ENCRYPTION_SECRET;
  if (!password) {
    throw new Error('ENCRYPTION_SECRET environment variable is not set.');
  }
 
  // 2. Create encryption key from password
  const key = crypto.scryptSync(password, 'salt', 32);
 
  // 3. Create random IV (initialization vector)
  const iv = crypto.randomBytes(16);
 
  // 4. Create cipher using createCipheriv
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
 
  // 5. Encrypt the API key
  let encrypted = cipher.update(plainKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
 
  // 6. Get authentication tag (for security)
  const authTag = cipher.getAuthTag();
 
  // 7. Combine everything into one string
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}

// 🔓 DECRYPT: Turn gibberish back into readable key
export function decryptAPIKey(encryptedKey: string): string {
  const password = process.env.ENCRYPTION_SECRET;
  if (!password) {
    throw new Error('ENCRYPTION_SECRET environment variable is not set.');
  }

  const key = crypto.scryptSync(password, 'salt', 32);
 
  // 1. Split the encrypted string
  const [ivHex, authTagHex, encrypted] = encryptedKey.split(':');
 
  // 2. Convert back to buffers
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
 
  // 3. Create decipher
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
 
  // 4. Decrypt
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
 
  return decrypted; // Returns the original API key
}
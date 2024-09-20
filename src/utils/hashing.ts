import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);
export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const hash = (await scrypt(password, salt, 64)) as Buffer;
  const result = salt + '.' + hash.toString('hex');
  return result;
}
export async function comparePassword(
  storedPassword: string,
  suppliedPassword: string,
) {
  const [salt, storedHash] = storedPassword.split('.');
  const hash = (await scrypt(suppliedPassword, salt, 64)) as Buffer;
  return storedHash === hash.toString('hex');
}

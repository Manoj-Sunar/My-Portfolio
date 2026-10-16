import crypto from 'crypto';

/** SHA-256 hex digest — used for high-entropy tokens (reset tokens). */
export const sha256 = (input: string): string =>
  crypto.createHash('sha256').update(input).digest('hex');

/** bcrypt is overkill for OTPs (low entropy + short TTL). SHA-256 is fine. */
export const hashOTP = (otp: string, secret: string): string =>
  crypto.createHmac('sha256', secret).update(otp).digest('hex');

/** Constant-time string compare to avoid timing attacks. */
export const timingSafeEqual = (a: string, b: string): boolean => {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
};

/** Generate a random 6-digit numeric OTP. */
export const generateOTP = (length = 6): string => {
  const max = 10 ** length;
  const n = crypto.randomInt(0, max);
  return n.toString().padStart(length, '0');
};

/** Generate a secure random hex token. */
export const generateToken = (bytes = 32): string => crypto.randomBytes(bytes).toString('hex');
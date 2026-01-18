/**
 * Generates a unique Member ID in the format M-XXXXXX
 * where XXXXXX is a alphanumeric uppercase string.
 */
export const generateMemberId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'M-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generates a random 6-digit PIN.
 */
export const generatePin = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

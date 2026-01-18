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

/**
 * Basic CSV Parser.
 * Expected headers: full_name, phone_number, email (optional)
 */
export const parseCSV = (text) => {
  const lines = text.split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const results = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(',').map(v => v.trim());
    const obj = {};
    
    headers.forEach((header, index) => {
      // Map common variations to strict keys
      if (header.includes('name')) obj.name = values[index];
      else if (header.includes('phone')) obj.phone = values[index];
      else if (header.includes('email')) obj.email = values[index];
      else obj[header] = values[index];
    });

    if (obj.name && obj.phone) {
      results.push(obj);
    }
  }

  return results;
};

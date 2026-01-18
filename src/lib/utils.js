import * as XLSX from 'xlsx';

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

/**
 * Excel Parser using SheetJS (xlsx).
 * Expected headers: full_name, phone_number, email (optional)
 */
export const parseExcel = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        
        const results = json.map(row => {
          const normalized = {};
          Object.keys(row).forEach(key => {
            const k = key.toLowerCase();
            if (k.includes('name')) normalized.name = row[key];
            else if (k.includes('phone')) normalized.phone = row[key];
            else if (k.includes('email')) normalized.email = row[key];
          });
          return normalized;
        }).filter(item => item.name && item.phone);
        
        resolve(results);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

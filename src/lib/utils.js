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
 * Basic CSV Parser with delimiter detection.
 * Expected headers: name, phone, email (optional)
 */
export const parseCSV = (text) => {
  const lines = text.split(/\r?\n/).filter(line => line.trim());
  if (lines.length < 2) return [];

  // Detect delimiter (comma or semicolon)
  const firstLine = lines[0];
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semiCount = (firstLine.match(/;/g) || []).length;
  const delimiter = semiCount > commaCount ? ';' : ',';

  const headers = firstLine.split(delimiter).map(h => 
    h.trim().toLowerCase().replace(/[^a-z0-9]/g, '')
  );
  
  const results = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(delimiter).map(v => v.trim());
    const obj = {};
    
    headers.forEach((header, index) => {
      const val = values[index];
      if (header.includes('name')) obj.name = val;
      else if (header.includes('phone') || header.includes('contact') || header.includes('mobile')) obj.phone = val;
      else if (header.includes('email')) obj.email = val;
    });

    if (obj.name && obj.phone) {
      results.push(obj);
    }
  }

  return results;
};

/**
 * Excel Parser using SheetJS (xlsx).
 * Expected headers: name, phone, email (optional)
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
        
        // Convert with original headers
        const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        
        const results = json.map(row => {
          const normalized = {};
          Object.keys(row).forEach(key => {
            const k = key.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
            const val = String(row[key]).trim();

            if (k.includes('name')) normalized.name = val;
            else if (k.includes('phone') || k.includes('contact') || k.includes('mobile')) normalized.phone = val;
            else if (k.includes('email')) normalized.email = val;
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

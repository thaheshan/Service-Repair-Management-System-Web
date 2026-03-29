const fs = require('fs');
const path = require('path');

const filePath = 'C:\\Users\\Thahe\\Documents\\GitHub\\Service-Repair-Management-System-Web\\srm-frontend\\src\\app\\admin\\invoices\\page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// The file is currently a giant string with literal \\n characters.
// We need to decode it.
// We can use a trick: JSON.parse if the file starts and ends with quotes? 
// No, it's not a JSON string, it's just raw text with escaped chars.

// Replace escaped newlines with real ones
// Note: We need to match literal backslash-n
content = content.replace(/\\n/g, '\n');

// Also fix any other escaped characters if any (like quotes)
content = content.replace(/\\"/g, '"');

fs.writeFileSync(filePath, content, 'utf8');
console.log('File formatting restored successfully.');

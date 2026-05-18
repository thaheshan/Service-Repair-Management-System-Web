const { execSync } = require('child_process');
const path = require('path');

const apiPath = path.resolve(__dirname, '../Service-Repair-Management-System-Api');
console.log('Running db update in', apiPath);
try {
  const output = execSync('node delete_duplicate_staff.js', { cwd: apiPath, encoding: 'utf-8' });
  console.log('Output from script:', output);
} catch (e) {
  console.error('Failed to run db update:', e);
}

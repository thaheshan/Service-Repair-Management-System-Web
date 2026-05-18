const { execSync } = require('child_process');
const path = require('path');

const apiPath = path.resolve(__dirname, '../Service-Repair-Management-System-Api');
try {
  const output = execSync('node get_all_staff.js', { cwd: apiPath, encoding: 'utf-8' });
  console.log(output);
} catch (e) {
  console.error('Failed to run staff fetch script:', e);
}

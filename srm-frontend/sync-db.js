const { execSync } = require('child_process');
const path = require('path');

const apiPath = path.resolve(__dirname, '../../Service-Repair-Management-System-Api');
console.log('Running prisma db push in', apiPath);
try {
  console.log('Pushing schema...');
  execSync('npx prisma db push --accept-data-loss', { cwd: apiPath, stdio: 'inherit' });
  console.log('Generating client...');
  execSync('npx prisma generate', { cwd: apiPath, stdio: 'inherit' });
  console.log('Success! The database is now synced.');
} catch (e) {
  console.error('Failed to sync database:', e);
}

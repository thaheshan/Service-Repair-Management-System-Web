const http = require('http');
http.get('http://localhost:8000/api', (res) => {
  console.log('STATUS:', res.statusCode);
}).on('error', (err) => {
  console.error('ERROR:', err.message);
});

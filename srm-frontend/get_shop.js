const https = require('https');

const options = {
  hostname: 'wbpsllusfdjiorlaghpo.supabase.co',
  path: '/rest/v1/Shop?select=id,shopCode,name,email',
  method: 'GET',
  headers: {
    'apikey': 'sb_publishable_PkuuTTVJUyqQ9PP4SybBbg_CnG2dQl0',
    'Authorization': 'Bearer sb_publishable_PkuuTTVJUyqQ9PP4SybBbg_CnG2dQl0'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('SHOPS_RESULT:', data);
  });
});

req.on('error', (e) => {
  console.error('HTTPS ERROR:', e.message);
});

req.end();

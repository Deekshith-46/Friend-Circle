const http = require('http');

// Create a simple HTTP request to test our endpoint
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/female-user/rewards/weekly-rank',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MzNlYmI4MTQ5YjNmYmE0NDE3ODlkYiIsImVtYWlsIjoic3JpamExMkBnbWFpbC5jb20iLCJpYXQiOjE3MzM4MDQ4MDAsImV4cCI6MTczNjM5NjgwMH0.5RnY5n5n5n5n5n5n5n5n5n5n5n5n5n5n5n5n5n5n5n5',
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:');
    console.log(data);
    process.exit(0);
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
  process.exit(1);
});

req.end();
const jwt = require('jsonwebtoken');

// Replace this with your actual JWT_SECRET from Render environment variables
const JWT_SECRET = 'npg_IA6mN4eKrSLu'; // Update this!

// Create test tokens
const adminPayload = {
  sub: 1,
  email: 'admin@test.com',
  role: 'admin',
  firstName: 'Admin',
  lastName: 'User',
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
};

const customerPayload = {
  sub: 2,
  email: 'customer@test.com',
  role: 'customer',
  firstName: 'Test',
  lastName: 'Customer',
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
};

console.log('='.repeat(80));
console.log('🔐 JWT TOKENS FOR POSTMAN TESTING');
console.log('='.repeat(80));

try {
  const adminToken = jwt.sign(adminPayload, JWT_SECRET);
  const customerToken = jwt.sign(customerPayload, JWT_SECRET);

  console.log('\n👨‍💼 ADMIN TOKEN:');
  console.log('Email: admin@test.com');
  console.log('Role: admin');
  console.log('Token:');
  console.log(adminToken);

  console.log('\n👤 CUSTOMER TOKEN:');
  console.log('Email: customer@test.com');
  console.log('Role: customer');
  console.log('Token:');
  console.log(customerToken);

  console.log('\n📋 POSTMAN SETUP:');
  console.log('1. Set collection variable "authToken" to one of the tokens above');
  console.log('2. Use {{authToken}} in Authorization header as "Bearer {{authToken}}"');
  console.log('3. Test protected endpoints with the appropriate role token');

  console.log('\n⚠️  NOTE: These tokens are generated with the default JWT secret.');
  console.log('If your app uses a different secret, these tokens won\'t work.');

} catch (error) {
  console.error('Error generating tokens:', error.message);
  console.log('\nInstall jsonwebtoken if missing:');
  console.log('npm install jsonwebtoken');
}

console.log('\n' + '='.repeat(80));

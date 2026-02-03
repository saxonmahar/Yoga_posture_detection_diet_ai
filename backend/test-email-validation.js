// Quick test script for email validation
const { quickDomainCheck } = require('./services/emailValidationService');

console.log('🧪 Testing Email Validation Service');
console.log('=====================================');

const testEmails = [
  'user@gmail.com',           // Should pass (trusted)
  'test@tempmail.com',        // Should fail (suspicious)
  'fake@fakefakedomain123.com', // Should fail (suspicious pattern)
  'user@yahoo.com',           // Should pass (trusted)
  'test@10minutemail.com',    // Should fail (suspicious)
  'user@protonmail.com'       // Should pass (trusted)
];

testEmails.forEach(email => {
  const result = quickDomainCheck(email);
  const status = result.isValid ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} ${email}: ${result.reason}`);
});

console.log('\n🔍 Testing register controller import...');
try {
  const registerController = require('./controllers/registerController');
  console.log('✅ Register controller imported successfully');
} catch (error) {
  console.log('❌ Register controller import failed:', error.message);
}
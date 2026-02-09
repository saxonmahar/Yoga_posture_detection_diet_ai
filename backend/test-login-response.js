const axios = require('axios');

async function testLogin() {
  try {
    console.log('🔐 Testing login endpoint...\n');
    
    const response = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'sanjaymahar2058@gmail.com',
      password: '1234567890'
    }, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Login successful!\n');
    console.log('📦 Full Response:', JSON.stringify(response.data, null, 2));
    console.log('\n🔍 User object:', JSON.stringify(response.data.data?.user, null, 2));
    console.log('\n🛡️  Role field:', response.data.data?.user?.role);
    console.log('🔍 Role type:', typeof response.data.data?.user?.role);
    
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
  }
}

testLogin();

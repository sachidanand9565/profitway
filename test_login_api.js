// Simple test script to verify login API returns photo and state
const testLoginAPI = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'test@example.com',
        password: 'test123'
      })
    });

    const data = await response.json();
    console.log('Login API Response:', JSON.stringify(data, null, 2));

    if (data.user) {
      console.log('User data includes:');
      console.log('- photo:', !!data.user.photo);
      console.log('- state:', !!data.user.state);
      console.log('- Photo value:', data.user.photo);
      console.log('- State value:', data.user.state);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testLoginAPI();

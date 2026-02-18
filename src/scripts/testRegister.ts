import 'dotenv/config';
import axios from 'axios';

async function testRegister() {
    try {
        console.log('Testing registration endpoint...\n');
        
        const testUser = {
            firstName: 'John',
            lastName: 'Doe',
            email: `test${Date.now()}@example.com`,
            password: 'test123'
        };

        console.log('Sending request to: http://localhost:3000/api/v1/auth/register');
        console.log('Payload:', testUser);

        const response = await axios.post('http://localhost:3000/api/v1/auth/register', testUser);
        
        console.log('\n✅ Registration successful!');
        console.log('Response:', response.data);

    } catch (error: any) {
        console.error('\n❌ Registration failed!');
        console.error('Status:', error.response?.status);
        console.error('Error:', error.response?.data);
        console.error('Full error:', error.message);
    }
}

testRegister();

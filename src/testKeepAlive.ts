// Test script to manually check if keep-alive is working
// Run this with: npx ts-node src/testKeepAlive.ts

import { KeepAlive, getServerUrl } from './keepAlive';
import { SERVER_URL } from './etc/secrets/config';

async function testKeepAlive() {
    console.log('🧪 Testing Keep-Alive functionality...\n');
    
    const serverUrl = getServerUrl();
    console.log(`📡 Testing URL: ${serverUrl}`);
    console.log(`🔧 SERVER_URL from config: ${SERVER_URL}`);
    
    try {
        // Test health endpoint directly
        console.log('🔍 Testing health endpoint...');
        const response = await fetch(`${serverUrl}/health`);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Health endpoint is working!');
            console.log('📊 Response:', JSON.stringify(data, null, 2));
        } else {
            console.log(`❌ Health endpoint returned: ${response.status}`);
        }
        
        // Test keep-alive service
        console.log('\n🔄 Testing Keep-Alive service (1 ping)...');
        const keepAlive = new KeepAlive(serverUrl, 0.1); // Ping every 6 seconds for testing
        keepAlive.start();
        
        // Stop after 10 seconds
        setTimeout(() => {
            keepAlive.stop();
            console.log('\n✅ Test completed!');
            process.exit(0);
        }, 10000);
        
    } catch (error) {
        console.log(`❌ Error testing keep-alive: ${error}`);
        process.exit(1);
    }
}

// Run the test
testKeepAlive();

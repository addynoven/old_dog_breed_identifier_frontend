import { createClient } from 'redis';

export async function testValkeyConnection() {
  console.log('🔄 Testing Valkey connection...');
  
  const client = createClient({
    url: process.env.AIVEN_VALKEY_URI
  });

  client.on('error', (err) => {
    console.error('❌ Valkey Client Error:', err);
  });

  try {
    console.log('🔗 Connecting to Valkey...');
    await client.connect();
    console.log('✅ Connected to Valkey successfully');

    console.log('📝 Setting key "ping" with value "pong"...');
    await client.set('ping', 'pong');
    console.log('✅ Key "ping" set successfully');

    console.log('🔍 Getting value of key "ping"...');
    const value = await client.get('ping');
    console.log('📋 Value retrieved:', value);

    if (value === 'pong') {
      console.log('🎉 Valkey connection test PASSED! ping -> pong');
    } else {
      console.log('❌ Valkey connection test FAILED! Expected "pong", got:', value);
    }

    await client.disconnect();
    console.log('🔌 Disconnected from Valkey');
    
  } catch (error) {
    console.error('❌ Valkey connection test failed:', error);
  }
}

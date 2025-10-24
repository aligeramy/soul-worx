import { readFileSync } from 'fs';
import { join } from 'path';
import jwt from 'jsonwebtoken';

/**
 * Generate Apple Client Secret JWT
 * Required for Sign in with Apple on web
 */

// Configuration
const TEAM_ID = '23MN72U7PA';
const KEY_ID = 'W838JBXCVM';
const CLIENT_ID = 'com.softx.soulworx';
const PRIVATE_KEY_PATH = join(process.cwd(), 'AuthKey_W838JBXCVM.p8');

function generateClientSecret(): string {
  // Read private key
  const privateKey = readFileSync(PRIVATE_KEY_PATH, 'utf8');

  // JWT Payload
  const now = Math.floor(Date.now() / 1000);
  const expiration = now + (86400 * 180); // 180 days (6 months - Apple's maximum)

  // Generate the JWT token using jsonwebtoken library
  // This properly handles ES256 signing which Apple requires
  const token = jwt.sign(
    {
      iss: TEAM_ID,
      iat: now,
      exp: expiration,
      aud: 'https://appleid.apple.com',
      sub: CLIENT_ID,
    },
    privateKey,
    {
      algorithm: 'ES256',
      header: {
        alg: 'ES256',
        kid: KEY_ID,
      },
    }
  );

  return token;
}

// Generate and display
try {
  console.log('\n🍎 Apple Client Secret Generator\n');
  console.log('Configuration:');
  console.log(`  Team ID: ${TEAM_ID}`);
  console.log(`  Key ID: ${KEY_ID}`);
  console.log(`  Client ID: ${CLIENT_ID}`);
  console.log(`  Expiration: 180 days (${new Date(Date.now() + 86400 * 180 * 1000).toLocaleDateString()})\n`);

  const clientSecret = generateClientSecret();
  
  console.log('✅ Client Secret Generated Successfully!\n');
  console.log('Copy this value to your .env file as APPLE_CLIENT_SECRET:\n');
  console.log(clientSecret);
  console.log('\n');

} catch (error) {
  console.error('❌ Error generating client secret:', error);
  process.exit(1);
}


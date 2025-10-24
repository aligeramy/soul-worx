import { readFileSync } from 'fs';
import { join } from 'path';
import * as crypto from 'crypto';

/**
 * Generate Apple Client Secret JWT
 * Required for Sign in with Apple on web
 */

// Configuration
const TEAM_ID = '23MN72U7PA';
const KEY_ID = 'J79344U4JN';
const CLIENT_ID = 'com.softx.soulworx.web';
const PRIVATE_KEY_PATH = join(process.cwd(), 'AuthKey_J79344U4JN.p8');

function base64UrlEncode(str: Buffer): string {
  return str
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function generateClientSecret(): string {
  // Read private key
  const privateKey = readFileSync(PRIVATE_KEY_PATH, 'utf8');

  // JWT Header
  const header = {
    alg: 'ES256',
    kid: KEY_ID,
    typ: 'JWT'
  };

  // JWT Payload
  const now = Math.floor(Date.now() / 1000);
  const expiration = now + (86400 * 180); // 180 days (6 months - Apple's maximum)

  const payload = {
    iss: TEAM_ID,
    iat: now,
    exp: expiration,
    aud: 'https://appleid.apple.com',
    sub: CLIENT_ID
  };

  // Encode header and payload
  const encodedHeader = base64UrlEncode(Buffer.from(JSON.stringify(header)));
  const encodedPayload = base64UrlEncode(Buffer.from(JSON.stringify(payload)));
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  // Sign with ES256
  const sign = crypto.createSign('SHA256');
  sign.update(signatureInput);
  sign.end();
  
  const signature = sign.sign(privateKey);
  const encodedSignature = base64UrlEncode(signature);

  // Combine to create JWT
  const jwt = `${signatureInput}.${encodedSignature}`;

  return jwt;
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


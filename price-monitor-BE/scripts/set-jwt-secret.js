// Usage: node scripts/set-jwt-secret.js [--print]
// Without --print this writes to .env (creating it if missing). With --print it only prints a generated secret.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

const argv = process.argv.slice(2);
const printOnly = argv.includes('--print');

const secret = crypto.randomBytes(48).toString('hex');
if (printOnly) {
  console.log(secret);
  process.exit(0);
}

const envPath = path.resolve(process.cwd(), '.env');
let env = '';
if (fs.existsSync(envPath)) env = fs.readFileSync(envPath, 'utf8');

function setOrAppend(key, value, current) {
  const re = new RegExp('^' + key + '=.*$', 'm');
  if (re.test(current)) return current.replace(re, key + '=' + value);
  return current + (current && !current.endsWith('\n') ? '\n' : '') + key + '=' + value + '\n';
}

env = setOrAppend('JWT_SECRET', secret, env);
env = setOrAppend('JWT_EXPIRES_IN', '7d', env);
fs.writeFileSync(envPath, env, 'utf8');
console.log('Wrote JWT_SECRET and JWT_EXPIRES_IN to', envPath);
console.log('Secret (also printed here):', secret);

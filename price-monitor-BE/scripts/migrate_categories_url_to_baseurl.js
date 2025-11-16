// Run with: node scripts/migrate_categories_url_to_baseurl.js
// This script will copy `url` -> `baseUrl` for Category documents that
// have `url` defined but not `baseUrl`.

require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../src/models/Category');

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI missing in .env');
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to DB');

  const cursor = Category.find({ url: { $exists: true }, baseUrl: { $exists: false } }).cursor();
  let count = 0;
  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    try {
      doc.baseUrl = doc.url;
      // do not remove url automatically; leave it for audit
      await doc.save();
      count++;
      console.log('Migrated category', doc._id.toString());
    } catch (err) {
      console.error('Failed to migrate', doc._id.toString(), err.message);
    }
  }
  console.log('Migration finished, migrated', count, 'documents');
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });

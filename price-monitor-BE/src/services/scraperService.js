const urlLib = require('url');
const Category = require('../models/Category');
const Product = require('../models/Product');
const PriceHistory = require('../models/PriceHistory');
const emailService = require('./emailService');

let general = null;
try {
  general = require('../scrapers/general');
} catch (e) {
  // If the general scraper isn't present in the workspace, fallback to a stub
  general = null;
}

// Use a single, common scraper for base URLs (remove site-specific code)
function chooseScraper(/* baseUrl */) {
  if (general && typeof general.scrape === 'function') return general;
  return {
    scrape: async () => { throw new Error('No scraper implementation available (missing src/scrapers/general.js)'); }
  };
}

function domainOf(url) {
  try { return new URL(url).origin; } catch { return ''; }
}

async function upsertProduct(category, scraped) {
  // match by url if exists else by title
  let existing = null;
  if (scraped.url) existing = await Product.findOne({ categoryId: category._id, url: scraped.url });
  if (!existing) existing = await Product.findOne({ categoryId: category._id, title: scraped.title });

  if (existing) {
    const old = existing.currentPrice || existing.lastPrice || scraped.price;
    const newp = scraped.price;
    const diff = newp - old;
    const trend = newp < old ? 'DOWN' : (newp > old ? 'UP' : 'SAME');

    existing.lastPrice = existing.currentPrice || existing.lastPrice || newp;
    existing.currentPrice = newp;
    existing.difference = diff;
    existing.trend = trend;
    existing.lastChecked = new Date();
    existing.image = scraped.image || existing.image;
    existing.url = scraped.url || existing.url;
    await existing.save();

    await PriceHistory.create({ productId: existing._id, price: newp });

    // return alert if needed
    if (trend === 'DOWN') return { type: 'drop', oldPrice: old, newPrice: newp, title: scraped.title, url: existing.url || scraped.url };
    if (category.maxPrice && old > category.maxPrice && newp <= category.maxPrice) return { type: 'below_threshold', oldPrice: old, newPrice: newp, title: scraped.title, url: existing.url || scraped.url };
    return null;
  } else {
    const created = await Product.create({
      categoryId: category._id,
      title: scraped.title,
      url: scraped.url || '',
      image: scraped.image || '',
      currentPrice: scraped.price,
      lastPrice: scraped.price,
      difference: 0,
      trend: 'SAME'
    });
    await PriceHistory.create({ productId: created._id, price: scraped.price });
    if (category.maxPrice && scraped.price <= category.maxPrice) return { type: 'below_threshold', oldPrice: null, newPrice: scraped.price, title: scraped.title, url: created.url || scraped.url };
    return null;
  }
}

async function runForCategory(category, user) {
  const scraper = chooseScraper(category.baseUrl);
  const limit = parseInt(process.env.SCRAPE_PAGE_LIMIT || '50');
  let scraped = [];
  try {
    scraped = await scraper.scrape(category.baseUrl, limit);
  } catch (err) {
    return { category: category.label, error: err.message };
  }

  // apply keyword filter if provided
  if (category.keywords && category.keywords.length) {
    const kws = category.keywords.map(k => k.toLowerCase());
    scraped = scraped.filter(p => kws.some(k => p.title.toLowerCase().includes(k)));
  }

  // Normalize relative urls
  const domain = domainOf(category.baseUrl);
  scraped = scraped.map(p => ({ ...p, url: p.url && !p.url.startsWith('http') ? (domain + p.url) : p.url }));

  const alerts = [];
  for (const p of scraped) {
    try {
      const alert = await upsertProduct(category, p);
      if (alert) alerts.push(alert);
    } catch (err) {
      console.error('Upsert product error', err.message);
    }
  }

  // If alerts, send digest to category owner (user.email)
  if (alerts.length) {
    const lines = alerts.map(a => {
      if (a.type === 'drop') return `• ${a.title}\n  Old: ${a.oldPrice}\n  New: ${a.newPrice}\n  Link: ${a.url}\n`;
      return `• ${a.title}\n  Price: ${a.newPrice}\n  Link: ${a.url}\n`;
    }).join('\n');

    const subject = `Price Monitor — ${alerts.length} alert(s) for "${category.label}"`;
    const to = user.email || process.env.EMAIL_USER;
    const text = `Hello ${user.name || ''},\n\nThe following items triggered alerts for tracker "${category.label}":\n\n${lines}\n\n--\nPrice Monitor`;
    try { await emailService.sendEmail({ to, subject, text }); }
    catch (err) { console.error('Email send failed', err.message); }
  }

  return { category: category.label, scraped: scraped.length, alerts: alerts.length };
}

async function runAllActiveScrapers() {
  const categories = await Category.find({ active: true }).populate('userId').lean();
  const summary = [];
  for (const cat of categories) {
    // populate user object because we need email
    const user = cat.userId || {};
    // convert lean cat to object
    const result = await runForCategory(cat, user);
    summary.push(result);
  }
  return summary;
}

module.exports = { runForCategory, runAllActiveScrapers };

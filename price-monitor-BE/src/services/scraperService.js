const urlLib = require('url');
const Category = require('../models/Category');
const Tracker = require('../models/Tracker');
const Product = require('../models/Product');
const PriceHistory = require('../models/PriceHistory');
const Alert = require('../models/Alert');
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

async function upsertProduct(context, scraped) {
  const { category, tracker, user } = context; // one of category or tracker present
  // match by url if exists else by title
  const categoryId = category ? category._id : undefined;
  let existing = null;
  if (scraped.url && categoryId) existing = await Product.findOne({ categoryId, url: scraped.url });
  if (!existing && categoryId) existing = await Product.findOne({ categoryId, title: scraped.title });

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
    const alertsToCreate = [];
    if (trend === 'DOWN') alertsToCreate.push({ type: 'drop', oldPrice: old, newPrice: newp });
    const maxPrice = category ? category.maxPrice : tracker?.maxPrice;
    if (maxPrice && old > maxPrice && newp <= maxPrice) alertsToCreate.push({ type: 'below_threshold', oldPrice: old, newPrice: newp });
    if (alertsToCreate.length) {
      const createdAlerts = [];
      for (const a of alertsToCreate) {
        const doc = await Alert.create({
          userId: user._id || user.id,
          categoryId: category?._id,
          trackerId: tracker?._id,
          productTitle: scraped.title,
          productUrl: existing.url || scraped.url,
          type: a.type,
          oldPrice: a.oldPrice,
          newPrice: a.newPrice
        });
        createdAlerts.push(doc);
      }
      // optionally send immediate email for each alert if enabled
      if (process.env.ALERT_EMAIL_IMMEDIATE === 'true') {
        for (const alert of createdAlerts) {
          try {
            const subject = `Price Monitor Alert — ${alert.productTitle}`;
            const to = user.email || process.env.EMAIL_USER;
            const lines = [];
            if (alert.type === 'drop') {
              lines.push(`Price drop: ${alert.oldPrice} -> ${alert.newPrice}`);
            } else if (alert.type === 'below_threshold') {
              lines.push(`Price now below threshold: ${alert.newPrice}`);
            }
            lines.push(`Link: ${alert.productUrl}`);
            await emailService.sendEmail({ to, subject, text: lines.join('\n') });
            alert.emailedAt = new Date();
            await alert.save();
          } catch (e) { /* swallow individual failures */ }
        }
      }
      return alertsToCreate.map(a => ({ type: a.type, oldPrice: a.oldPrice, newPrice: a.newPrice, title: scraped.title, url: existing.url || scraped.url }));
    }
    return null;
  } else {
    const created = await Product.create({
      categoryId,
      title: scraped.title,
      url: scraped.url || '',
      image: scraped.image || '',
      currentPrice: scraped.price,
      lastPrice: scraped.price,
      difference: 0,
      trend: 'SAME'
    });
    await PriceHistory.create({ productId: created._id, price: scraped.price });
    const maxPrice = category ? category.maxPrice : tracker?.maxPrice;
    if (maxPrice && scraped.price <= maxPrice) {
      const below = await Alert.create({
        userId: user._id || user.id,
        categoryId: category?._id,
        trackerId: tracker?._id,
        productTitle: scraped.title,
        productUrl: created.url || scraped.url,
        type: 'below_threshold',
        newPrice: scraped.price
      });
      if (process.env.ALERT_EMAIL_IMMEDIATE === 'true') {
        try {
          const subject = `Price Monitor Alert — ${below.productTitle}`;
          const to = user.email || process.env.EMAIL_USER;
          const text = `Price now below threshold: ${below.newPrice}\nLink: ${below.productUrl}`;
          await emailService.sendEmail({ to, subject, text });
          below.emailedAt = new Date();
          await below.save();
        } catch (_) {}
      }
      return [{ type: 'below_threshold', oldPrice: null, newPrice: scraped.price, title: scraped.title, url: created.url || scraped.url }];
    }
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
      const alert = await upsertProduct({ category, tracker: null, user }, p);
      if (alert) alerts.push(...(Array.isArray(alert) ? alert : [alert]));
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

async function runForTracker(tracker, user) {
  const scraper = chooseScraper(tracker.baseUrl);
  const limit = parseInt(process.env.SCRAPE_PAGE_LIMIT || '50');
  let scraped = [];
  try {
    scraped = await scraper.scrape(tracker.baseUrl, limit);
  } catch (err) {
    return { tracker: tracker.name, error: err.message };
  }
  if (tracker.keywords && tracker.keywords.length) {
    const kws = tracker.keywords.map(k => k.toLowerCase());
    scraped = scraped.filter(p => kws.some(k => p.title.toLowerCase().includes(k)));
  }
  const domain = domainOf(tracker.baseUrl);
  scraped = scraped.map(p => ({ ...p, url: p.url && !p.url.startsWith('http') ? (domain + p.url) : p.url }));
  const alerts = [];
  for (const p of scraped) {
    try {
      const alert = await upsertProduct({ category: null, tracker, user }, p);
      if (alert) alerts.push(...(Array.isArray(alert) ? alert : [alert]));
    } catch (err) {
      console.error('Upsert product error', err.message);
    }
  }
  if (alerts.length) {
    const lines = alerts.map(a => {
      if (a.type === 'drop') return `• ${a.title}\n  Old: ${a.oldPrice}\n  New: ${a.newPrice}\n  Link: ${a.url}\n`;
      return `• ${a.title}\n  Price: ${a.newPrice}\n  Link: ${a.url}\n`;
    }).join('\n');
    const subject = `Price Monitor — ${alerts.length} alert(s) for tracker "${tracker.name}"`;
    const to = user.email || process.env.EMAIL_USER;
    const text = `Hello ${user.name || ''},\n\nAlerts for tracker "${tracker.name}":\n\n${lines}\n\n--\nPrice Monitor`;
    try { await emailService.sendEmail({ to, subject, text }); }
    catch (err) { console.error('Email send failed', err.message); }
  }
  return { tracker: tracker.name, scraped: scraped.length, alerts: alerts.length };
}

async function runAllActiveScrapers() {
  const categories = await Category.find({ active: true }).populate('userId').lean();
  const trackers = await Tracker.find({ active: true }).populate('userId').lean();
  const summary = [];
  for (const cat of categories) {
    const user = cat.userId || {};
    const result = await runForCategory(cat, user);
    summary.push(result);
  }
  for (const tr of trackers) {
    const user = tr.userId || {};
    const result = await runForTracker(tr, user);
    summary.push(result);
  }
  return summary;
}

module.exports = { runForCategory, runForTracker, runAllActiveScrapers };

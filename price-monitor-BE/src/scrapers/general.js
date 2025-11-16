const axios = require('axios');
const cheerio = require('cheerio');

// A very simple, tolerant scraper that attempts to extract product items from
// a listing page using a few common selectors. It's intentionally defensive —
// it may return an empty array if the page structure is unknown. Frontend can
// still use the API; improve this scraper later for target sites.

async function fetchHtml(url) {
  const res = await axios.get(url, { timeout: 15000, headers: { 'User-Agent': 'Mozilla/5.0' } });
  return res.data;
}

function parsePrice(text) {
  if (!text) return null;
  // remove non-digit, non-dot, non-comma characters
  const cleaned = text.replace(/[^0-9.,-]/g, '').replace(/,/g, '');
  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? num : null;
}

function extractFromElement($, el) {
  const $el = $(el);
  // title
  let title = $el.find('[data-title], .title, .product-title, h2, h3, a').first().text().trim();
  if (!title) title = $el.find('img').attr('alt') || '';
  // url
  let url = $el.find('a').first().attr('href') || '';
  // image
  let image = $el.find('img').first().attr('src') || $el.find('img').first().attr('data-src') || '';
  // price
  const priceText = $el.find('[data-price], .price, .product-price').first().text() || $el.find('.amount').first().text();
  const price = parsePrice(priceText);

  return { title: title || null, price, url: url || null, image: image || null };
}

async function scrape(baseUrl, limit = 50) {
  if (!baseUrl) throw new Error('baseUrl required');
  const html = await fetchHtml(baseUrl);
  const $ = cheerio.load(html);

  // Try a list of selectors that commonly contain product items
  const selectors = [
    '.product',
    '.product-item',
    '.item',
    'article',
    '.search-result-item',
    'li',
    '.grid__item'
  ];

  const items = [];
  for (const sel of selectors) {
    const nodes = $(sel).toArray();
    for (const n of nodes) {
      const data = extractFromElement($, n);
      if (data && data.title && data.price !== null) {
        // normalize url to absolute if necessary — leave relative as-is, caller will normalize
        items.push(data);
        if (items.length >= limit) break;
      }
    }
    if (items.length >= limit) break;
  }

  // Fallback: try links that look like product pages
  if (items.length === 0) {
    const links = $('a[href]').toArray();
    for (const a of links) {
      const $a = $(a);
      const title = $a.text().trim();
      const href = $a.attr('href');
      if (title && href && title.length > 5) {
        items.push({ title, price: null, url: href, image: null });
        if (items.length >= limit) break;
      }
    }
  }

  return items.slice(0, limit);
}

module.exports = { scrape };

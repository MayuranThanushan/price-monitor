const cron = require('node-cron');
const scraperService = require('../services/scraperService');

const CRON = process.env.SCRAPE_CRON || '0 9 * * *';
let running = false;

function start() {
  console.log('Scheduler starting with expression:', CRON);
  cron.schedule(CRON, async () => {
    if (running) { console.log('Previous run still active — skipping'); return; }
    running = true;
    try {
      console.log('Scheduled scrape started at', new Date().toISOString());
      const result = await scraperService.runAllActiveScrapers();
      console.log('Scheduled scrape finished', JSON.stringify(result));
    } catch (err) {
      console.error('Scheduled scrape failed', err);
    } finally {
      running = false;
    }
  }, { timezone: process.env.TIMEZONE || 'Asia/Colombo' });
}

module.exports = { start };

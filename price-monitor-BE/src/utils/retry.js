module.exports = async function retry(fn, attempts = 3, delayMs = 700) {
  let last;
  for (let i = 0; i < attempts; i++) {
    try { return await fn(); } catch (err) { last = err; await new Promise(r => setTimeout(r, delayMs)); }
  }
  throw last;
};

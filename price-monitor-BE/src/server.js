require('dotenv').config();
require('express-async-errors');
const app = require('./app');
const connectDB = require('./config/db');
const scheduler = require('./jobs/scheduler');

const PORT = process.env.PORT || 4000;
(async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  scheduler.start();
})();

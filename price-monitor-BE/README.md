# Price Monitor Backend (MVP)

## Requirements
- Node.js >= 18
- MongoDB Atlas (free tier recommended)

## Setup
1. `git clone <repo>`
2. `cd price-monitor-backend`
3. `cp .env .env` and fill values (MONGODB_URI, EMAIL_*, etc.)
4. `npm install`
5. `npm run dev` (for development with nodemon) or `npm start` (production)

## Endpoints
- `GET /api/categories` - list categories
- `POST /api/categories` - add category { site, label, url, maxPrice, email, active }
- `PUT /api/categories/:id` - update
- `DELETE /api/categories/:id`
- `GET /api/products/:categoryId` - products for category
- `GET /api/history/:productId` - price history (for charts)
- `POST /api/admin/scrape` - manual run; returns summary
- `POST /api/admin/email-test` - test email sending

## Notes
- Default scraper included: Daraz (category/search pages).
- Scheduler runs daily using `SCRAPE_CRON`.
- Extendable: add more scrapers inside `services/scraperService.js`.

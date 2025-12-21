# Price Monitor Frontend

A modern React + Vite + TypeScript frontend for the Price Monitor platform. Track product prices, manage alerts, and monitor card/bank offers with a clean dashboard UI.

## Price Monitor System

Price Monitor is a full-stack web application designed to help users track product prices, receive timely alerts on price drops, and monitor special card or bank offers—all in one unified dashboard. It is ideal for deal hunters, e-commerce enthusiasts, and administrators who want to automate price monitoring and alerting for themselves or their user base.

## What is Price Monitor?

Price Monitor consists of a backend API (Node.js/Express/MongoDB) and a modern frontend (React/Vite/TypeScript). The system continuously scrapes product prices from configured sources, stores historical price data, and notifies users via email when their tracked products hit target prices or when new offers are available. Admins can manage users, seed/reset data, and view system metrics.

## Why Use Price Monitor?

- **Automated Price Tracking:** No more manual checking—get notified instantly when a product drops in price or matches your criteria.
- **Centralized Offer Aggregation:** See all relevant card and bank offers in one place, making it easy to maximize savings.
- **Historical Price Insights:** Visualize price trends over time to make smarter buying decisions.
- **Custom Alerts:** Set your own price thresholds and receive professional, actionable email notifications.
- **Admin Controls:** Manage users, reset passwords, seed demo data, and monitor system health from a secure admin dashboard.
- **Open Source & Extensible:** Built with modern, maintainable technologies—easy to self-host, extend, or integrate with other tools.

## Example Use Cases

- **Personal Deal Tracking:** Users add products they want to monitor and get notified when prices drop or offers appear.
- **E-commerce Analytics:** Admins or power users analyze price history and trends for competitive intelligence.
- **Community Alerts:** Run a public or private instance to provide deal alerts to a group, club, or organization.

---

## Features

## Tech Stack
- React 18, Vite, TypeScript
- Zustand (state), React Query (data fetching)
- Tailwind CSS, Lucide Icons
- Axios (API client)

## Getting Started

### Prerequisites
- Node.js 18+
- Backend API (see `/price-monitor-BE`)

### Installation
```bash
cd price-monitor-FE
npm install
```

### Environment Variables
Create a `.env` file:
```
VITE_API_BASE_URL=http://localhost:4000
```
For production, set `VITE_API_BASE_URL` to your deployed backend (e.g. Railway):
```
VITE_API_BASE_URL=https://pricemonitor-production.up.railway.app
```

### Running Locally
```bash
npm run dev
```

### Building for Production
```bash
npm run build
npm run preview
```

### Deployment
- Deploy to Vercel or Netlify.
- Set `VITE_API_BASE_URL` in your project’s environment variables to point to your backend API root (do not include `/api`).

### Switching Backend Hosts
- At runtime, you can override the API host for testing:
	```js
	localStorage.setItem('pm_api_host', 'http://localhost:4000');
	location.reload();
	```
- Remove override:
	```js
	localStorage.removeItem('pm_api_host');
	location.reload();
	```

## Project Structure
```
price-monitor-FE/
	src/
		api/           # API clients
		assets/        # Images, static assets
		components/    # UI components
		context/       # Zustand stores
		hooks/         # Custom hooks
		pages/         # Route pages
		utils/         # Helpers, constants
		...
```

## API Reference
- See `/src/pages/docs/ApiDocs.tsx` for in-app API documentation.
- Postman collection available in the backend repo.
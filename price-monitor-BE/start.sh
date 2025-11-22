#!/bin/bash
# Move to backend folder
cd "$(dirname "$0")"

# Install dependencies
npm install

# Start the backend
npm run dev

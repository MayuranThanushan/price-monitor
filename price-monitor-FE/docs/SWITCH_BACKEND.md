# Switching Backend Hosts (Local vs Production)

The Axios client (`src/api/axiosClient.ts`) appends `/api` to whichever host it uses. You have three ways to select the backend:

1. Build-time (env file):
   - Development: `.env` -> `VITE_API_BASE_URL=http://localhost:4000`
   - Production: `.env.production` -> `VITE_API_BASE_URL=https://pricemonitor-production.up.railway.app`
   Vite picks the right file automatically on build.

2. Runtime override (no rebuild):
   - Open browser dev tools console and run:
     ```js
     import { overrideApiHost, currentApiHost } from '/src/api/axiosClient';
     overrideApiHost('http://localhost:4000'); // or production host
     currentApiHost();
     ```
   - Or manually set: `localStorage.setItem('pm_api_host', 'http://localhost:4000')` then refresh.
   - Clear override: `localStorage.removeItem('pm_api_host')` then refresh.

3. Automatic fallback:
   - If no env var and no override, it uses `window.location.origin`, else defaults to the production Railway host.

## Adding a UI Toggle (Optional)
Create a simple component allowing switching hosts:
```tsx
import React, { useState } from 'react';
import { overrideApiHost, currentApiHost } from '../../api/axiosClient';

export function BackendSwitcher(){
  const [val, setVal] = useState(currentApiHost().replace(/\/api$/, ''));
  const apply = ()=>{ overrideApiHost(val); window.location.reload(); };
  return (
    <div className='flex gap-2 items-center'>
      <input value={val} onChange={e=>setVal(e.target.value)} className='border rounded px-2 py-1 text-xs'/>
      <button onClick={apply} className='text-xs px-2 py-1 rounded bg-brandGreen text-white'>Switch</button>
    </div>
  );
}
```
Place it on an admin-only settings page if desired.

## Important Notes
- Do not include `/api` in the env host.
- After changing env vars locally, restart Vite (`npm run dev`). On Vercel, set Environment Variables in project settings and redeploy.
- Runtime overrides persist via `localStorage` until removed.

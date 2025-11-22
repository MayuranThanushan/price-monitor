import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuthStore } from '../../context/AuthStore';
import PageContainer from '../../components/ui/PageContainer';
import SectionClean from '../../components/ui/SectionClean';

interface EndpointDef {
  method: string;
  path: string;
  purpose: string;
  notes?: string;
}

const trackerEndpoints: EndpointDef[] = [
  { method: 'GET', path: '/trackers', purpose: 'List trackers' },
  { method: 'POST', path: '/trackers', purpose: 'Create tracker', notes: 'body: { name, baseUrl, categories[], keywords[], maxPrice }' },
  { method: 'PUT', path: '/trackers/:id', purpose: 'Update tracker' },
  { method: 'DELETE', path: '/trackers/:id', purpose: 'Delete tracker' }
];

const offerEndpoints: EndpointDef[] = [
  { method: 'GET', path: '/offers/grouped', purpose: 'List offers grouped by shop' },
  { method: 'GET', path: '/offers/sources', purpose: 'List offer sources' },
  { method: 'POST', path: '/offers/sources', purpose: 'Create offer source' },
  { method: 'PUT', path: '/offers/sources/:id', purpose: 'Update offer source' },
  { method: 'DELETE', path: '/offers/sources/:id', purpose: 'Delete offer source' }
];

const alertEndpoints: EndpointDef[] = [
  { method: 'GET', path: '/alerts', purpose: 'List alerts' },
  { method: 'GET', path: '/alerts?unread=true', purpose: 'List unread alerts' },
  { method: 'POST', path: '/alerts/:id/read', purpose: 'Mark alert read' },
  { method: 'POST', path: '/alerts/mark-all-read', purpose: 'Mark all alerts read' }
];

const statsEndpoints: EndpointDef[] = [
  { method: 'GET', path: '/categories/stats', purpose: 'Category/Tracker aggregated stats' },
  { method: 'GET', path: '/metrics/dashboard', purpose: 'Global dashboard metrics' }
];
const adminEndpoints: EndpointDef[] = [
  { method: 'GET', path: '/admin/users', purpose: 'List all users (admin)' },
  { method: 'DELETE', path: '/admin/users/:id', purpose: 'Delete user (admin)' },
  { method: 'PUT', path: '/admin/users/:id', purpose: 'Update user (admin)' },
  { method: 'POST', path: '/admin/users/:id/reset-password', purpose: 'Reset user password & email temp (admin)' },
  { method: 'POST', path: '/admin/users/reset', purpose: 'Reset & seed users (admin)' },
  { method: 'GET', path: '/admin/alerts', purpose: 'All alerts aggregated (admin)' },
  { method: 'POST', path: '/admin/alerts/resend-latest', purpose: 'Resend latest alert email (admin)' },
  { method: 'GET', path: '/admin/offers', purpose: 'All offers aggregated (admin)' },
  { method: 'GET', path: '/admin/trackers', purpose: 'All trackers aggregated (admin)' },
  { method: 'POST', path: '/admin/scrape', purpose: 'Run all scrapers (admin)' },
  { method: 'POST', path: '/admin/email-test', purpose: 'Send test email (admin)' },
  { method: 'GET', path: '/admin/email-verify', purpose: 'Verify email transport (admin)' },
  { method: 'GET', path: '/admin/endpoints', purpose: 'List endpoint metadata (admin)' }
];

const authEndpoints: EndpointDef[] = [
  { method: 'POST', path: '/auth/register', purpose: 'Register user' },
  { method: 'POST', path: '/auth/login', purpose: 'Authenticate user' },
  { method: 'POST', path: '/auth/forgot-password', purpose: 'Send temporary password to email' }
];

function EndpointTable({ endpoints }: { endpoints: EndpointDef[] }){
  return (
    <div className='overflow-x-auto rounded-lg border border-gray-100 bg-white'>
      <table className='w-full text-left text-sm'>
        <thead className='bg-gray-50 text-xs uppercase text-gray-600'>
          <tr>
            <th className='px-4 py-2'>Method</th>
            <th className='px-4 py-2'>Path</th>
            <th className='px-4 py-2'>Purpose</th>
            <th className='px-4 py-2'>Notes</th>
          </tr>
        </thead>
        <tbody>
          {endpoints.map((e,i)=>(
            <tr key={i} className='border-t border-gray-100'>
              <td className='px-4 py-2 font-medium'><span className={`px-2 py-1 rounded text-xs font-semibold ${e.method==='GET'?'bg-blue-50 text-blue-600': e.method==='POST'?'bg-green-50 text-green-600': e.method==='PUT'?'bg-yellow-50 text-yellow-700':'bg-red-50 text-red-600'}`}>{e.method}</span></td>
              <td className='px-4 py-2 font-mono text-xs'>{e.path}</td>
              <td className='px-4 py-2'>{e.purpose}</td>
              <td className='px-4 py-2 text-gray-500'>{e.notes || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ApiDocs(){
  const { user } = useAuthStore();
  if (user?.role !== 'admin') {
    return (
      <DashboardLayout>
        <PageContainer>
          <SectionClean title='API Documentation' description='Access restricted to administrators.' className='mt-10' />
        </PageContainer>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      <PageContainer>
        <SectionClean title='API Documentation' description='Overview of available backend endpoints grouped by feature areas.' />
        <SectionClean title='Auth' className='mt-10'>
          <EndpointTable endpoints={authEndpoints} />
        </SectionClean>
        <SectionClean title='Trackers' className='mt-10'>
          <EndpointTable endpoints={trackerEndpoints} />
        </SectionClean>
        <SectionClean title='Offers & Sources' className='mt-10'>
          <EndpointTable endpoints={offerEndpoints} />
        </SectionClean>
        <SectionClean title='Alerts' className='mt-10'>
          <EndpointTable endpoints={alertEndpoints} />
        </SectionClean>
        <SectionClean title='Stats & Metrics' className='mt-10'>
          <EndpointTable endpoints={statsEndpoints} />
        </SectionClean>
        <SectionClean title='Admin' className='mt-10'>
          <EndpointTable endpoints={adminEndpoints} />
        </SectionClean>
        <SectionClean title='Environment Variables' className='mt-10' description='Key backend .env settings influencing functionality.'>
          <div className='space-y-4 text-xs text-gray-700'>
            <div>
              <h4 className='font-semibold mb-1'>Core</h4>
              <code className='block bg-gray-100 rounded px-2 py-1'>PORT, MONGODB_URI, NODE_ENV, JWT_SECRET, JWT_EXPIRES_IN</code>
            </div>
            <div>
              <h4 className='font-semibold mb-1'>Email</h4>
              <code className='block bg-gray-100 rounded px-2 py-1'>EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM</code>
              <p className='mt-1'>Use app password for Gmail. Verify config via <code>/api/admin/email-verify</code>.</p>
            </div>
            <div>
              <h4 className='font-semibold mb-1'>Alerts</h4>
              <code className='block bg-gray-100 rounded px-2 py-1'>ALERT_EMAIL_IMMEDIATE=true</code>
              <p className='mt-1'>If true, each new alert triggers an individual email plus digest; sent time stored in <code>alert.emailedAt</code>.</p>
              <p>Resend latest alert email via <code>/api/admin/alerts/resend-latest</code>.</p>
            </div>
            <div>
              <h4 className='font-semibold mb-1'>Scraping</h4>
              <code className='block bg-gray-100 rounded px-2 py-1'>SCRAPE_CRON, SCRAPE_PAGE_LIMIT</code>
              <p className='mt-1'>Adjust schedule and pagination depth; defaults ensure performance safety.</p>
            </div>
            <div>
              <h4 className='font-semibold mb-1'>Time / Logging</h4>
              <code className='block bg-gray-100 rounded px-2 py-1'>TIMEZONE, LOG_LEVEL</code>
              <p className='mt-1'>Requests are appended to <code>logs/access.log</code> with IP or user email.</p>
            </div>
          </div>
        </SectionClean>
        <SectionClean title='Postman Collection' className='mt-10' description='Download or sync the Postman collection for rapid testing.'>
          <div className='space-y-3 text-xs text-gray-600'>
            <p>The collection file is available at: <code className='px-1 py-0.5 rounded bg-gray-100'>/postman/price-monitor.postman_collection.json</code> in the repository root (backend).</p>
            <p>Import steps:
              <ol className='list-decimal ml-4 mt-1 space-y-1'>
                <li>Open Postman &gt; Import &gt; Select File.</li>
                <li>Choose <strong>price-monitor.postman_collection.json</strong>.</li>
                <li>Set environment variable <code>baseUrl</code> if different from default.</li>
                <li>Acquire <code>adminToken</code> and <code>userToken</code> via login requests and paste them into collection variables.</li>
              </ol>
            </p>
            <p>Programmatic endpoint listing available via <code>/api/admin/endpoints</code> (admin only).</p>
          </div>
        </SectionClean>
      </PageContainer>
    </DashboardLayout>
  );
}

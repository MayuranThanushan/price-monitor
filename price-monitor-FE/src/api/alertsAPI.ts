import client from './axiosClient';

export function listAlerts(unread?: boolean){
  const q = unread ? '?unread=true' : '';
  return client.get(`/alerts${q}`);
}

export function markAlertRead(id: string){
  return client.post(`/alerts/${id}/read`);
}

export function markAllAlertsRead(){
  return client.post('/alerts/mark-all-read');
}

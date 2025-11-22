import client from './axiosClient';

export function getDashboardMetrics(){
  return client.get('/metrics/dashboard');
}

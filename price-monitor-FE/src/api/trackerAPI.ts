import client from './axiosClient';

export function listTrackers(){
  return client.get('/trackers');
}

export function createTracker(data: { name: string; baseUrl: string; categories?: string[]; keywords?: string[]; maxPrice?: number }){
  return client.post('/trackers', data);
}

export function updateTracker(id: string, data: Partial<{ name: string; baseUrl: string; categories: string[]; keywords: string[]; maxPrice: number; active: boolean }>) {
  return client.put(`/trackers/${id}`, data);
}

export function deleteTracker(id: string){
  return client.delete(`/trackers/${id}`);
}

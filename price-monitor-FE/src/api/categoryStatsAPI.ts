import client from './axiosClient';

export function getCategoryStats(){
  return client.get('/categories/stats');
}

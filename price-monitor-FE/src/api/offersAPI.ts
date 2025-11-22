import client from './axiosClient';

export function listOffersGrouped(){
  return client.get('/offers/grouped');
}

export function listOfferSources(){
  return client.get('/offers/sources');
}

export function createOfferSource(data: { bank: string; cardType?: 'credit'|'debit'|'both'; active?: boolean; url?: string; urlCredit?: string; urlDebit?: string }){
  return client.post('/offers/sources', data);
}

export function updateOfferSource(id: string, data: Partial<{ bank: string; cardType: 'credit'|'debit'|'both'; url?: string; urlCredit?: string; urlDebit?: string; active: boolean }>) {
  return client.put(`/offers/sources/${id}`, data);
}

export function deleteOfferSource(id: string){
  return client.delete(`/offers/sources/${id}`);
}

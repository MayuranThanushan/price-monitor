import client from './axiosClient'

export function getHealth(){
  return client.get('/health')
}

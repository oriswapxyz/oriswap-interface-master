import { PoolCaculateData } from '../hooks/use-get-poolInfo';
const CACHE_KEY = 'pool-calculate';

export function getLocalCacheOfPoolCaculateByAddress(address: string) {
    const localCache = window.localStorage.getItem(CACHE_KEY)
    let parsedCache: any = {}
    let result: any = {}
    if (localCache) {
      parsedCache = JSON.parse(localCache)
      result = parsedCache[address.toLowerCase()] ? parsedCache[address.toLowerCase()] : {}
    }
    return result
  }
  
export function setLocalCacheOfPoolCaculateByAddress(address:string, data: PoolCaculateData) {
    const localCache = window.localStorage.getItem(CACHE_KEY)
    let parsedCache: any = {}
    if (localCache) {
      parsedCache = JSON.parse(localCache)
    }
    parsedCache[address.toLowerCase()] = data
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(parsedCache))
}


export function getTotalCaculateCache() {
    const localCache = window.localStorage.getItem(CACHE_KEY);
    let res: PoolCaculateData[] = [];
    if (localCache) {
        const parsedCache = JSON.parse(localCache);
        res = Object.values(parsedCache);
    }

    return res
}
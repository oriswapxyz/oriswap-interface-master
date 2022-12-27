const CACHE_KEY = 'rebuy-record-cache';
const BLOCK_NUMBER = 'rebuy-record-block-number';

export function getLocalCacheOfRebuyRecords() {
    const localCache = window.localStorage.getItem(CACHE_KEY)
    let parsedCache: any = [];
    if (localCache) {
      parsedCache = JSON.parse(localCache)
    }
    return parsedCache;
  }
  
export function setLocalCacheOfRebuyRecords(data: any) {
    if (data) {
        window.localStorage.setItem(CACHE_KEY, JSON.stringify(data))
    }
}

export function getLocalCacheOfRebuyRecordsOfBlockNumber() {
  const localCache = window.localStorage.getItem(BLOCK_NUMBER)
  let parsedCache: any = undefined;
  if (localCache) {
    parsedCache = JSON.parse(localCache)
  }
  return parsedCache ? Number(parsedCache) : undefined;
}

export function setLocalCacheOfRebuyRecordsOfBlockNumber(data: any) {
  if (data) {
      window.localStorage.setItem(BLOCK_NUMBER, JSON.stringify(data))
  }
}


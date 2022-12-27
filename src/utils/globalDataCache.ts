const CACHE_KEY = 'global-data';

export function getLocalCacheOfGlobalData() {
    const localCache = window.localStorage.getItem(CACHE_KEY)
    let parsedCache: any = {};
    if (localCache) {
      parsedCache = JSON.parse(localCache)
    }
    return parsedCache;
  }
  
export function setLocalCacheOfGlobalData(data: any) {
    if (data) {
        window.localStorage.setItem(CACHE_KEY, JSON.stringify(data))
    }
}


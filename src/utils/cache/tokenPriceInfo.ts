const CACHE_KEY = 'tokens-price-info';

export function getLocalCacheOfTokensPriceInfo() {
    const localCache = window.localStorage.getItem(CACHE_KEY)
    let parsedCache: any = {};
    if (localCache) {
      parsedCache = JSON.parse(localCache)
    }
    return parsedCache;
  }
  
export function setLocalCacheOfTokensPriceInfo(data: any) {
    if (data) {
        window.localStorage.setItem(CACHE_KEY, JSON.stringify(data))
    }
}

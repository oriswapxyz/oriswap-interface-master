const CACHE_KEY = 'dogeeee-token-info';

export function getLocalCacheOfDogeTokenInfo() {
    const localCache = window.localStorage.getItem(CACHE_KEY)
    let parsedCache: any = {
      price: 0,
      decimals: 8,
    };
    if (localCache) {
      parsedCache = JSON.parse(localCache)
    }
    return parsedCache;
  }
  
export function setLocalCacheOfDogeTokenInfo(data: any) {
    if (data) {
        window.localStorage.setItem(CACHE_KEY, JSON.stringify(data))
    }
}


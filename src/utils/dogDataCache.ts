const CACHE_KEY = 'dog-data';

export function getLocalCacheOfDogData() {
    const localCache = window.localStorage.getItem(CACHE_KEY)
    let parsedCache: any = {
        dogTotalSupply: 0,
        dogDestory: 0,
        dogDestoryAmount: 0,
    };
    if (localCache) {
      parsedCache = JSON.parse(localCache)
    }
    return parsedCache;
  }
  
export function setLocalCacheOfDogData(data: any) {
    if (data) {
        window.localStorage.setItem(CACHE_KEY, JSON.stringify(data))
    }
}


const CACHE_KEY = 'dog-pool-data';

export function getLocalCacheOfDogPoolData() {
    const localCache = window.localStorage.getItem(CACHE_KEY)
    let parsedCache: any = {
        dogePerBlock: 0,
        totalDogeRewards: 0,
        totalDogeRemaining: 0,
    };
    if (localCache) {
      parsedCache = JSON.parse(localCache)
    }
    return parsedCache;
  }
  
export function setLocalCacheOfDogPoolData(data: any) {
    if (data) {
        window.localStorage.setItem(CACHE_KEY, JSON.stringify(data))
    }
}


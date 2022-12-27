const CACHE_KEY = 'platform-tvl';

export function getLocalCacheOfPlatformTvl() {
    const localCache = window.localStorage.getItem(CACHE_KEY) || 0;
    return localCache;
  }
  
export function setLocalCacheOfPlatformTvl(data: any) {
    if (data) {
        window.localStorage.setItem(CACHE_KEY, data || 0)
    }
}


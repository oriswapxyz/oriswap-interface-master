const CACHE_KEY = 'board-data-v2';

export function getLocalCacheOfBoardData() {
    const localCache = window.localStorage.getItem(CACHE_KEY)
    let parsedCache: any = {
      boardAPY: 0,
      boardTVL: 0,
      pools: [],
    };
    if (localCache) {
      parsedCache = JSON.parse(localCache)
    }
    return parsedCache;
  }
  
export function setLocalCacheOfBoardData(data: any) {
    if (data) {
        window.localStorage.setItem(CACHE_KEY, JSON.stringify(data))
    }
}


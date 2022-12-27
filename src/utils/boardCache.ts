const CACHE_KEY = 'board-data';

export function getLocalCacheOfBoardData() {
    const localCache = window.localStorage.getItem(CACHE_KEY)
    let parsedCache: any = {
      boardAPY: 0,
      boardTvl: 0,
      totalPendingRewards: 0,
      rebuyAmount: 0,
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


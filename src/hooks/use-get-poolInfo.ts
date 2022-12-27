/* eslint-disable */
import { useCallback, useEffect, useState, useRef } from 'react';
import { getTokenPrice, getPairPrice } from '../graphql/token-price';
import useGetPidOfPool from './farm/useGetPidOfPool';
import useGetPoolInfo from './farm/useGetPoolInfo';
import { BigNumber } from 'bignumber.js';
import { useTranslation } from 'react-i18next'
import getPoolData from '../graphql/pool';
import { TOKEN, TOKEN_ADDRESS } from '../constants/farm';
import { getLocalCacheOfDogTokenInfo, setLocalCacheOfDogTokenInfo } from '../utils/dogInfoCache';
import { getLocalCacheOfPoolCaculateByAddress, setLocalCacheOfPoolCaculateByAddress, getTotalCaculateCache  } from '../utils/poolCalculateCache';
interface PoolInfo {
    [key: string]: any
};

export interface PoolCaculateData {
    id: string,
    realApy: number,
    realTvl: number,
    token0: string,
    token1?: string,
    tokenName0: string,
    tokenName1?: string,
    apy: string,
    tvl: string,
    address?: number,
    poolType: number,
    allocPoint: number,
    caculated: boolean;
}

export default function useGetPoolInfoWithPairOrTokenPrice(APYConnectedInfo: any, poolContract: any) {
    const { t } = useTranslation();
    const { fetchPid } = useGetPidOfPool(poolContract);
    const { fetchPoolInfo } = useGetPoolInfo(poolContract);
    const [dogInfo, setDogInfo] = useState<any>(getLocalCacheOfDogTokenInfo());
    const [poolData, setPoolData] = useState<any>();
    const [poolInfos, setPoolInfos] = useState<PoolInfo>();
    const [poolCaculateInfo, setPoolCaculateInfo] = useState<PoolCaculateData[]>(getTotalCaculateCache());

    async function getPrice(address: string, isLp: boolean) {
        const func: (address: string) => any = isLp ? getPairPrice : getTokenPrice
        const {price, decimals} = await func(address);
        return {
            price,
            decimals,
        };
    }

    async function getPoolInitData() {
        const res:any = await getPoolData();
        if (res && res.length) {
            let poolInfoData = [];
            for (let i = 0; i < res.length; i++ ) {
                const item = res[i];
                const itemCache = getLocalCacheOfPoolCaculateByAddress(item.id);
                const isLp = item.poolType !== 0;
                let saveItem: PoolCaculateData = {
                    id: item.id,
                    realApy: 0,
                    apy: t('caculating'),
                    tvl: t('caculating'),
                    token0: '',
                    token1: '',
                    tokenName0: '',
                    tokenName1: '',
                    poolType: item.poolType,
                    realTvl: 0,
                    allocPoint: 1,
                    address: 0,
                    ...itemCache,
                    caculated: false,
                }

                if (!isLp) {
                    saveItem.token0 = item.id;
                    saveItem.tokenName0 = item.token ? item.token.symbol : '';
                } else if (item.pair){
                    saveItem.token0 = item.pair.token0.id;
                    saveItem.token1 = item.pair.token1.id;
                    saveItem.tokenName0 = item.pair.token0.symbol;
                    saveItem.tokenName1 = item.pair.token1.symbol;
                }
                poolInfoData.push(saveItem);
                setLocalCacheOfPoolCaculateByAddress(item.id, saveItem);
            }
            setPoolCaculateInfo(poolInfoData);
            setPoolData(res);
        }
    }

    const getPoolInfoByAddress = useCallback(async (address: string, isLp: boolean) => {
        const pid = await fetchPid(address);
        const poolInfo = await fetchPoolInfo(Number(pid));
        const {price, decimals} = await getPrice(address, isLp);
        return {
            pid,
            price,
            decimals,
            ...poolInfo,
        }
    }, [fetchPid, fetchPoolInfo]);

    async function initDataSourceWithPoolInfo() {
      if (poolData.length === 0) return
      let poolInfos: PoolInfo = {}
      let poolInfoData = []
      const dogPrice = dogInfo ? dogInfo.price : 0
      const lp1yEarned = ((24 * 60 * 60) / 3) * (APYConnectedInfo.DOGPerBlock / 1e18) * (APYConnectedInfo.LP_SHARE / 100) * 365
      const single1yEarned = ((24 * 60 * 60) / 3) * (APYConnectedInfo.DOGPerBlock / 1e18) * (APYConnectedInfo.SINGLE_SHARE / 100) * 365
      for (let i = 0; i < poolData.length; i++) {
        const item = poolData[i]
        const isLp = item.poolType !== 0
        const poolInfo = await getPoolInfoByAddress(item.id, isLp)
        if (poolInfo.poolType === '1') {
          poolInfo.earned365 = new BigNumber((poolInfo.allocPoint / APYConnectedInfo.lpAllocPoints) * lp1yEarned)
        } else {
          poolInfo.earned365 = new BigNumber((poolInfo.allocPoint / APYConnectedInfo.singleAllocPoints) * single1yEarned)
        }
        const itemCache = getLocalCacheOfPoolCaculateByAddress(item.id);
        let saveItem: PoolCaculateData = {
          id: item.id,
          realApy: '0',
          apy: t('untracked'),
          tvl: t('untracked'),
          token0: '',
          token1: '',
          tokenName0: '',
          tokenName1: '',
          poolType: item.poolType,
          realTvl: '0',
          allocPoint: 1,
          ...itemCache,
        }

        if (poolInfo && poolInfo.totalAmount && poolInfo.price) {
          const realTvl = new BigNumber(poolInfo.totalAmount)
            .dividedBy(new BigNumber(10).pow(poolInfo.decimals || 18))
            .times(poolInfo.price)
          saveItem.realTvl = realTvl.toNumber()
          saveItem.tvl = `$${realTvl.toFixed(2)}`
        } else {
          saveItem.realTvl = 0;
          saveItem.tvl = '0';
        }

        if (
          poolInfo &&
          dogPrice &&
          poolInfo.earned365 &&
          poolInfo.totalAmount &&
          !(new BigNumber(saveItem.realTvl)).eq(new BigNumber(0))
        ) {
          const apy = (poolInfo.earned365 as BigNumber)
            .times(new BigNumber(dogPrice))
            .dividedBy(saveItem.realTvl)
            .times(100)
          saveItem.realApy = apy.toNumber()
          saveItem.apy = `${apy.toFixed(2)}%`
        } else {
          saveItem.realApy = 0;
          saveItem.apy = '0';
        }

        if (poolInfo && poolInfo.allocPoint) {
          saveItem.allocPoint = poolInfo.allocPoint / 100
        }

        if (!isLp) {
          saveItem.token0 = item.id
          saveItem.address = poolInfo && poolInfo.totalStakedAddress ? Number(poolInfo.totalStakedAddress): 0
          saveItem.tokenName0 = item.token ? item.token.symbol : ''
        } else if (item.pair) {
          saveItem.token0 = item.pair.token0.id
          saveItem.token1 = item.pair.token1.id
          saveItem.tokenName0 = item.pair.token0.symbol
          saveItem.tokenName1 = item.pair.token1.symbol
        }

        saveItem.caculated = true;
        poolInfoData.push(saveItem)
        setLocalCacheOfPoolCaculateByAddress(item.id, saveItem);
        poolInfos[item.id] = poolInfo
      }
      setPoolInfos(poolInfos)
      setPoolCaculateInfo(poolInfoData)
    }

    useEffect(() => {
      if (APYConnectedInfo && poolContract && poolData && poolData.length) {
        initDataSourceWithPoolInfo()
      }
    }, [APYConnectedInfo, poolContract, dogInfo, poolData])

    async function getDogPrice() {
        const info = await getPrice(TOKEN_ADDRESS[TOKEN.DOG], false);

        if (info) {
            setLocalCacheOfDogTokenInfo(info);
            setDogInfo(info);
        }
    }

    const intervalRef = useRef<any>();
    
    function init() {
        getDogPrice();
    }

    useEffect(() => {
        getPoolInitData();
        init();
        if (!intervalRef.current) {
            intervalRef.current = setInterval(init, 30000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
    }, []);

    return {
        poolInfos,
        poolCaculateInfo,
        dogInfo,
    }
}
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useCallback, useState, useMemo } from 'react';
import { getMutiRewardTokenPoolContract } from '../../constants/muti-rewards';
import BigNumber from 'bignumber.js';
import {TOKEN_ADDRESS, TOKEN} from '../../constants/farm';
import {getDogContract}from '../../data/farm';
import useGetBalanceOf from '../contract/useGetBalanceOf';
import {useBlockNumber} from '../../state/application/hooks';
import { getLocalCacheOfBoardData, setLocalCacheOfBoardData } from '../../utils/cache/boardCacheV2';
import useGetTokensPriceInfo from '../../hooks/useGetTokensPriceInfo';

interface PoolInfo {
    decimals: number,
    rewardPerBlock: number,
    rewardToken: string,
    rid: number,
    startBlock: number,
    symbol: string,
    tokenRemaining: number,
}

export enum PoolStatus {
    PENDING = 'PENDING',
    STARTED = 'STARTED',
    ENDED = 'ENDED',
}

interface PoolCaculateInfo extends PoolInfo {
    status: PoolStatus;
    apy: number;
    todayRewardsAmount: number,
    weekPendingRewards: number,
}

export interface UserStakedItem {
    amount: string,
    // 质押时间，unix时间戳
    stakedTime: string,
    // 解锁时间，unix时间戳
    expireTime: string,
    isWithdrawed: boolean;
}

const boardV2Cache = getLocalCacheOfBoardData();
const BigNumberZero = new BigNumber(0);

export default function useGetMutiRewardsTokenPoolContract(
    userAddress: string,
    web3: any,
    chainId?: number,
) {
    const [dogContract, setDogContract] = useState<any>(null);
    const [poolContract, setPoolContract] = useState<any>();
    const [boardAPY, setBoardAPY] = useState<number>(boardV2Cache.boardAPY);
    const [boardTVL, setBoardTVL] = useState<number>(boardV2Cache.boardTVL);
    const { getBalanceOf } = useGetBalanceOf(dogContract);
    const [pools, setPools] = useState<PoolInfo[]>(boardV2Cache.pools);
    const [dogStakedInPool, setDogStakeInPool] = useState(BigNumberZero);
    const [pendingRewards, setPendingRewards] = useState<{
        [key: string]: number
    }>({});

    const connectTokenInfo = useMemo(() => {
        let res: string[] = [];
        if (pools) {
            res = pools.map((item) => item.rewardToken);
        }
        res.push(TOKEN_ADDRESS[TOKEN.DOG]);
        return res;
    }, [pools]);

    const tokenPriceInfo = useGetTokensPriceInfo(connectTokenInfo);

    const currentBlockNumber = useBlockNumber();

    useEffect(() => {
        if (web3 && chainId) {
            const instance = getMutiRewardTokenPoolContract(
                chainId,
                web3,
            );
            const dogInstance = getDogContract(chainId, web3);
            setPoolContract(instance);
            setDogContract(dogInstance);
        }
    }, [web3, chainId]);

    async function getDogStakeInPool() {
        if (!poolContract) return;
        const res = await getBalanceOf(poolContract._address);
        if (res) {
          setDogStakeInPool(new BigNumber(res as number).dividedBy(new BigNumber(10).pow(18)))
        }
    }

    useEffect(() => {
        let interval: any;
        if (poolContract && dogContract) {
          getDogStakeInPool();
          interval = setInterval(() => {
            getDogStakeInPool();
          }, 10000);
        }

        return () => {
          if (interval) {
            clearInterval(interval);
          }
        }
    }, [poolContract, dogContract]);

    async function getTokenReward(rid: number, userAddress: string,  decimals: number) {
        if (!poolContract || !userAddress) return;
        let res = 0;
        try {
             res = await poolContract.methods.pendingRewards(rid, 0, userAddress).call();
        } catch(e) {
            console.error(e);
        }
        return new BigNumber(res).dividedBy(new BigNumber(10).pow(decimals)).toNumber();
    }

    async function getAllTokenRewards() {
        if (!poolContract || !poolCaculateInfo) return;

        for (let i = 0, len = poolCaculateInfo.length; i < len; i = i+1) {
            const pool = poolCaculateInfo[i];
            if (pool.status !== PoolStatus.PENDING) {
                const reward = await getTokenReward(pool.rid, userAddress, pool.decimals);
                pendingRewards[pool.rewardToken] = reward || 0;
            }
        }

        setPendingRewards({
            ...pendingRewards
        })
    }

    const getRewardTokenInfo = useCallback(async () => {
        if (!poolContract) return;
        let res = [];
        try {
             res = await poolContract.methods.getRewardTokenInfo().call();
        } catch(e) {
            console.error('getRewardTokenInfo error')
            console.error(e);
        }
        const pools: PoolInfo[] = [];
        for(let i =0, len = res.length; i < len; i = i + 1) {
            const item = res[i];
            const decimals =  Number(item.decimals);
            const dividedByDecimals = new BigNumber(10).pow(decimals);
            const rewardPerBlock = new BigNumber(item.rewardPerBlock).dividedBy(dividedByDecimals).toNumber() || 0;
            const rewardToken = item.rewardToken;
            const rid = Number(item.rid);
            const startBlock = Number(item.startBlock);
            const symbol = item.symbol;
            const tokenRemaining = new BigNumber(item.tokenRemaining).dividedBy(dividedByDecimals).toNumber() || 0;
            pools.push({
                decimals,
                rewardPerBlock,
                rewardToken,
                rid,
                startBlock,
                symbol,
                tokenRemaining,
            });
        };
        setPools(pools);
    }, [poolContract, dogStakedInPool]);

    

    const poolCaculateInfo: PoolCaculateInfo[] = useMemo(() => {
        if (pools && currentBlockNumber) {
            return pools.map((item) => {
                let status = PoolStatus.PENDING;

                if (item.tokenRemaining === 0 && currentBlockNumber >= item.startBlock) {
                  status = PoolStatus.ENDED
                } else if (currentBlockNumber >= item.startBlock) {
                  status = PoolStatus.STARTED
                }
                
                let apy = 0;
                const dogInfo = tokenPriceInfo[TOKEN_ADDRESS[TOKEN.DOG].toLowerCase()];
                const tokenInfo = tokenPriceInfo[item.rewardToken.toLowerCase()];
                let todayRewardsAmount = 0;
                let weekPendingRewards = 0;
                if (item.rewardPerBlock && tokenInfo && tokenInfo.price) {
                    todayRewardsAmount =  84600 / 3 * item.rewardPerBlock * tokenInfo.price;
                }

                if (item.tokenRemaining && tokenInfo && tokenInfo.price) {
                    weekPendingRewards = item.tokenRemaining * tokenInfo.price;
                }
                if (dogStakedInPool && dogInfo && tokenInfo && tokenInfo.price && item.rewardPerBlock) {
                    const DOGStakedMarket = dogStakedInPool.times(dogInfo.price);
                    if (DOGStakedMarket) {
                        apy = new BigNumber(item.rewardPerBlock)
                        .times(31536000 / 3)
                        .times(tokenInfo.price)
                        .dividedBy(DOGStakedMarket)
                        .times(100).toNumber();
                    }
                }

            
           
 
                return {
                    ...item,
                    status,
                    apy,
                    todayRewardsAmount,
                    weekPendingRewards
                }
            })
        }

        return [];
    }, [pools, currentBlockNumber, dogStakedInPool, tokenPriceInfo]);

    useEffect(() => {
        let interval: any;
        if (poolCaculateInfo && poolContract) {
            getAllTokenRewards();
            interval = setInterval(() => {
                getAllTokenRewards();
            }, 10000)
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        }
    }, [poolContract, poolCaculateInfo]);

    useEffect(() => {
        const dogInfo = tokenPriceInfo[TOKEN_ADDRESS[TOKEN.DOG].toLowerCase()];
        if (dogInfo && dogStakedInPool && poolCaculateInfo) {
            let poolsYearEarning = new BigNumber(0);
            for (let i =0, len = poolCaculateInfo.length; i < len; i = i + 1) {
                const pool = poolCaculateInfo[i];
                const tokenInfo = tokenPriceInfo[pool.rewardToken.toLowerCase()];
                if (pool && pool.status === PoolStatus.STARTED && tokenInfo && pool.rewardPerBlock) {
                    poolsYearEarning = poolsYearEarning.plus(
                        new BigNumber(pool.rewardPerBlock).times(31536000 / 3).times(tokenInfo.price)
                    )
                }
            }
            const DOGStakedMarket = dogStakedInPool.times(dogInfo.price);
            let apy: number;
            if (DOGStakedMarket) {
                apy = poolsYearEarning.dividedBy(DOGStakedMarket).times(100).toNumber() || 0;
                setBoardAPY(apy);
            }
            setBoardTVL(DOGStakedMarket.toNumber());
        }
    }, [dogStakedInPool, tokenPriceInfo, poolCaculateInfo]);

    useEffect(() => {
       let interval: any;
       if (poolContract) {
            getRewardTokenInfo();
            interval = setInterval(() => {
                getRewardTokenInfo();
            }, 10000);
       }

       return () => {
           if (interval) {
               clearInterval(interval);
           }
       }

    }, [poolContract]);

    const getUserLockedInfo = useCallback(
        async (poolNum: number, address: string): Promise<UserStakedItem[]> => {
            if (!poolContract) return [];
            try {
                const res = await poolContract.methods.getUserLockedInfo(poolNum, address).call();
                if (Object.keys(res).length) {
                    const value = Object.values(res);
                    value.reverse()
                    return value as any;
                }
                return [];
            } catch(e) {
                return [];
            }
        },
        [poolContract],
    );

    useEffect(() => {
        setLocalCacheOfBoardData({
          boardAPY,
          boardTVL,
          pools,
        })
      }, [boardAPY, boardTVL, pools]);

    return { 
        poolContract,
        pools: poolCaculateInfo,
        boardAPY,
        boardTVL,
        pendingRewards,
        getUserLockedInfo,
        getAllTokenRewards,
        tokenPriceInfo,
    };
};
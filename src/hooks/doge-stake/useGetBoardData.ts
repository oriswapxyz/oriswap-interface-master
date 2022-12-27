/* eslint-disable react-hooks/exhaustive-deps */
import BigNumber from 'bignumber.js';
import {useEffect, useState, useRef, useMemo} from 'react';
import useGetBalanceOf from '../contract/useGetBalanceOf';
import { DOGE_TOKEN } from '../../constants/doge-stake';
import {TOKEN_ADDRESS, TOKEN} from '../../constants/farm';
import { getTokenPrice } from '../../graphql/token-price';
import {getDogContract}from '../../data/farm';
import { ChainId } from '@uniswap/sdk';
import useGetDogePoolContract from './useGetDogePoolContract';
import {getGlobalData} from '../../graphql/info-data/api';
import { getLocalCacheOfBoardData, setLocalCacheOfBoardData } from '../../utils/boardCache';
import {getLocalCacheOfDogTokenInfo, setLocalCacheOfDogTokenInfo} from '../../utils/dogInfoCache';

const BigNumberZero = new BigNumber(0);

const boardCache = getLocalCacheOfBoardData();
const dogInfoCache = getLocalCacheOfDogTokenInfo();

export default function useGetDogeData({
    web3,
    chainId,
}: {
    web3: any,
    chainId?: ChainId,
}) {
       // doge data
       // 代币合约
       const [dogContract, setDogContract] = useState<any>(null);
      //  const [minerContract, setMinerContract] = useState<any>(null);
       const {
         dogePoolContract,
         dogePerBlock,
         totalDogeRewards,
         totalDogeRemaining,
         getUserLockedInfo,
       } = useGetDogePoolContract(web3, chainId);
       const [dogStakedInDogePool, setDogStakedInDogePool] = useState(BigNumberZero);
       const { getBalanceOf } = useGetBalanceOf(dogContract);
       const [boardTvl, setBoardTvl] = useState<number>(boardCache.boardTvl);
       const [boardAPY, setBoardAPY] = useState<number>(boardCache.boardAPY);
       const [rebuyAmount, setRebuyAmount] = useState<number>(boardCache.rebuyAmount)
       const [totalPendingRewards, setTotalPendingRewards] = useState(boardCache.totalPendingRewards);
       const [dogInfo, setDogInfo] = useState<{
        price: number,
        decimals: number,
      }>(dogInfoCache);
       const [dogeInfo, setDogeInfo] = useState<{
         price: number,
         decimals: number,
       }>();
       const dogeInfoInterval = useRef<any>();
       const dogStakeInterval = useRef<any>();

          // contract init
      useEffect(() => {
        if (web3 && chainId) {
            // const minerContractInstance = getPoolContract(chainId, web3);
            const dogContractInstance = getDogContract(chainId, web3);
            setDogContract(dogContractInstance);
            // setMinerContract(minerContractInstance);
        }
    }, [web3, chainId]);

      async function getDogStake() {
        if (!dogePoolContract) return;
        const res = await getBalanceOf(dogePoolContract._address);
        if (res) {
          setDogStakedInDogePool(new BigNumber(res as number).dividedBy(new BigNumber(10).pow(18)))
        }
      }


      async function getDogPrice() {
        const {price, decimals} = await getTokenPrice(TOKEN_ADDRESS[TOKEN.DOG]);
        setLocalCacheOfDogTokenInfo({
            price,
            decimals,
        })
        setDogInfo({
            price,
            decimals,
        });
      }

      async function getDogePrice() {
        const {price} = await getTokenPrice(DOGE_TOKEN);
        setDogeInfo({
            price,
            decimals: 8,
        });
      }

      async function getGlobalDataFunc() {
        try {
            const res = await getGlobalData();

            if (res.totalVolumeUSD) {
                // 总交易额 与总手续费 待回购手续费
                const totalAmount = new BigNumber(res.totalVolumeUSD);
                const pendingRewards = totalAmount.times(0.0021).toNumber();
                setTotalPendingRewards(pendingRewards);
                setRebuyAmount(totalAmount.times(0.0006).toNumber());
            }


        } catch(e) {
            console.error(e)
        }
     }
     useEffect(() => {
      getGlobalDataFunc();
     }, [])

      useEffect(() => {
        if (dogePoolContract && dogContract && !dogStakeInterval.current) {
          getDogStake();
          dogStakeInterval.current = setInterval(() => {
            getDogStake();
          }, 10000);

        }

        return () => {
          if (dogStakeInterval.current) {
            clearInterval(dogStakeInterval.current);
          }
        }
      }, [dogePoolContract, dogContract]);

      // board apy
      useEffect(() => {
        if (!dogStakedInDogePool.eq(BigNumberZero) && dogePerBlock && dogeInfo && dogInfo) {
          const DOGStakedMarket = dogStakedInDogePool.times(dogInfo.price);
          const apy = (
            (new BigNumber(dogePerBlock)).times(31536000 / 3).times(dogeInfo.price)
            .dividedBy(DOGStakedMarket)
          ).times(100).toNumber();

          setBoardTvl(DOGStakedMarket.toNumber());
          setBoardAPY(apy);
        }

      }, [dogStakedInDogePool, dogInfo, dogeInfo, dogePerBlock]);

      useEffect(() => {
        if (!dogeInfoInterval.current) {
          getDogPrice();
          getDogePrice();
          dogeInfoInterval.current = setInterval(() => {
            getDogPrice();
            getDogePrice();
          }, 10000)
        }

        return () => {
          if(dogeInfoInterval.current) {
            clearInterval(dogeInfoInterval.current);
          }
        }
      }, []);

    const rewardsAmount = useMemo(() => {
      if (totalDogeRewards && dogeInfo) {
        return totalDogeRewards * dogeInfo.price;
      }

      return 0;
    }, [totalDogeRewards, dogeInfo])

    const todayRewardsAmount = useMemo(() => {
      if (dogePerBlock && dogeInfo) {
        return 84600 / 3 * dogePerBlock * dogeInfo.price;
      }

      return 0;
    }, [dogePerBlock, dogeInfo])

    const weekPendingRewards = useMemo(() => {
      if (totalDogeRemaining && dogeInfo) {
        return totalDogeRemaining * dogeInfo.price;
      }

      return 0;
    }, [totalDogeRemaining, dogeInfo]);

    useEffect(() => {
      setLocalCacheOfBoardData({
        boardAPY,
        boardTvl,
        totalPendingRewards,
        rebuyAmount,
      })
    }, [boardAPY, boardTvl, totalPendingRewards, rebuyAmount])

    return {
        dogePoolContract,
        getUserLockedInfo,
        boardAPY,
        boardTvl,
        // 待奖励总金额
        totalPendingRewards,
        // 已奖励金额
        rewardsAmount,
        // 当日奖励金额
        todayRewardsAmount,
        // 本周待奖励金额
        weekPendingRewards,
        rebuyAmount,
        dogPrice: dogInfo.price,
        dogDecimals: dogInfo.decimals,
    }
}
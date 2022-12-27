/* eslint-disable react-hooks/exhaustive-deps */
import BigNumber from 'bignumber.js';
import {useEffect, useState, useRef, useMemo} from 'react';
import useGetDogTotalSupply from '../airdrop/useGetTotalSupply';
import useGetBalanceOf from '../contract/useGetBalanceOf';
import useGetDogBlockReward from '../contract/useGetDogBlockReward';
import {TOKEN_ADDRESS, TOKEN} from '../../constants/farm';
import { getTokenPrice } from '../../graphql/token-price';
import {getDogContract, getPoolContract}from '../../data/farm';
import { ChainId } from '@uniswap/sdk';
import { getLocalCacheOfDogData, setLocalCacheOfDogData } from '../../utils/dogDataCache';
import {getLocalCacheOfDogTokenInfo, setLocalCacheOfDogTokenInfo} from '../../utils/dogInfoCache';

const dogDataCache = getLocalCacheOfDogData();
const dogInfoCache = getLocalCacheOfDogTokenInfo();
export default function useGetDogData({
    web3,
    chainId,
}: {
    web3: any,
    chainId?: ChainId,
}) {
       // doge data
       // 代币合约
       const [dogContract, setDogContract] = useState<any>(null);
       const [minerContract, setMinerContract] = useState<any>(null);
       const [dogTotalSupply, setDogTotalSupply] = useState(dogDataCache.dogTotalSupply);
       const [dogDestory, setDogDestory] = useState(dogDataCache.dogDestory);
       const [dogPerBlock, setDogPerBlock] = useState(dogDataCache.dogPerBlock);
       const { getTotalSupply } = useGetDogTotalSupply(dogContract);
       const { getBalanceOf } = useGetBalanceOf(dogContract);
       const { getDOGBlockReward }  = useGetDogBlockReward(minerContract);
       const [dogInfo, setDogInfo] = useState<{
        price: number,
        decimals: number,
      }>(dogInfoCache);
       const dogContractInterval = useRef<any>();
       const minerContractInterval = useRef<any>();
       const dogeInfoInterval = useRef<any>();

          // contract init
      useEffect(() => {
        if (web3 && chainId) {
            const minerContractInstance = getPoolContract(chainId, web3);
            const dogContractInstance = getDogContract(chainId, web3);
            setDogContract(dogContractInstance);
            setMinerContract(minerContractInstance);
        }
    }, [web3, chainId]);

       async function getTokenTotalSupply() {
        const res = await getTotalSupply();
        if (res) {
          setDogTotalSupply(new BigNumber(res).dividedBy(new BigNumber(10).pow(18)).toNumber())
        }
      }
  
      async function getDogDestory() {
        const res = await getBalanceOf('0xcbEBB6621D94B1D4d9C07E33060C2e5E3ae9A309');
        if (res) {
          setDogDestory(new BigNumber(res as number).dividedBy(new BigNumber(10).pow(18)).toNumber())
        }
      }
  
      async function getDogBlockRewardFunc() {
        const res = await getDOGBlockReward(web3);
        if (res) {
          setDogPerBlock(new BigNumber(res as number).dividedBy(new BigNumber(10).pow(18)).toNumber())
        }
      }

      function getDogContractConnectData() {
            getTokenTotalSupply();
            getDogDestory();
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

      useEffect(() => {
        if (!dogeInfoInterval.current) {
          getDogPrice();
          dogeInfoInterval.current = setInterval(() => {
            getDogPrice();
          }, 10000)
        }

        return () => {
          if(dogeInfoInterval.current) {
            clearInterval(dogeInfoInterval.current);
          }
        }
      }, []);

      useEffect(() => {
        if(dogContract) {
           if (!dogContractInterval.current) {
            getDogContractConnectData();
              dogContractInterval.current = setInterval(() => {
              getDogContractConnectData();
             }, 10000);
           }
        }

        return () => {
          if (dogContractInterval.current) {
            clearInterval(dogContractInterval.current);
          }
        }
    }, [dogContract])

    useEffect(() => {
      if(minerContract) {
        if (!minerContractInterval.current) {
           getDogBlockRewardFunc();
           minerContractInterval.current = setInterval(() => {
           getDogBlockRewardFunc();
          }, 10000);
        }
     }

     return () => {
       if (minerContractInterval.current) {
         clearInterval(minerContractInterval.current);
       }
     }
    }, [minerContract])
    
    const dogDestoryAmount = useMemo(() => {
      if (dogDestory && dogInfo) {
        return dogDestory * dogInfo.price;
      }

      return 0;
    }, [dogDestory, dogInfo]);

    useEffect(() => {
      setLocalCacheOfDogData({
        dogTotalSupply,
        dogDestory,
        dogPerBlock
      })
    }, [dogTotalSupply, dogDestory, dogPerBlock])

    return {
        dogTotalSupply,
        dogDestory,
        dogDestoryAmount,
        dogPerBlock,
        dogContract,
    }
}
/* eslint-disable react-hooks/exhaustive-deps */
import { BigNumber } from 'bignumber.js';
import { useCallback, useEffect, useState, useRef } from 'react';
import {getDogePoolContract} from '../../constants/doge-stake';
import { getLocalCacheOfDogPoolData, setLocalCacheOfDogPoolData } from '../../utils/dogePoolDataCache';

export interface UserStakedItem {
    amount: string,
    // 质押时间，unix时间戳
    stakedTime: string,
    // 解锁时间，unix时间戳
    expireTime: string,
    isWithdrawed: boolean;
}

const dogDataCache = getLocalCacheOfDogPoolData();

const useDogePoolContract = (
    web3: any,
    chainId?: number,
) => {
    const [dogePoolContract, setDogePoolContract] = useState<any>();
    const [dogePerBlock, setDogePerBlock] = useState(dogDataCache.dogePerBlock);
    const [totalDogeRewards, setTotalDogeRewards] = useState(dogDataCache.totalDogeRewards);
    const [totalDogeRemaining, setTotalDogeRemaining] = useState(dogDataCache.totalDogeRemaining);
    const dogeDataIntervalRef = useRef<any>();

    const getDogePerBlock = useCallback(
        async () => {
            if (!dogePoolContract) return;
            try {
                const res = await dogePoolContract.methods.DOGEPerBlock().call();
                return res ? new BigNumber(res as number).dividedBy(new BigNumber(10).pow(8)).toNumber() : 0;
            } catch(e) {
                return 0;
            }
        },
        [dogePoolContract],
    );

    const getTotalDogeRewarded = useCallback(
        async () => {
            if (!dogePoolContract) return;
            try {
                const res = await dogePoolContract.methods.totalDOGERewarded().call();
                return res ? new BigNumber(res as number).dividedBy(new BigNumber(10).pow(8)).toNumber() : 0;
            } catch(e) {
                return 0;
            }
        },
        [dogePoolContract],
    );

    const getTotalDogeRemaining = useCallback(
        async () => {
            if (!dogePoolContract) return;
            try {
                const res = await dogePoolContract.methods.totalDOGERemaining().call();
                return res ? new BigNumber(res as number).dividedBy(new BigNumber(10).pow(8)).toNumber() : 0;
            } catch(e) {
                return 0;
            }
        },
        [dogePoolContract],
    );

    const getUserLockedInfo = useCallback(
        async (poolNum: number, address: string): Promise<UserStakedItem[]> => {
            if (!dogePoolContract) return [];
            try {
                const res = await dogePoolContract.methods.getUserLockedInfo(poolNum, address).call();
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
        [dogePoolContract],
    );
    

    async function getDogePerBlockFunc() {
        const res = await getDogePerBlock();
        if (res) {
            setDogePerBlock(res);
        }
    }

    async function getTotalDogeRewardedFunc() {
        const res = await getTotalDogeRewarded();
        if (res) {
            setTotalDogeRewards(res);
        }
    }

    async function getTotalDogeRemainingFunc() {
        const res = await getTotalDogeRemaining();
        if (res) {
            setTotalDogeRemaining(res);
        }
    }

    function IntervalFunc() {
        getDogePerBlockFunc();
        getTotalDogeRewardedFunc();
        getTotalDogeRemainingFunc();
    }

    useEffect(() => {
        if (!dogeDataIntervalRef.current && dogePoolContract) {
            IntervalFunc()
            dogeDataIntervalRef.current = setInterval(IntervalFunc, 10000);
        }

        return () => {
            if (dogeDataIntervalRef.current) {
                clearInterval(dogeDataIntervalRef.current);
            }
        }
    }, [dogePoolContract]);

    useEffect(() => {
        if (web3 && chainId) {
            const instance = getDogePoolContract(
                chainId,
                web3,
            );
            setDogePoolContract(instance);
        }
    }, [web3, chainId]);

    useEffect(() => {
        setLocalCacheOfDogPoolData({
            dogePerBlock,
            totalDogeRewards,
            totalDogeRemaining,
        })
    }, [dogePerBlock, totalDogeRewards, totalDogeRemaining]);

    return { 
        dogePoolContract,
        getDogePerBlock,
        dogePerBlock,
        totalDogeRewards,
        totalDogeRemaining,
        getUserLockedInfo
    };
};

export default useDogePoolContract;

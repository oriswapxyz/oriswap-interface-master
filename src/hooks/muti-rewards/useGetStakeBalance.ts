/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { getStakedBalance } from '../../data/muti-rewards';

const useGetStakedBalance = (
    pid: number,
    poolContract: any,
    address: string,
    refreshBalance: boolean,
) => {
    const [balance, setBalance] = useState(new BigNumber(0));

    const fetchBalance = useCallback(async () => {
        const balance = await getStakedBalance(poolContract, pid, address);
        setBalance(new BigNumber(balance.amount));
    }, [address, pid, poolContract]);

    useEffect(() => {
        if (address && poolContract) {
            fetchBalance();
        }
    }, [address, pid, setBalance, poolContract, refreshBalance]);

    return balance;
};

export default useGetStakedBalance;

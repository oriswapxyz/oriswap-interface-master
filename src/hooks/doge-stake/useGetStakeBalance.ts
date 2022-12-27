/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { getStakedBalance } from '../../data/doge-stake';

const useGetStakedBalance = (
    pid: number,
    minterContract: any,
    address: string,
    refreshBalance: boolean,
) => {
    const [balance, setBalance] = useState(new BigNumber(0));

    const fetchBalance = useCallback(async () => {
        const balance = await getStakedBalance(minterContract, pid, address);
        setBalance(new BigNumber(balance.amount));
    }, [address, pid, minterContract]);

    useEffect(() => {
        if (address && minterContract) {
            fetchBalance();
        }
    }, [address, pid, setBalance, minterContract, refreshBalance]);

    return balance;
};

export default useGetStakedBalance;

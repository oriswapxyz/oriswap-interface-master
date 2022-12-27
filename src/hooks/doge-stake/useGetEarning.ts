/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState, useRef } from 'react';
import BigNumber from 'bignumber.js';
import { getEarned } from '../../data/doge-stake';

const useEarnings = (
    pid: number,
    minterContract: any,
    address: string,
    refreshBalance: number,
    clickRefresh: boolean,
) => {
    const [balance, setBalance] = useState(new BigNumber(0));
    const intervalRef =  useRef<any>();

    const fetchBalance = useCallback(async () => {
        const balance = await getEarned(minterContract, pid, address);
        setBalance(new BigNumber(balance));
    }, [address, pid, minterContract]);

    useEffect(() => {
        if (address && minterContract) {
            fetchBalance();
            if (!intervalRef.current) {
                intervalRef.current = setInterval(fetchBalance, 5000);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = undefined;
            }
        }
    }, [
        address,
        pid,
        setBalance,
        minterContract,
        refreshBalance,
        clickRefresh,
    ]);

    return balance;
};

export default useEarnings;

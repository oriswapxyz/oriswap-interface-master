/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState, useRef } from 'react';
import BigNumber from 'bignumber.js';
import { getBalanceOfLpToken } from '../../data/farm';

export const useGetLPTokenBalance = (
    lpContract: any,
    address: string,
    refreshBalance: boolean,
) => {
    const [balance, setBalance] = useState(new BigNumber(0));
    const intervalRef = useRef<any>();

    const fetchBalance = useCallback(async () => {
        if (!lpContract || !address) return;
        const balance = await getBalanceOfLpToken(lpContract, address);
        setBalance(new BigNumber(balance));
    }, [lpContract, address]);

    useEffect(() => {
        if (lpContract && address) {
            fetchBalance();
            if (!intervalRef.current) {
                intervalRef.current = setInterval(fetchBalance, 10000);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
    }, [lpContract, address, refreshBalance]);

    return balance;
};

export default useGetLPTokenBalance;

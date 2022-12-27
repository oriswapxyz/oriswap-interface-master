/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState, useRef } from 'react';
import BigNumber from 'bignumber.js';
import { getBalance } from '../../data/muti-rewards';

export const useGetDogBalance = (
    contract: any,
    address: string,
    refreshBalance: number,
) => {
    const [balance, setBalance] = useState(new BigNumber(0));
    const intervalRef = useRef<any>();

    const fetchBalance = useCallback(async () => {
        if (!contract || !address) return;
        const balance = await getBalance(contract, address);
        setBalance(new BigNumber(balance));
    }, [contract, address]);

    useEffect(() => {
        if (contract && address) {
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
    }, [contract, address, refreshBalance]);

    return balance;
};

export default useGetDogBalance;

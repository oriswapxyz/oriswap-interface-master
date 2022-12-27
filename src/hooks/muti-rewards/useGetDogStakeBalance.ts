/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState, useRef } from 'react';
import BigNumber from 'bignumber.js';
import { gerUserInfo } from '../../data/muti-rewards';

const useGetDogStakeBalance = (
    pid: number,
    contract: any,
    address: string,
    refreshBalance: number,
) => {
    const [balance, setBalance] = useState(new BigNumber(0));
    const intervalRef =  useRef<any>();

    const fetchBalance = useCallback(async () => {
        const {
            totalAmount,
        } = await gerUserInfo(contract, pid, address);
        if (totalAmount) {
            setBalance(new BigNumber(totalAmount).dividedBy(new BigNumber(10).pow(18)));
        }
    }, [address, pid, contract]);

    useEffect(() => {
        if (address && contract) {
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
        contract,
        refreshBalance,
    ]);

    return balance;
};

export default useGetDogStakeBalance;

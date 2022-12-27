/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react';
import { unstake } from '../../data/farm';

const useUnstake = (pid: number, address: string, minterContract: any, isSingle: boolean, decimals: number) => {
    const handleUnstake = useCallback(
        async (amount: string) => {
            const txHash = await unstake(
                minterContract,
                pid,
                amount,
                address,
                isSingle,
                decimals,
            );
            return txHash;
        },
        [address, pid, minterContract, decimals],
    );

    return { onUnstake: handleUnstake };
};

export default useUnstake;

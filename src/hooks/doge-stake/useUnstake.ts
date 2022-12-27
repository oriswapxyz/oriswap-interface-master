/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react';
import { unstake } from '../../data/doge-stake';

const useUnstake = (pid: number, address: string, dogePoolContract: any, decimals: number) => {
    const handleUnstake = useCallback(
        async (amount: string, lockId: number = 0) => {
            const txHash = await unstake(
                dogePoolContract,
                pid,
                amount,
                address,
                decimals,
                lockId,
            );
            return txHash;
        },
        [address, pid, dogePoolContract, decimals],
    );

    return { onUnstake: handleUnstake };
};

export default useUnstake;

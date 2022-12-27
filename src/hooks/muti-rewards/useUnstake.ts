/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react';
import { unstake } from '../../data/muti-rewards';

const useUnstake = (pid: number, address: string, poolContract: any, decimals: number) => {
    const handleUnstake = useCallback(
        async (amount: string, lockId: number = 0) => {
            const txHash = await unstake(
                poolContract,
                pid,
                amount,
                address,
                decimals,
                lockId,
            );
            return txHash;
        },
        [address, pid, poolContract, decimals],
    );

    return { onUnstake: handleUnstake };
};

export default useUnstake;

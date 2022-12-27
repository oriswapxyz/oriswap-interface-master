/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react';
import { stake } from '../../data/muti-rewards';

const useStake = (pid: number, address: string, poolContract: any, decimals: number) => {
    const handleStake = useCallback(
        async (amount: string) => {
            const txHash = await stake(
                poolContract,
                pid,
                amount,
                address,
                decimals,
            );
            return txHash;
        },
        [address, pid, poolContract, decimals],
    );

    return { onStake: handleStake };
};

export default useStake;

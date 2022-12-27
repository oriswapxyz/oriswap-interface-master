/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react';
import { stake } from '../../data/doge-stake';

const useStake = (pid: number, address: string, minterContract: any, decimals: number) => {
    const handleStake = useCallback(
        async (amount: string) => {
            const txHash = await stake(
                minterContract,
                pid,
                amount,
                address,
                decimals,
            );
            return txHash;
        },
        [address, pid, minterContract, decimals],
    );

    return { onStake: handleStake };
};

export default useStake;

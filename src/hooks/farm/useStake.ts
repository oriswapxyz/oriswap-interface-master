/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react';
import { stake } from '../../data/farm';

const useStake = (pid: number, address: string, minterContract: any, isSingle: boolean, decimals: number) => {
    const handleStake = useCallback(
        async (amount: string) => {
            const txHash = await stake(
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

    return { onStake: handleStake };
};

export default useStake;

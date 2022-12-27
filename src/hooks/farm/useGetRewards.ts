import { useCallback } from 'react';
import { harvest } from '../../data/farm';

const useGetRewards = (pid: number, address: string, minterContract: any, isSingle: boolean) => {
    const handleReward = useCallback(async () => {
        const txHash = await harvest(minterContract, pid, address, isSingle);
        return txHash;
    }, [address, pid, minterContract, isSingle]);

    return { onReward: handleReward };
};

export default useGetRewards;

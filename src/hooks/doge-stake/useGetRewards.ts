import { useCallback } from 'react';
import { harvest } from '../../data/doge-stake';

const useGetRewards = (pid: number, address: string, minterContract: any) => {
    const handleReward = useCallback(async () => {
        const txHash = await harvest(minterContract, pid, address);
        return txHash;
    }, [address, pid, minterContract]);

    return { onReward: handleReward };
};

export default useGetRewards;

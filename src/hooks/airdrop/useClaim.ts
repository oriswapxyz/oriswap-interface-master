import { useCallback } from 'react';
import { claim as claimData } from '../../data/airdrop';

const useClaim = (airdropContract: any) => {
    const claim = useCallback(
        async (index: number, account: string, receiveAddress: string, amount: string, proof: string[]) => {
            if (!airdropContract) return;
            const res = await claimData(
                airdropContract,
                index,
                account,
                receiveAddress,
                amount,
                proof,
            );
            return res;
        },
        [airdropContract],
    );

    return { claim };
};

export default useClaim;

import { useCallback } from 'react';
import { isClaim } from '../../data/airdrop';

const useIsClaim = (airdropContract: any) => {
    const checkIsclaim = useCallback(
        async (index: number) => {
            if (!airdropContract) return;
            const res = await isClaim(
                airdropContract,
                index,
            );
            return res;
        },
        [airdropContract],
    );

    return { checkIsclaim };
};

export default useIsClaim;

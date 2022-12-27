import { useCallback } from 'react';
import { getTotalSupply as getTotalSupplyFromContract } from '../../data/airdrop';

const useGetTotalSupply = (contract: any) => {
    const getTotalSupply = useCallback(
        async () => {
            if (!contract) return;
            const res: any = await getTotalSupplyFromContract(contract);
            return res;
        },
        [contract],
    );

    return { getTotalSupply };
};

export default useGetTotalSupply;

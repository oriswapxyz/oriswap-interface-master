import { useCallback } from 'react';
import { approveMinterContract } from '../../data/farm';

const useApproveOfLPToken = (
    pairOrTokenContract: any,
    poolContract: any,
    address: string,
) => {
    const handleApprove = useCallback(async () => {
        if (!pairOrTokenContract || !poolContract) {
            return;
        }
        try {
            const tx = await approveMinterContract(
                pairOrTokenContract,
                poolContract._address,
                address,
            );
            return tx;
        } catch (e) {
            return e;
        }
    }, [address, pairOrTokenContract, poolContract]);

    return { onApprove: handleApprove };
};

export default useApproveOfLPToken;

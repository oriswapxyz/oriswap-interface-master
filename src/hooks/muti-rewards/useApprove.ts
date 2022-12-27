import { useCallback } from 'react';
import { approveMinterContract } from '../../data/muti-rewards';

const useApprove = (
    tokenContract: any,
    poolContract: any,
    address: string,
) => {
    const handleApprove = useCallback(async () => {
        if (!tokenContract || !poolContract) {
            return;
        }
        try {
            const tx = await approveMinterContract(
                tokenContract,
                poolContract._address,
                address,
            );
            return tx;
        } catch (e) {
            return e;
        }
    }, [address, tokenContract, poolContract]);

    return { onApprove: handleApprove };
};

export default useApprove;

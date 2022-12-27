/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react';
import { batchWithdraw as batchWithdrawFunc } from '../../data/doge-stake';

const useBatchWithdraw = (pid: number, address: string, minterContract: any) => {
    const batchWithdraw = useCallback(
        async () => {
            const txHash = await batchWithdrawFunc(
                minterContract,
                pid,
                address,
            );
            return txHash;
        },
        [address, pid, minterContract],
    );

    return { batchWithdraw };
};

export default useBatchWithdraw;

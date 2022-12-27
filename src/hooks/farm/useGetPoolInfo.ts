import { useCallback } from 'react';
import { getPoolInfo } from '../../data/farm';

const useGetPoolInfo = (
    minerContract: any,
) => {

    const fetchPoolInfo = useCallback(async (pid : number) => {
        try {
            if (minerContract) {
                const poolInfo = await getPoolInfo(
                    minerContract,
                    pid,
                );
                return poolInfo;
            } else {
                return undefined;
            }
        } catch(e) {
            return undefined;
        }
    }, [minerContract]);

    return {
        fetchPoolInfo,
    };

};

export default useGetPoolInfo;

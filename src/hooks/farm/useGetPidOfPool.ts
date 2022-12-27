import { useCallback } from 'react';
import { getLocalCacheOfAddress, setLocalCacheOfAddress } from 'utils';
import { getPidOfPool } from '../../data/farm';

const useGetPidOfPool = (
    contract: any,
) => {

    const fetchPid = useCallback(async (pairOrTokenAddress : string) => {
        try {
            if (contract && pairOrTokenAddress) {
                const cacheInfo = getLocalCacheOfAddress(pairOrTokenAddress)
                if (cacheInfo.pid) {
                  return cacheInfo.pid
                }
                const pid = await getPidOfPool(contract, pairOrTokenAddress)
                cacheInfo.pid = pid
                setLocalCacheOfAddress(pairOrTokenAddress, cacheInfo)
                return pid
                
            } else {
                return undefined;
            }
        } catch(e) {
            return undefined;
        }
    }, [contract]);

    return {
        fetchPid,
    };
};

export default useGetPidOfPool;

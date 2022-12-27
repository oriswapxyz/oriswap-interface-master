/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';
import { getLocalCacheOfAddress, setLocalCacheOfAddress } from 'utils';
import { getDecimalsOfToken } from '../../data/farm';

const useGetDecimalsOfToken = (
    contract: any,
    isSingle: boolean,
) => {
    const [decimals, setDecimals] = useState(18);

    const fetchDecimals = useCallback(async () => {
        const address = contract._address
        const cacheInfo = getLocalCacheOfAddress(address)
        if (cacheInfo.decimals) {
          setDecimals(cacheInfo.decimals)
        } else {
            const decimals = await getDecimalsOfToken(contract)
            cacheInfo.decimals = decimals
            setLocalCacheOfAddress(address, cacheInfo)
            setDecimals(decimals)
        }
    }, [contract]);

    useEffect(() => {
        if (contract && isSingle) {
            fetchDecimals();
        }
    }, [contract, isSingle]);

    return decimals;
};

export default useGetDecimalsOfToken;

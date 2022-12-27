import { BigNumber } from 'bignumber.js';
import { useCallback, useEffect, useState } from 'react';
import { getAPYConnectedMinerInfo } from '../../data/farm';

const useGetAPYConnectedMinerInfo = (
    web3: any,
    minerContract: any,
) => {
    const [info, setInfo] = useState<{
        DOGPerBlock: BigNumber,
        SINGLE_SHARE: BigNumber,
        LP_SHARE: BigNumber,
        singleAllocPoints: BigNumber,
        lpAllocPoints: BigNumber,
    } | undefined>();

    const fetchAPYConnectedInfo = useCallback(async () => {
      const info = await getAPYConnectedMinerInfo(web3, minerContract)
      setInfo(info)
    }, [minerContract, web3])

    useEffect(() => {
      if (minerContract && web3) {
        fetchAPYConnectedInfo()
      }
    }, [minerContract, web3, fetchAPYConnectedInfo])

    return info;
};

export default useGetAPYConnectedMinerInfo;

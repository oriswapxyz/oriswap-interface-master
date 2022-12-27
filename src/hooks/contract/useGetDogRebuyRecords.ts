/* eslint-disable react-hooks/exhaustive-deps */
import BigNumber from 'bignumber.js';
import {useState, useEffect, useCallback} from 'react';
import { 
    getLocalCacheOfRebuyRecords,
    setLocalCacheOfRebuyRecords,
    getLocalCacheOfRebuyRecordsOfBlockNumber,
    setLocalCacheOfRebuyRecordsOfBlockNumber,
} from '../../utils/rebuyRecordsCache';

const rebuyRecordsCache = getLocalCacheOfRebuyRecords();
const fromBlockNumber = getLocalCacheOfRebuyRecordsOfBlockNumber();

interface ReturnValue {
    txHash: string,
    blockNumber: number,
    destoryAmount: string,
}

export default function (contract: any, web3: any) {
    const [data, setData] = useState<ReturnValue[]>(rebuyRecordsCache);
    
    const getRebuyRecords = useCallback(async () => {
        if(!contract || !web3) return ;
        const currentBlockNumber = await web3.eth.getBlockNumber();
        let fromBlock = fromBlockNumber || 3654195;
        let endBlockNumber = fromBlock;
        let res: ReturnValue[] = fromBlockNumber ? data : [];
        while(fromBlock <  currentBlockNumber) {
            const toBlock = currentBlockNumber - fromBlock >= 5000 ? fromBlock + 4999 : currentBlockNumber;
            let tempRes: any[] = []
            try {
                tempRes = await contract.getPastEvents('Transfer', {
                    fromBlock: fromBlock,
                    toBlock: toBlock,
                    filter: {
                        from: '0x6ebcef3db5fbb25f30b3b8bd2cf907340b39ed5d',
                        to: '0xcbEBB6621D94B1D4d9C07E33060C2e5E3ae9A309'
                    }
                });
            } catch(e) {
                console.error(e);
            }

            fromBlock += 5000;

            if (tempRes.length) {
                tempRes = tempRes.map((item: any) => {
                    return {
                        txHash: item.transactionHash,
                        blockNumber: item.blockNumber,
                        destoryAmount: item.returnValues ? new BigNumber(item.returnValues.value).dividedBy(new BigNumber(10).pow(18)).toFixed(2) : '0',
                    }
                }).reverse();
                res = tempRes.concat(res);
            }
        }

        if (res && res.length) {
            endBlockNumber = res[0].blockNumber;
        } 

        setLocalCacheOfRebuyRecords(res)
        setLocalCacheOfRebuyRecordsOfBlockNumber(endBlockNumber + 1);
        setData(res);
    }, [contract, web3, data]);

    useEffect(() => {
        if (contract && web3) {
            getRebuyRecords();
        }
    }, [contract, web3]);

    return { data, getRebuyRecords };
}
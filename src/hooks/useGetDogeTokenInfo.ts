import {useEffect, useState} from 'react';
import {DOGE_TOKEN} from '../constants/doge-stake';
import { getLocalCacheOfDogeTokenInfo, setLocalCacheOfDogeTokenInfo } from '../utils/dogeInfoCache';
import { getTokenPrice } from '../graphql/token-price';

export default function useGetDogeTokenInfo() {
    const [priceInfo, setPriceInfo] = useState<{
        price: number;
        decimals: number;
    }>(getLocalCacheOfDogeTokenInfo());

    async function getPriceInfo() {
        const info = await getTokenPrice(DOGE_TOKEN);
        if (info) {
            setLocalCacheOfDogeTokenInfo(info);
            setPriceInfo(info);
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            getPriceInfo();
        }, 10000);

        return () => {
            clearInterval(interval);
        }
    }, []);

    return priceInfo;
}
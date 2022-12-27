/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState} from 'react';
import { getLocalCacheOfTokensPriceInfo, setLocalCacheOfTokensPriceInfo } from '../utils/cache/tokenPriceInfo';
import { getTokenPrice } from '../graphql/token-price';

export default function useGetTokensPriceInfo(tokens: string[]) {
    const [priceInfos, setPriceInfos] = useState<{
        [key: string]: {
            price: number;
            decimals: number;
        }
    }>(getLocalCacheOfTokensPriceInfo());

    async function getPriceInfo(tokenAddress: string) {
        const info = await getTokenPrice(tokenAddress);
        return info;
    }

    async function getAllTokenPriceInfo() {
        const res: {
            [key: string]: {
                price: number;
                decimals: number;
            }
        } = {};
        for(let i = 0, len = tokens.length; i < len; i++) {
            const tokenPriceInfo = await getPriceInfo(tokens[i]);
            res[tokens[i].toLowerCase()] = tokenPriceInfo;
        }

        setLocalCacheOfTokensPriceInfo(res);
        setPriceInfos(res);
    }

    useEffect(() => {
        if (!tokens || !tokens.length) {
            return;
        }
        getAllTokenPriceInfo();
        const interval = setInterval(() => {
            getAllTokenPriceInfo();
        }, 10000);

        return () => {
            clearInterval(interval);
        }
    }, [tokens]);

    return priceInfos;
}
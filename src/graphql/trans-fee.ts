import { gql } from '@apollo/client';
import { BigNumber } from 'bignumber.js';
import client from './index';

export default function transFee(pair: string, startTime: number, endTime: number) {
    return new Promise((resolve, reject) => {
        client
            .query({
                variables: {
                    pair: pair.toLowerCase(),
                    startTime: startTime - 1,
                    endTime,
                },
                query: gql`
                    query pairHourData($pair: Bytes!, $startTime: Int!, $endTime: Int!) {
                        pairHourDatas(
                            where: {
                                pair: $pair,
                                hourStartUnix_lt: $endTime,
                                hourStartUnix_gt: $startTime
                            }
                            orderBy: hourStartUnix,
                            orderDirection: asc
                        ) {
                            pair {
                                id
                            }
                            hourStartUnix
                            hourlyVolumeUSD
                        }                    
                    }
                `
            })
            .then(res => {
                const {data} = res;
                let totalFee = new BigNumber(0)
                for (let index = 0; index < data.pairHourDatas.length; index++) {
                    const hourData = new BigNumber(data.pairHourDatas[index].hourlyVolumeUSD)
                    const hourFee = hourData.times(0.003)
                    totalFee = totalFee.plus(hourFee)
                }
                resolve(totalFee.toFixed(2))
            })
            .catch(e => {
                console.error(e.message);
                resolve('0.00');
            });
        })
}
import { gql } from '@apollo/client';
import client from './index';

export function getTokenPrice(address: string): Promise<{
    price: number,
    decimals: number
}> {
    return new Promise((resolve, reject) => {
        client
            .query({
                variables: {
                    token: address.toLowerCase(),
                },
                query: gql`
                    query tokenPrice($token: Bytes!) {
                        token(id: $token) {
                            decimals
                            derivedETH
                        }
                        bundle(id: "1") {
                            ethPrice
                        }
                    }
                `,
                fetchPolicy: 'network-only'
            })
            .then(res => {
                const {data} = res;
                let price = 0;
                let decimals = 18;
                if (data.token && data.bundle) {
                    price = data.token.derivedHT * data.bundle.htPrice;
                    decimals = Number(data.token.decimals);
                }

                resolve({
                    price,
                    decimals,
                })
            })
            .catch(e => {
                console.error(e);
                resolve({
                    price: 0,
                    decimals: 18,
                })
            });
        })
}

export function getPairPrice(address: string) {
    return new Promise((resolve, reject) => {
        client
            .query({
                variables: {
                    pair: address.toLowerCase(),
                },
                query: gql`
                query pair($pair: Bytes!) {
                    pair(id: $pair) {
                        reserveUSD
                        totalSupply
                    }
                }
            `
            })
            .then(res => {
                const {data} = res;
                let price = 0;
                if (data.pair) {
                    price = data.pair.reserveUSD / data.pair.totalSupply;
                }
                resolve({
                    price,
                    decimals: 18,
                });
            })
            .catch(e => {
                console.error(e);
                resolve({
                    price: 0,
                    decimals: 18,
                })
            });
        })
}

export function getTokenPriceMockData(address: string) {
    return Promise.resolve({
        price: 12,
        totalSupply: 10000,
    });
}
import { gql } from '@apollo/client';
import {airDropClient} from './index';

export default function checkUserAirdrop(addreess: string) {
    return new Promise((resolve, reject) => {
        airDropClient
            .query({
                variables: {
                    id: addreess.toLowerCase(),
                },
                query: gql`
                    query user($id: ID!) {
                        user(id: $id) {
                            id
                            index
                            amount
                            proof
                        }
                    }
                `
            })
            .then(res => {
                const {data} = res;
                if (data && data.user && data.user.index >=0) {
                    resolve(data.user);
                } else {
                    resolve(null);
                }
            })
            .catch(e => {
                console.error(e);
                resolve(null);
            });
        })
}

export function checkUserAirdropMock(address: string) {
    return Promise.resolve({
        "index": 1,
        "amount": "0x0340aad21b3b700000",
        "proof": [
            "0x574ffd7c9192af27da3f3a8158341cdf64634986905fc603c058d6d1b83d3635",
            "0x7d7a1dd98ac9c98312bb44db53b3f98b269b009a5e39b27dbe05ac1acdebf31b",
            "0x10222b6b9e576fa7a1d831913fc25645d458d738f564826629c7940ea2fbe3a1"
        ]
    })
}
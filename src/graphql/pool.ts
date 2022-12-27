import { gql } from '@apollo/client';
import { client } from './index';

export default function getPools() {
    return new Promise((resolve, reject) => {
        client
            .query({
                query: gql`
                query mintPools { 
                  mintPools {
                    id
                    poolType
                    pair {
                      id
                      token0 {
                        id
                        name
                        symbol
                      }
                      token1 {
                        id
                        name
                        symbol
                      }
                    }
                    token {
                        id
                        name
                        symbol
                    }                  
                    allocPoint
                  }
                }
                `
            })
            .then(res => {
                const {data} = res;
                const mintPools: any = [];
                // TODO: null is represented FEI token due to incorrect operation order
                for (let index = 0; index < data.mintPools.length; index++) {
                  const element = data.mintPools[index];
                  const result = {...element};
                  if (element.poolType === 0 && !element.token) {
                    result.token = {
                      __typename: 'Token',
                      id: '0xeef1324343ca7bf6e743e21dd9e92dfa4efc3a56',
                      name: 'Poly-Peg FEI',
                      symbol: 'FEI'
                    }
                  }
                  mintPools.push(result);
                }
                resolve(mintPools);
            })
            .catch(e => {
                console.error(e);
                resolve(null);
            });
        })
}
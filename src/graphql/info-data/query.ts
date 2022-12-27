/* eslint-disable */
// @ts-nocheck
import { gql } from '@apollo/client';

export const FACTORY_ADDRESS = '0xBE29C8787A032F80B66B1b280F82eCc5870D0aCC'

export const BUNDLE_ID = '1'

export const GET_BLOCK = gql`
  query blocks($timestampFrom: Int!, $timestampTo: Int!) {
    blocks(
      first: 1
      orderBy: timestamp
      orderDirection: asc
      where: { timestamp_gt: $timestampFrom, timestamp_lt: $timestampTo }
    ) {
      id
      number
      timestamp
    }
  }
`

export const GET_BLOCKS = (timestamps) => {
  let queryString = 'query blocks {'
  queryString += timestamps.map((timestamp) => {
    return `t${timestamp}:blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${
      timestamp + 600
    } }) {
        number
      }`
  })
  queryString += '}'
  return gql(queryString)
}

export const GLOBAL_DATA = (block?) => {
  const queryString = ` query uniswapFactories {
        uniswapFactories(
         ${block ? `block: { number: ${block}}` : ``} 
         where: { id: "${FACTORY_ADDRESS}" }) {
          id
          totalVolumeUSD
          totalVolumeETH
          untrackedVolumeUSD
          totalLiquidityUSD
          totalLiquidityETH
          txCount
          pairCount
          userCount
          mintDogTokens
        }
      }`
  return gql(queryString)
}

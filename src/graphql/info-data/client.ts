import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
export const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://graph.oriswap.xyz/subgraphs/name/sun5347/oriswap',
    // uri: 'https://graph.oriswap.co/mainnet/graphql/subgraphs/name/dsp/dogeswap',
    // uri: 'https://graph.dogeswap.com/testnet/graphql/subgraphs/name/dsp/dogeswap',
  }),
  cache: new InMemoryCache(),
  //   shouldBatch: true,
})

export const blockClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://graph.oriswap.xyz/subgraphs/name/blocklytics/ethereum-blocks',
    // uri: 'https://graph.oriswap.co/mainnet/graphql/subgraphs/name/blocklytics/ethereum-blocks',
    // uri: 'https://graph.dogeswap.com/testnet/graphql/subgraphs/name/blocklytics/ethereum-blocks',
  }),
  cache: new InMemoryCache(),
})

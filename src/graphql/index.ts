import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// const uri = process.env.NODE_ENV === 'production' ? 'https://graph.dogeswap.com/mainnet/graphql/dsp/dogeswap' : 'https://graph.dogeswap.com/testnet/graphql/subgraphs/name/dsp/dogeswap';
const uri = 'https://graph.oriswap.xyz/subgraphs/name/sun5347/oriswap';
// const uri = 'https://graph.oriswap.co/mainnet/graphql/subgraphs/name/dsp/dogeswap';
// const uri = 'https://graph.dogeswap.com/testnet/graphql/subgraphs/name/dsp/dogeswap';
export const client = new ApolloClient({
  link: new HttpLink({
    uri: uri,
  }),
  cache: new InMemoryCache(),
  
});

export const airDropClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://graph.oriswap.xyz/airdrop/graphql',
  }),
  cache: new InMemoryCache(),
  
});

export default client;
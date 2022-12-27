import Logo from '../../assets/images/dog-token.png';
import POOLABI from './poolAbi';

const ERC20_ABI = [
    {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [{ "name": "", "type": "string" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        { "name": "_spender", "type": "address" },
        { "name": "_value", "type": "uint256" }
      ],
      "name": "approve",
      "outputs": [{ "name": "", "type": "bool" }],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [{ "name": "", "type": "uint256" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        { "name": "_from", "type": "address" },
        { "name": "_to", "type": "address" },
        { "name": "_value", "type": "uint256" }
      ],
      "name": "transferFrom",
      "outputs": [{ "name": "", "type": "bool" }],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [{ "name": "", "type": "uint8" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [{ "name": "_owner", "type": "address" }],
      "name": "balanceOf",
      "outputs": [{ "name": "balance", "type": "uint256" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [{ "name": "", "type": "string" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        { "name": "_to", "type": "address" },
        { "name": "_value", "type": "uint256" }
      ],
      "name": "transfer",
      "outputs": [{ "name": "", "type": "bool" }],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        { "name": "_owner", "type": "address" },
        { "name": "_spender", "type": "address" }
      ],
      "name": "allowance",
      "outputs": [{ "name": "", "type": "uint256" }],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    { "payable": true, "stateMutability": "payable", "type": "fallback" },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "name": "owner", "type": "address" },
        { "indexed": true, "name": "spender", "type": "address" },
        { "indexed": false, "name": "value", "type": "uint256" }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "name": "from", "type": "address" },
        { "indexed": true, "name": "to", "type": "address" },
        { "indexed": false, "name": "value", "type": "uint256" }
      ],
      "name": "Transfer",
      "type": "event"
    }
];

const DOGSWAP_POOL_ABI = POOLABI;
  

export const DOGESWAP_POOL_CONTRACT = {
    256: {
        address: '0x85601937cd33893161DD03D34b6Da544F0E43543',
        abi: DOGSWAP_POOL_ABI,
    },
    128: {
        address: '0xfF58c937343d4fCF65c9c1AAF25f49559D95488E',
        abi: DOGSWAP_POOL_ABI,
    },
    513100: {
        address: '0x6f288c73b18f81a4F838B70499b24C6C853bA978',
        abi: DOGSWAP_POOL_ABI,
    },
};

export const DOG_CONTRACT = {
    256: {
        address: '0xB4BB4cE6330Ef2D5Dc0e6104627ea997228Ca046',
        abi: ERC20_ABI,
    },
    128: {
        address: '0x099626783842d35C221E5d01694C2B928eB3B0AD',
        abi: ERC20_ABI,
    },
    513100: {
        address: '0x5342F2CEE30ca8a8D1a971C375a3B5E73cF2733B',
        abi: ERC20_ABI,
    },
};

export enum TOKEN {
    DOG = 'ORI',
    HT = 'HT',
    HETH = 'HETH'
}

export const TOKEN_IMAGE = {
    [TOKEN.DOG]: Logo,
    [TOKEN.HT]: 'https://www.oriswap.xyz/static/media/ht-logo.0cedb6d7.png',
    [TOKEN.HETH]: 'https://graph.oriswap.xyz/static/images/tokens/0x64ff637fb478863b7468bc97d30a5bf3a428a1fd.png',
}

export const TOKEN_ADDRESS = {
    [TOKEN.DOG]: '0x5342F2CEE30ca8a8D1a971C375a3B5E73cF2733B',
    // test
    // [TOKEN.DOG]: '0xB4BB4cE6330Ef2D5Dc0e6104627ea997228Ca046',
    [TOKEN.HT]: '0xA9e7417c676F70E5a13c919e78FB1097166568C5',
    [TOKEN.HETH]: '0xfeb76ae65c11b363bd452afb4a7ec59925848656',
}

// export const LP_POOLS = [
//     {
//         tokenName: [TOKEN.DOG, TOKEN.HT],
//         tokenImage: [TOKEN_IMAGE[TOKEN.DOG], TOKEN_IMAGE[TOKEN.HT]],
//         tokenAddresses: [TOKEN_ADDRESS[TOKEN.DOG], TOKEN_ADDRESS[TOKEN.HT]],
//         pairAddress: '0x82ea44c9a52c2945b06fa55218e8b0fd5b6fa05c',
//     }
// ];

// export const SINGLE_POOLS = [
//     {
//         tokenName: TOKEN.DOG,
//         tokenImage: TOKEN_IMAGE[TOKEN.DOG],
//         tokenAddress: TOKEN_ADDRESS[TOKEN.DOG],
//     },
//     {
//         tokenName: TOKEN.HETH,
//         tokenImage: TOKEN_IMAGE[TOKEN.HETH],
//         tokenAddress: TOKEN_ADDRESS[TOKEN.HETH],
//     },
// ];

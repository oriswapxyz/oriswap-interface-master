import DOGE_POOL_ABI from '../abis/DOGEPool_ABI.json';
import ERC20ABI from '../abis/erc20.json';

export const DOGE_POOL_CONTRACT = {
    256: {
        address: '0xeae3A86a15FD629a3d31070c853a94bC7e70E006',
        abi: DOGE_POOL_ABI,
    },
    128: {
        address: '0xC48B501b457237d4320f5195D53e3cC631Ed90D2',
        abi: DOGE_POOL_ABI,
    },
    513100: {
        address: '0xB50a71F4F99a780781aa09Af38eEDbCf89933e9B',
        abi: DOGE_POOL_ABI,
    },
};

// 主网地址
export const DOGE_TOKEN = '0xfd031EEf14D49729f5441197701a3c58215E5206';

export const DOGE_CONTRACT = {
    256: {
        address: '0xA35870B9Ef0C2DeE936c8Cc405b060A918d1C8D8',
        abi: ERC20ABI,
    },
    128: {
        address: '0x40280e26a572745b1152a54d1d44f365daa51618',
        abi: ERC20ABI,
    },
    513100: {
        address: DOGE_TOKEN,
        abi: ERC20ABI,
    },
};

export function getDogePoolContract(
    chainId: number,
    web3: any,
) {
    if (!(DOGE_POOL_CONTRACT as any)[chainId]) {
        return;
    }
    const instance = new web3.eth.Contract(
        (DOGE_POOL_CONTRACT as any)[chainId].abi,
        (DOGE_POOL_CONTRACT as any)[chainId].address,
    );
    return instance;
}

export function getDogContract(
    chainId: number,
    web3: any,
) {
    if (!(DOGE_CONTRACT as any)[chainId]) {
        return;
    }
    const instance = new web3.eth.Contract(
        (DOGE_CONTRACT as any)[chainId].abi,
        (DOGE_CONTRACT as any)[chainId].address,
    );
    return instance;
}


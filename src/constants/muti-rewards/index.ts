import MUTI_REWARD_TOKEN_POOL from '../abis/muti-reward-token-pool.json';

export const DOGE_POOL_CONTRACT = {
    256: {
        address: '0x125e6BcF3284dEfCef3F39475E051C6450A6Fa98',
        abi: MUTI_REWARD_TOKEN_POOL,
    },
    128: {
        address: '0x6D9ed5D07D7761d05F05832AB695D233E8FDC3e9',
        abi: MUTI_REWARD_TOKEN_POOL,
    },
    513100: {
        address: '0x38B923ed3A001878cb34af542d142CF3Dacfd25A',
        abi: MUTI_REWARD_TOKEN_POOL,
    },
};


export function getMutiRewardTokenPoolContract(
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


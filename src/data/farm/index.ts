/* eslint-disable */
import { ethers } from 'ethers';
import { BigNumber } from 'bignumber.js';
import {
    DOGESWAP_POOL_CONTRACT,
    DOG_CONTRACT,
} from '../../constants/farm';

export function getPoolContract(chainId: number, web3: any) {
    if (!(DOGESWAP_POOL_CONTRACT as any)[chainId]) {
        return;
    }
    const dogeswapLPContract = new web3.eth.Contract(
        (DOGESWAP_POOL_CONTRACT as any)[chainId].abi,
        (DOGESWAP_POOL_CONTRACT as any)[chainId].address,
    );
    return dogeswapLPContract;
}

export function getDogContract(chainId: number, web3: any) {
    if (!(DOG_CONTRACT as any)[chainId]) {
        return;
    }
    const dogeswapTokenContract = new web3.eth.Contract(
        (DOG_CONTRACT as any)[chainId].abi,
        (DOG_CONTRACT as any)[chainId].address,
    );
    return dogeswapTokenContract;
}

export function getStakedTokenContract(chainId: number, web3: any, tokenAddress: string) {
    if (!(DOG_CONTRACT as any)[chainId]) {
        return;
    }
    const contract = new web3.eth.Contract(
        // 都是erc 20abi
        (DOG_CONTRACT as any)[chainId].abi,
        tokenAddress,
    );
    return contract;
}

export async function getBalanceOfLpToken(
    lpContract: any,
    address: string,
): Promise<any> {
    return new Promise((resolve, reject) => {
        lpContract.methods
            .balanceOf(address)
            .call(
                { from: '0x0000000000000000000000000000000000000000' },
                (err: any, data: any) => {
                    if (err) {
                        reject(err);
                    }

                    resolve(data);
                },
            );
    });
}

export async function getAllowanceOfMinterContract(
    contract: any,
    poolAddress: any,
    account: string,
) {
    try {
        const allowance: string = await contract.methods
            .allowance(account, poolAddress)
            .call();
        return allowance;
    } catch (e) {
        return e.message;
    }
}

export async function approveMinterContract(
    pairOrTokenContract: any,
    poolAddress: any,
    account: string,
) {
    return pairOrTokenContract.methods
        .approve(
            // spender
            poolAddress,
            // amount
            ethers.constants.MaxUint256.toString(),
        )
        .send({ from: account });
}

export async function stake(
    minterContract: any,
    pid: number,
    amount: string,
    address: string,
    isSingle: boolean,
    decimals: number = 18,
): Promise<any> {
    return new Promise(async (resolve, reject) => {
        minterContract.methods
            .deposit(
                pid,
                new BigNumber(amount)
                    .times(new BigNumber(10).pow(decimals))
                    .toFixed(),
            )
            .send({ 
                from: address, 
                value: isSingle ? new BigNumber(1).times(new BigNumber(10).pow(17)).toFixed() : 0
            })
            .on('transactionHash', (tx: any) => {
                resolve(tx.transactionHash);
            })
            .catch((e: any) => {
                reject(e);
            });
    });
}

export async function getEarned(
    minterContract: any,
    pid: number,
    address: string,
): Promise<any> {
    return new Promise((resolve, reject) => {
        minterContract.methods
            .pendingDOG(pid, address)
            .call({}, (err: any, data: any) => {
                if (err) {
                    console.error('getEarned hooks error')
                    reject(err);
                }
                resolve(data);
            });
    });
}

export async function harvest(
    minterContract: any,
    pid: number,
    address: string,
    isSingle: boolean,
): Promise<any> {
    return new Promise((resolve, reject) => {
        minterContract.methods
            .withdraw(pid, '0')
            .send({ from: address, value: isSingle ? new BigNumber(1).times(new BigNumber(10).pow(17)).toFixed() : 0 })
            .on('transactionHash', (tx: any) => {
                resolve(tx.transactionHash);
            })
            .catch((e: any) => {
                reject(e);
            });
    });
}

export async function getStakedBalance(
    minterContract: any,
    pid: number,
    address: string,
): Promise<any> {
    return new Promise((resolve, reject) => {
        minterContract.methods
            .userInfo(pid, address)
            .call({}, (err: any, data: any) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
    });
}

export async function unstake(
    minterContract: any,
    pid: number,
    amount: string,
    address: string,
    isSingle: boolean,
    decimals: number = 18,
): Promise<any> {
    // 单币池子需要加value
    return new Promise((resolve, reject) => {
        minterContract.methods
            .withdraw(
                pid,
                // 收获的第二个参数为0
                new BigNumber(amount)
                    .times(new BigNumber(10).pow(decimals))
                    .toFixed(),
            )
            .send({ 
                from: address, 
                value: isSingle ? new BigNumber(1).times(new BigNumber(10).pow(17)).toFixed() : 0 
            })
            .on('transactionHash', (tx: any) => {
                resolve(tx.transactionHash);
            })
            .catch((e: any) => {
                reject(e);
            });
    });
}

export async function getPidOfPool(
    minterContract: any,
    address: string,
): Promise<any> {
    return new Promise((resolve, reject) => {
        minterContract.methods.pidOfPool(address).call({}, (err: any, data: any) => {
            if (err) {
                console.error('getPidofPoll hooks error')
                reject(err);
            }
            resolve(data);
        });
    });
}

export async function getDecimalsOfToken(
    contract: any,
): Promise<any> {
    return new Promise((resolve, reject) => {
        contract.methods.decimals().call({}, (err: any, data: any) => {
            if (err) {
                console.error('get decimals hooks error')
                reject(err);
            }
            resolve(data);
        });
    });
}

export async function getPoolInfo(
    minterContract: any,
    pid: number,
){
    try {
        const poolInfo = await minterContract.methods.poolInfo(pid).call();
        // const earned365 = await minterContract.methods.get365EarnedByPid(pid).call();
        return {
            earned365: 0,
            ...poolInfo,
        }
    } catch(e) {
        return undefined;
    }
}


export async function getAPYConnectedMinerInfo(
    web3: any,
    minerContract: any,
){
    try {
        const currentBlock = await web3.eth.getBlockNumber()
        const DOGPerBlock = await minerContract.methods.getDOGBlockReward(currentBlock, currentBlock + 1).call()
        const SINGLE_SHARE: string = await minerContract.methods
            .SINGLE_SHARE()
            .call();
        const LP_SHARE: string = await minerContract.methods
            .LP_SHARE()
            .call();
        const singleAllocPoints: string = await minerContract.methods
        .singleAllocPoints()
        .call();
        const lpAllocPoints: string = await minerContract.methods
        .lpAllocPoints()
        .call();        
        
        return {
            DOGPerBlock: new BigNumber(DOGPerBlock),
            SINGLE_SHARE: new BigNumber(SINGLE_SHARE),
            LP_SHARE: new BigNumber(LP_SHARE),
            singleAllocPoints: new BigNumber(singleAllocPoints),
            lpAllocPoints: new BigNumber(lpAllocPoints),
        };
    } catch (e) {
        return e.message;
    }
}

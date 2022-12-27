import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';

export async function getBalance(
    contract: any,
    address: string,
): Promise<any> {
    return new Promise((resolve, reject) => {
        contract.methods
            .balanceOf(address)
            .call(
                { from: '0x0000000000000000000000000000000000000000' },
                (err: any, data: any) => {
                    if (err) {
                        console.error(err);
                        console.error('get balance error')
                        resolve(0);
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
                // value: new BigNumber(1).times(new BigNumber(10).pow(17)).toFixed(),
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
            .pendingDOGE(pid, address)
            .call({}, (err: any, data: any) => {
                if (err) {
                    console.error('getEarned hooks error')
                    resolve(0)
                }
                resolve(data);
            });
    });
}

export async function harvest(
    minterContract: any,
    pid: number,
    address: string,
): Promise<any> {
    return new Promise((resolve, reject) => {
        minterContract.methods
            .withdraw(pid, 0, 0)
            .send({ from: address})
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
    decimals: number = 18,
    lockId: number,
): Promise<any> {
    return new Promise((resolve, reject) => {
        minterContract.methods
            .withdraw(
                pid,
                new BigNumber(amount)
                    .times(new BigNumber(10).pow(decimals))
                    .toFixed(),
                lockId,
            )
            .send({ 
                from: address, 
                // value: new BigNumber(1).times(new BigNumber(10).pow(17)).toFixed(),
            })
            .on('transactionHash', (tx: any) => {
                resolve(tx.transactionHash);
            })
            .catch((e: any) => {
                reject(e);
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

export async function batchWithdraw(
    minterContract: any,
    pid: number,
    address: string,
    decimals: number = 18,
): Promise<any> {
    return new Promise((resolve, reject) => {
        minterContract.methods
            .batchWithdraw(
                pid,
            )
            .send({ 
                from: address, 
                // value: new BigNumber(1).times(new BigNumber(10).pow(17)).toFixed(),
            })
            .on('transactionHash', (tx: any) => {
                resolve(tx.transactionHash);
            })
            .catch((e: any) => {
                reject(e);
            });
    });
}

export async function gerUserInfo(
    contract: any,
    pid: number,
    address: string,
): Promise<any> {
    return new Promise((resolve, reject) => {
        contract.methods
            .userInfo(pid, address)
            .call({}, (err: any, data: any) => {
                if (err) {
                    console.error('get userinfo hooks error')
                    resolve({
                        totalAmount: undefined,
                    })
                }
                resolve({
                    totalAmount: data ? data.totalAmount : 0,
                });
            });
    });
}
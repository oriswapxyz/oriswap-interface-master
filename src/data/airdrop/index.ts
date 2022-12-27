import { AIRDROP_CONTRACT } from '../../constants/airdrop';

export function getAirdropContract(chainId: number, web3: any) {
    if (!(AIRDROP_CONTRACT as any)[chainId]) {
        return;
    }
    const contract = new web3.eth.Contract(
        (AIRDROP_CONTRACT as any)[chainId].abi,
        (AIRDROP_CONTRACT as any)[chainId].address,
    );
    return contract;
}

export async function isClaim(
    airdropContract: any,
    index: number,
){
    try {
        const res = await airdropContract.methods.isClaimed(index).call();
        return res
    } catch(e) {
        return e.message;
    }
}

export async function claim(
    airdropContract: any,
    index: number,
    account: string,
    receiveAddress: string,
    amount: string,
    proof: string[]
){
    const res = await airdropContract.methods.claim(index, receiveAddress, amount, proof).send({
        from: account,
    });
    return res
}

export async function getTotalSupply(
    contract: any,
){
    try {
        const res = await contract.methods.totalSupply().call();
        return res
    } catch(e) {
        console.error(e);
        return 0;
    }
}
import Web3 from 'web3';

export default function initWeb3(provider: any) {
    const web3: any = new Web3(provider);
    web3.eth.extend({
        methods: [
            {
                name: 'chainId',
                call: 'eth_chainId',
                outputFormatter: web3.utils.hexToNumber,
            },
        ],
    });
    return web3;
}
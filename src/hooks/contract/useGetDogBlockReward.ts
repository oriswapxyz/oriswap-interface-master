import { useCallback } from 'react';

const  useGetDogBlockReward = (contract: any) => {
    const getDOGBlockReward = useCallback(
        async (web3: any) => {
            if (!contract || !web3) return;
            const block = await web3.eth.getBlockNumber();
            return new Promise((resolve, reject) => {
                contract.methods
                    .getDOGBlockReward(block, block + 1)
                    .call(
                        {},
                        (err: any, data: any) => {
                            if (err) {
                                reject(err);
                            }
        
                            resolve(data);
                        },
                    );
            })
        },
        [contract],
    );

    return { getDOGBlockReward };
};

export default  useGetDogBlockReward;

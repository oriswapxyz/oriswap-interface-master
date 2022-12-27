import { useCallback } from 'react';

const useBalanceOf = (contract: any) => {
    const getBalanceOf = useCallback(
        async (address: string) => {
            if (!contract) return;
            return new Promise((resolve, reject) => {
                contract.methods
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
            })
        },
        [contract],
    );

    return { getBalanceOf };
};

export default useBalanceOf;

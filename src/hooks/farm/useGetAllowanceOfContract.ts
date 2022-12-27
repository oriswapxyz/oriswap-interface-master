/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'bignumber.js';
import { getAllowanceOfMinterContract } from '../../data/farm';

const useAllowanceOfMinterContract = (
    contract: any,
    minterContract: any,
    address: string,
    refresh?: boolean,
) => {
    const [allowance, setAllowance] = useState(new BigNumber(0));

    const fetchAllowance = useCallback(async () => {
        const allowance = await getAllowanceOfMinterContract(
            contract,
            minterContract._address,
            address,
        );
        setAllowance(new BigNumber(allowance));
    }, [address, minterContract, contract]);

    useEffect(() => {
        if (address && minterContract && contract) {
            fetchAllowance();
        }
        let refreshInterval = setInterval(fetchAllowance, 10000);
        return () => clearInterval(refreshInterval);
    }, [address, minterContract, contract, refresh]);

    return allowance;
};

export default useAllowanceOfMinterContract;

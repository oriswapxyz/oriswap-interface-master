import BigNumber from 'bignumber.js';
export const getFullDisplayBalance = (
    balance: BigNumber,
    decimals = 18,
    fixed = 3,
) => {
    return balance.dividedBy(new BigNumber(10).pow(decimals)).toFixed(fixed);
};

export const getBalanceNumber = (balance: BigNumber, decimals = 18) => {
    const displayBalance = balance.dividedBy(new BigNumber(10).pow(decimals));
    return displayBalance.toFixed(3);
};
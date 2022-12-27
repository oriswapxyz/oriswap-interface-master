import React from 'react';
import styled from 'styled-components';
import { TYPE } from '../../theme';
import Value from '../../components/Value';
import { useTranslation } from 'react-i18next'
import TokenImage from '../../components/TokenImage';


const Wrapper = styled.div`
    width: 100%;
    box-sizing: border-box;
`;

const Item = styled.div`
    box-sizing: border-box;
    width: 100%;
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #ccc;

    &:last-child {
        border-bottom: 0;
    }
`;

const ItemHead = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-shrink: 0;
`;

interface Props {
    symbol: string;
    tokenAddress: string;
    pendingRewardCount: number;
}

export default function PendingPool({
    symbol,
    tokenAddress,
    pendingRewardCount
}: Props) {
    const { t } = useTranslation();
    return (
        <Wrapper>
            <Item>
                <ItemHead>
                    <TokenImage address={tokenAddress} /> 
                    <TYPE.originBlack marginLeft="1rem" fontWeight={600}>{symbol}</TYPE.originBlack> 
               </ItemHead>
               <div style={{textAlign: 'center'}}>
                    <TYPE.darkGray>{t('pendingRewardsCount')}</TYPE.darkGray>
                    <Value value={pendingRewardCount} decimals={2} />
               </div>
            </Item>
        </Wrapper>
    )
}
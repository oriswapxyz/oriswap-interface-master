import React from 'react';
import styled from 'styled-components';
import { TYPE } from '../../theme';
import Value from '../../components/Value';
import Row from '../../components/Row';
import { useTranslation } from 'react-i18next'
import TokenImage from '../../components/TokenImage';
const RowCenter = styled(Row)`
  justify-content: center;
`;

const EarningWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 1rem;
  margin-top: 1rem;
  border-top: 1px solid #ccc;
  flex-direction: column;
  width: 100%;
`;

const SummaryWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: 1rem;
`;

const SummaryItem = styled.div`
    border-radius: 10px;
    padding: 0.8rem;
    box-sizing: border-box;
    width: 49%;
    background: #F2F2F2;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;

const StakeWrapper = styled.div`
    border-radius: 10px;
    background: ${({theme}) => theme.white};
    /* padding: 1rem; */
    margin-top: 1rem;
`;

const BalanceWrapper = styled.div`
    box-sizing: border-box;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 1rem;
`;

const StyleBalance = styled.div`
    display: inline-block;
    margin-bottom: 1rem;
    color: ${({theme}) => theme.text4};
    > span {
        font-size: 16px;
        color: ${({theme}) => theme.text4};
    }
`;

interface Props {
    totalPendingRewards?: number;
    totalRewards?: number;
    todayRewards: number;
    weekPendingRewards: number;
    symbol: string;
    tokenAddress: string;
    earnings: number;
    tokenPriceInfo?: {
        price: number;
        decimals: number;
    };
}

export default function RewardPoolInfo({
    totalPendingRewards,
    totalRewards,
    todayRewards = 0,
    weekPendingRewards = 0,
    symbol,
    tokenAddress,
    earnings = 0,
    tokenPriceInfo,
}: Props) {
    const { t } = useTranslation();

    return (
        <EarningWrapper>
            {
                totalPendingRewards && totalRewards && (
                    <SummaryWrapper>
                    {
                        totalPendingRewards && (
                            <SummaryItem>
                                <TYPE.darkGray textAlign="center">{t('amountToBeRewarded')}($)</TYPE.darkGray>
                                <TYPE.originBlack fontSize={18}>
                                <Value value={totalPendingRewards} />
                                </TYPE.originBlack>
                            </SummaryItem>
                        )
                    }

                    {
                        totalRewards && (
                            <SummaryItem>
                                <TYPE.darkGray  textAlign="center">{t('rewardedAmount')}($)</TYPE.darkGray>
                                <TYPE.originBlack fontSize={18}>
                                <Value value={todayRewards} />
                                </TYPE.originBlack>
                            </SummaryItem>
                        )
                    }
                    </SummaryWrapper>
                )
            }
            <SummaryWrapper>
            <SummaryItem>
                <TYPE.darkGray textAlign="center">{t('dayOfRewardAmount')}($)</TYPE.darkGray>
                <TYPE.originBlack fontSize={18}>
                <Value value={todayRewards} />
                </TYPE.originBlack>
            </SummaryItem>
            <SummaryItem>
                <TYPE.darkGray textAlign="center">{t('weekOfRewardAmount')}($)</TYPE.darkGray>
                <TYPE.originBlack fontSize={18}>
                <Value value={weekPendingRewards} />
                </TYPE.originBlack>
            </SummaryItem>
            </SummaryWrapper>
            <StakeWrapper>
            <BalanceWrapper className="first">
                <TYPE.originBlack fontSize={18} style={{ marginBottom: '1rem' }}>
                {symbol} {t('earnings')}
                </TYPE.originBlack>
                <RowCenter>
                <TYPE.originBlack fontSize={22} style={{ marginBottom: '0rem' }}>
                    <Value value={earnings} />
                </TYPE.originBlack>
                </RowCenter>
                <RowCenter>
                <StyleBalance>
                    {
                        tokenPriceInfo && tokenPriceInfo.price ? (
                            <>
                                ≈ $ <Value  value={tokenPriceInfo.price * earnings} />
                            </>
                        ): (
                        　<>≈ $ {t("untracked")}</>
                        )
                    }
                    
                </StyleBalance>
                </RowCenter>
                <TokenImage style={{ marginBottom: '1rem' }} address={tokenAddress} />
            </BalanceWrapper>
        </StakeWrapper>
        </EarningWrapper>
    )
}
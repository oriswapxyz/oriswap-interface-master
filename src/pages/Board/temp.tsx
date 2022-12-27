import React from 'react';
import { useTranslation } from 'react-i18next'
import AppBody from '../AppBody';
import styled from 'styled-components';
import { TYPE } from '../../theme';
import Row, { RowBetween } from '../../components/Row';
import { AutoColumn } from '../../components/Column';
import CurrencyLogo from '../../components/CurrencyLogo';
import { ETHER } from '@uniswap/sdk';
import { Repeat } from 'react-feather'

const Card = styled.div`
    position: relative;
    max-width: 420px;
    width: 100%;
    border-radius: 30px;
    padding-top: 1.5rem;
    box-shadow: ${({ theme }) => theme.shadow2};
    background: ${({ theme }) => theme.bg13};
    margin-bottom: 0.6rem;
    overflow: hidden;
`;

const CardTitleWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const CardTitle = styled.div`
    position: relative;
    width: calc(80% - 1.5rem);
    background: ${({ theme }) => theme.bg12};
    height: 3rem;
    display: flex;
    box-sizing: border-box;
    padding-left: 2rem;

    &:after {
        position: absolute;
        left: 100%;
        top: 0rem;
        content: ' ';
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 3rem 1.8rem 0 0;
        border-color: ${({ theme }) => theme.bg12} transparent transparent transparent;
    }
`;

const CardProgress = styled.div`
    width: 4rem;
    height: 1.5rem;
    background: ${({ theme }) => theme.bg8};
    color: ${({ theme }) => theme.white};
    display: flex;
    align-items: center;
    justify-content: center;
`;

const CardBody = styled.div`
    width: 100%;
    padding: 1.5rem;
`;

const CurrencyWrapper = styled.div`
    width: 100%;
    padding: 0.8rem 0;
    border-top: 1px solid ${({ theme }) => theme.borderColor3};
    border-bottom: 1px solid ${({ theme }) => theme.borderColor3};
    margin-top: 0.9rem;
`;

const RowCenter = styled(Row)`
    justify-content: center;
`;

const RepeatIcon = styled(Repeat)`
    margin: 1rem;
    color: ${({ theme }) => theme.bg8};
`;

const CardButton = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 3rem;
    border-radius: 1.5rem;
    font-size: 1rem;
    color: ${({ theme }) => theme.white};
    margin-top: 0.6rem;
`;

const ApyButton = styled(CardButton)`
    background: ${({ theme }) => theme.bg8};
`;

const ApproveButton = styled(CardButton)`
    background: ${({ theme }) => theme.bg12};
`;

const RecordWrapper = styled.div`
    padding: 1.2rem 0;
    border-bottom: 1px solid ${({ theme }) => theme.borderColor3};
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const RecordColumn = styled.div`
    width: 35%;
    overflow: hidden;
`;

const Link = styled(TYPE.blue)`
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
`;

export default function LPMining() {
    const { t } = useTranslation();

    return (
        <AppBody style={{background: 'transparent', boxShadow: 'none'}}>
            <Card>
                <CardTitleWrapper>
                    <CardTitle>
                        <RowBetween>
                            <TYPE.white fontSize={16}>DOG-USDT LP {t('rewards')}</TYPE.white>
                            <TYPE.white fontSize={16}>{t('view')}</TYPE.white>
                        </RowBetween>
                    </CardTitle>
                    <CardProgress>45.35%</CardProgress>
                </CardTitleWrapper>
                <CardBody>
                    <AutoColumn gap="md" justify="center">
                        <RowBetween>
                            <TYPE.black fontSize={16} fontWeight={300}>{t('amountToBeRewarded')}($)</TYPE.black>
                        </RowBetween>
                        <RowBetween>
                            <TYPE.black fontSize={30}>954,487,496.88</TYPE.black>
                        </RowBetween>
                        <RowBetween>
                            <TYPE.black fontSize={16} fontWeight={300}>{t('rewardedAmount')}($)</TYPE.black>
                        </RowBetween>
                        <RowBetween>
                            <TYPE.black fontSize={30}>0.00</TYPE.black>
                        </RowBetween>
                        <RowBetween>
                            <TYPE.black fontSize={16} fontWeight={300}>{t('dayOfRewardAmount')}($)</TYPE.black>
                        </RowBetween>
                        <RowBetween>
                            <TYPE.black fontSize={30}>105,756.89</TYPE.black>
                        </RowBetween>
                        <RowBetween>
                            <TYPE.black fontSize={16} fontWeight={300}>{t('monthOfEstimatedReward')}($)</TYPE.black>
                        </RowBetween>
                        <RowBetween>
                            <TYPE.black fontSize={30}>954,487,496.88</TYPE.black>
                        </RowBetween>
                    </AutoColumn>
                    <CurrencyWrapper>
                        <RowCenter>
                            <CurrencyLogo currency={ETHER} size="2.5rem" />
                        </RowCenter>
                        <RowCenter>
                            <TYPE.black margin="0.9rem 0" fontSize={30}>0.0000</TYPE.black>
                        </RowCenter>
                        <RowCenter>
                            <TYPE.orange fontSize={30}>DOG {t('earned')}(≈$0.00)</TYPE.orange>
                        </RowCenter>
                    </CurrencyWrapper>
                    <CurrencyWrapper style={{borderTop: 'none', marginTop: '0'}}>
                        <RowCenter>
                            <CurrencyLogo currency={ETHER} size="2.5rem" />
                            <RepeatIcon
                                size="30"
                            />
                            <CurrencyLogo currency={ETHER} size="2.5rem" />
                        </RowCenter>
                        <RowCenter>
                            <TYPE.black margin="0.9rem 0" fontSize={30}>0.0000</TYPE.black>
                        </RowCenter>
                        <RowCenter>
                            <TYPE.orange fontSize={30}>DOG {t('earned')}(≈$0.00)</TYPE.orange>
                        </RowCenter>
                    </CurrencyWrapper>
                    <AutoColumn gap="md" justify="center">
                        <RowBetween>
                            <ApyButton>APY:328.15% TVL: $15,488,484.66</ApyButton>
                        </RowBetween>
                        <RowBetween>
                            <ApproveButton>{t('approve')} DOG-USDT LP</ApproveButton>
                        </RowBetween>
                    </AutoColumn>
                </CardBody>
            </Card>
            <Card>
                <CardTitleWrapper>
                    <CardTitle>
                        <RowBetween>
                            <TYPE.white fontSize={16}>DOG {t('rewards')} </TYPE.white>
                            <TYPE.white fontSize={16}>{t('viewRules')}</TYPE.white>
                        </RowBetween>
                    </CardTitle>
                    <CardProgress>45.35%</CardProgress>
                </CardTitleWrapper>
                <CardBody>
                    <AutoColumn gap="md" justify="center">
                        <RowBetween>
                            <TYPE.black fontSize={16} fontWeight={300}>{t('amountToBeRewarded')}($)</TYPE.black>
                        </RowBetween>
                        <RowBetween>
                            <TYPE.black fontSize={30}>954,487,496.88</TYPE.black>
                        </RowBetween>
                        <RowBetween>
                            <TYPE.black fontSize={16} fontWeight={300}>{t('rewardedAmount')}($)</TYPE.black>
                        </RowBetween>
                        <RowBetween>
                            <TYPE.black fontSize={30}>0.00</TYPE.black>
                        </RowBetween>
                        <RowBetween>
                            <TYPE.black fontSize={16} fontWeight={300}>{t('dayOfRewardAmount')}($)</TYPE.black>
                        </RowBetween>
                        <RowBetween>
                            <TYPE.black fontSize={30}>105,756.89</TYPE.black>
                        </RowBetween>
                        <RowBetween>
                            <TYPE.black fontSize={16} fontWeight={300}>{t('monthOfEstimatedReward')}($)</TYPE.black>
                        </RowBetween>
                        <RowBetween>
                            <TYPE.black fontSize={30}>954,487,496.88</TYPE.black>
                        </RowBetween>
                    </AutoColumn>
                    <CurrencyWrapper>
                        <RowCenter>
                            <CurrencyLogo currency={ETHER} size="2.5rem" />
                        </RowCenter>
                        <RowCenter>
                            <TYPE.black margin="0.9rem 0" fontSize={30}>0.0000</TYPE.black>
                        </RowCenter>
                        <RowCenter>
                            <TYPE.orange fontSize={30}>DOG {t('earned')}(≈$0.00)</TYPE.orange>
                        </RowCenter>
                    </CurrencyWrapper>
                    <CurrencyWrapper style={{borderTop: 'none', marginTop: '0'}}>
                        <RowCenter>
                            <CurrencyLogo currency={ETHER} size="2.5rem" />
                        </RowCenter>
                        <RowCenter>
                            <TYPE.black margin="0.9rem 0" fontSize={30}>0.0000</TYPE.black>
                        </RowCenter>
                        <RowCenter>
                            <TYPE.orange fontSize={30}>DOG {t('earned')}(≈$0.00)</TYPE.orange>
                        </RowCenter>
                    </CurrencyWrapper>
                    <AutoColumn gap="md" justify="center">
                        <RowBetween>
                            <ApyButton>APY:328.15% TVL: $15,488,484.66</ApyButton>
                        </RowBetween>
                        <RowBetween>
                            <ApproveButton>{t('approve')} DOG-USDT LP</ApproveButton>
                        </RowBetween>
                    </AutoColumn>
                </CardBody>
            </Card>
            <Card>
                <CardTitleWrapper>
                    <CardTitle>
                        <RowBetween>
                            <TYPE.white fontSize={16}>{t('repurchaseAndDestruction')}</TYPE.white>
                            <TYPE.white fontSize={16}>{t('viewRules')}</TYPE.white>
                        </RowBetween>
                    </CardTitle>
                    <CardProgress>45.35%</CardProgress>
                </CardTitleWrapper>
                <CardBody>
                    <AutoColumn gap="md" justify="center">
                        <RowBetween>
                            <TYPE.black fontSize={16} fontWeight={300}>{t('amountToBeRepurchase')}($)</TYPE.black>
                        </RowBetween>
                        <RowBetween>
                            <TYPE.black fontSize={30}>954,487,496.88</TYPE.black>
                        </RowBetween>
                        <RowBetween>
                            <TYPE.black fontSize={16} fontWeight={300}>{t('totalRepurchaseDestruction')}</TYPE.black>
                        </RowBetween>
                        <RowBetween>
                            <TYPE.black fontSize={30}>0.00</TYPE.black>
                        </RowBetween>
                        <RowBetween>
                            <TYPE.black fontSize={16} fontWeight={300}>{t('72hRepurchaseAveragePrice')}($)</TYPE.black>
                        </RowBetween>
                        <RowBetween>
                            <TYPE.black fontSize={30}>105,756.89</TYPE.black>
                        </RowBetween>
                        <RowBetween>
                            <TYPE.black fontSize={16} fontWeight={300}>{t('totalRepurchase')}($)</TYPE.black>
                        </RowBetween>
                        <RowBetween>
                            <TYPE.black fontSize={30}>954,487,496.88</TYPE.black>
                        </RowBetween>
                        <RowBetween>
                            <TYPE.black fontSize={16} fontWeight={300}>{t('repurchaseRecords')}</TYPE.black>
                        </RowBetween>
                        <RecordWrapper>
                            <RecordColumn style={{width: '50%'}}>
                                <RowBetween>
                                    <Link fontSize={16} fontWeight={300}>0xf4484787815870xf448478781587</Link>
                                </RowBetween>
                                <RowBetween>
                                    <TYPE.black fontSize={16} fontWeight={300}>At block 1544488</TYPE.black>
                                </RowBetween>
                            </RecordColumn>
                            <RecordColumn>
                                <RowBetween>
                                    <TYPE.black fontSize={16} fontWeight={300}>Price:</TYPE.black>
                                    <TYPE.black fontSize={16} fontWeight={300}>$6.158</TYPE.black>
                                </RowBetween>
                                <RowBetween>
                                    <TYPE.black fontSize={16} fontWeight={300}>Amount:</TYPE.black>
                                    <TYPE.black fontSize={16} fontWeight={300}>$6.158</TYPE.black>
                                </RowBetween>
                            </RecordColumn>
                        </RecordWrapper>
                        <RecordWrapper>
                            <RecordColumn style={{width: '50%'}}>
                                <RowBetween>
                                    <Link fontSize={16} fontWeight={300}>0xf4484787815870xf448478781587</Link>
                                </RowBetween>
                                <RowBetween>
                                    <TYPE.black fontSize={16} fontWeight={300}>At block 1544488</TYPE.black>
                                </RowBetween>
                            </RecordColumn>
                            <RecordColumn>
                                <RowBetween>
                                    <TYPE.black fontSize={16} fontWeight={300}>{t('price')}:</TYPE.black>
                                    <TYPE.black fontSize={16} fontWeight={300}>$6.158</TYPE.black>
                                </RowBetween>
                                <RowBetween>
                                    <TYPE.black fontSize={16} fontWeight={300}>{t('amount')}:</TYPE.black>
                                    <TYPE.black fontSize={16} fontWeight={300}>$6.158</TYPE.black>
                                </RowBetween>
                            </RecordColumn>
                        </RecordWrapper>
                    </AutoColumn>
                    <AutoColumn gap="md" justify="center">
                        <RowBetween>
                            <ApyButton>{t('viewMore')}</ApyButton>
                        </RowBetween>
                    </AutoColumn>
                </CardBody>
            </Card>
        </AppBody>
    )
}
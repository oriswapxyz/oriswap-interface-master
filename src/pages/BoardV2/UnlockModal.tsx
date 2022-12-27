import React, {useState, useMemo} from 'react';
import styled from 'styled-components';
import { TYPE } from '../../theme';
import Value from '../../components/Value';
import Modal from '../../components/Modal/v2';
import Row from '../../components/Row';
import { useTranslation } from 'react-i18next';
import {ButtonPrimary, ButtonGray} from '../../components/Button';
import BigNumber from 'bignumber.js';
import moment from 'moment-timezone';

const WarningWrapper = styled.div`
    width: 100%;
    padding-bottom: 1rem;

    border-bottom: 1px solid #ccc;

    p {
        margin-bottom: 0.5rem !important;
        font-weight: bold;
    }
`;

const Warning = styled.div`
    color: rgb(255, 0, 0);
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

const ButtonGroup = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: 1rem;
`;

const CancelButton = styled(ButtonGray)`
    width: 48%;
`;

const ConfirmButton = styled(ButtonPrimary)`
    width: 48%;
`;

interface Props {
    lockDate?: string;
    visible: boolean;
    onClose(): void;
    unlockAmount: BigNumber;
    onConfirm(value: string): Promise<any> | any;
    onError(): void;
}

export default function UnlockAll({
    visible,
    onClose,
    lockDate,
    unlockAmount,
    onConfirm,
    onError,
}: Props) {
    const { t } = useTranslation();
    const [confirming, setConfirming] = useState(false);
    const lockDay = lockDate ? moment(new Date()).diff(moment(Number(lockDate) * 1000),'days') : 0;
    const feeAmount = useMemo(() => {
        if (lockDay <= 10) {
            return 30;
        } else if (lockDay <= 20) {
            return 20;
        } else if (lockDay <= 30) {
            return 10;
        }

        return 0;
    }, [lockDay]); 

    // const lockDay = (new Date().getTime() - Number(lockDate) * 1000) / 1000;

    // const feeAmount = useMemo(() => {
    //     if (lockDay <= 60) {
    //         return 30;
    //     } else if (lockDay <= 120) {
    //         return 20;
    //     } else if (lockDay <= 180) {
    //         return 10;
    //     }

    //     return 0;
    // }, [lockDay]); 

    const unlockAmountNumber = useMemo(() => {
        if (unlockAmount) {
            return unlockAmount.dividedBy(new BigNumber(10).pow(18)).toNumber();
        }

        return 0;
    }, [unlockAmount])

    const handleConfirmClick = async () => {
        setConfirming(true);
        try {
            await onConfirm(unlockAmount.dividedBy(new BigNumber(10).pow(18)).toFixed());
            onClose();
        } catch(e) {
            onError();
        }
        setConfirming(false);
    }

    return (
        <Modal visible={visible} onClose={onClose} hideFooter>
            <WarningWrapper>
                <Warning dangerouslySetInnerHTML={{
                    __html: t('unlockWarning')
                }} />
            </WarningWrapper>
           
            {
                !!feeAmount && (
                    <>
                        <Row marginTop="2rem">
                            <TYPE.black>{t('unlockNoti')}</TYPE.black>
                        </Row>
                        <Row justifyContent="center">
                            <TYPE.black padding="1rem 0">{t('unlockFeeInfo', {
                                day: `${lockDay}`,
                                amount: feeAmount
                            })}</TYPE.black>
                        </Row>
                        <Row justifyContent="center">
                            <TYPE.black width="100%" textAlign="center" fontSize="2rem" >-<Value value={unlockAmountNumber * feeAmount / 100} /></TYPE.black>
                        </Row>
                    </>
                )
            }
            <SummaryWrapper>
                <SummaryItem>
                    <TYPE.darkGray>{t('currentUnlockDogAmount')}($)</TYPE.darkGray>
                    <TYPE.originBlack fontSize={18}>
                    <Value value={unlockAmountNumber} />
                    </TYPE.originBlack>
                </SummaryItem>
                <SummaryItem>
                    <TYPE.darkGray>{t('unlockDogRealOutput')}($)</TYPE.darkGray>
                    <TYPE.originBlack fontSize={18}>
                    <Value value={unlockAmountNumber * (1 - feeAmount / 100)} />
                    </TYPE.originBlack>
                </SummaryItem>
            </SummaryWrapper>
            <ButtonGroup>
                <CancelButton onClick={onClose}>{t('cancel')}</CancelButton>
                <ConfirmButton disabled={confirming} onClick={handleConfirmClick}>{t('unlockConfirm')}</ConfirmButton>
            </ButtonGroup>
        </Modal>
    )
}
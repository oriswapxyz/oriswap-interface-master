import React, { useState, useMemo } from 'react';
import Modal from '../../components/Modal/v2';
import Row, { RowBetween } from '../../components/Row';
import { ButtonPrimary, ButtonGray } from '../../components/Button';
import { useTranslation } from 'react-i18next';
import { Input as NumericalInput } from '../../components/NumericalInput';
import { TYPE } from '../../theme';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';

const RowCenter = styled(Row)`
    justify-content: center;
`;

const RowRight = styled(Row)`
    justify-content: flex-end;
`;

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: ${({ theme }) => theme.bg1};
  border: 2px solid ${({ theme }) => theme.bg2};
  z-index: 1;
`

const InputRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: 0.75rem;
`


const StyledBalanceMax = styled.button`
  height: 28px;
  background-color: ${({ theme }) => theme.primary6};
  border: 1px solid ${({ theme }) => theme.primary6};
  border-radius: 0.5rem;
  font-size: 0.875rem;

  font-weight: 500;
  cursor: pointer;
  margin-right: 0.5rem;
  color: ${({ theme }) => theme.primaryText2};
  :hover {
    border: 1px solid ${({ theme }) => theme.primary2};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary2};
    outline: none;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0.5rem;
  `};
`
interface Props {
    isOpen: boolean;
    onClose(): void;
    max?: BigNumber;
    decimals?: number;
    isDepositModal?: boolean;
    onConfirm(value: string): Promise<any> | any;
    pairOrTokenName: string;
    onError(): void;
}

export default function DepositModal(props: Props) {
    const {
        isOpen,
        onClose,
        isDepositModal,
        max = new BigNumber(0),
        decimals = 18,
        onConfirm,
        pairOrTokenName,
        onError,
    } = props;

    const {t} = useTranslation();
    const [confirming, setConfirming] = useState(false);
    const [inputValue, setInputValue]  = useState<number | string>('');
    const handleConfirmClick = async () => {
        if (inputValue) {
            setConfirming(true);
            try {
                await onConfirm(`${inputValue}`);
                onClose();
                setInputValue('');
            } catch(e) {
                onError();
            }
            setConfirming(false);
        }
    }

    const maxStr = useMemo(() => {
        // round down
        return max.dividedBy(new BigNumber(10).pow(decimals)).toFixed() 
    }, [max, decimals])

    const isExceedLimit = !new BigNumber(inputValue || 0).isLessThanOrEqualTo(maxStr);
    const confirmDisabled = confirming || isExceedLimit || !inputValue || new BigNumber(inputValue).eq(0);
    return (
      <Modal
        visible={isOpen}
        onClose={() => {
          setInputValue('')
          onClose()
        }}
        hideFooter
      >
        <RowCenter>
          <TYPE.black fontSize={30} fontWeight={300}>
            {isDepositModal ? t('deposit') : t('unstaked')} {pairOrTokenName}
          </TYPE.black>
        </RowCenter>
        <RowRight>
          <TYPE.black fontSize={14} fontWeight={300}>
            {t('avaliable')}{maxStr}
          </TYPE.black>
        </RowRight>
        <InputPanel>
          <InputRow>
            <NumericalInput
              value={inputValue}
              className="token-amount-input"
              onUserInput={value => {
                setInputValue(value)
              }}
            />
            <StyledBalanceMax onClick={() => setInputValue(maxStr)}>MAX</StyledBalanceMax>
          </InputRow>
        </InputPanel>
        <RowBetween style={{ marginTop: '2rem' }}>
          <ButtonGray
            style={{ width: '48%' }}
            onClick={() => {
              setInputValue('')
              onClose()
            }}
          >
            {t('cancel')}
          </ButtonGray>
          <ButtonPrimary style={{ width: '48%' }} disabled={confirmDisabled} onClick={handleConfirmClick}>
            {t(isExceedLimit ? 'overMax' : 'confirm')}
          </ButtonPrimary>
        </RowBetween>
      </Modal>
    )
}

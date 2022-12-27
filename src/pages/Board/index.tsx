/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState, useRef, useMemo} from 'react';
import { useTranslation } from 'react-i18next'
import {useHistory} from 'react-router-dom';
import AppBody from '../AppBody';
import styled from 'styled-components';
import { TYPE } from '../../theme';
import { message } from 'antd';
import Row, {RowBetween} from '../../components/Row';
import Value from '../../components/Value';
import { ButtonLight, ButtonPrimary } from '../../components/Button';
import TokenImage from '../../components/TokenImage';
import { useActiveWeb3React } from '../../hooks';
import initWeb3 from '../../hooks/init-web3';
// import useGetDogeTotalSupply from '../../hooks/airdrop/useGetTotalSupply';
import useGetBoardData from '../../hooks/doge-stake/useGetBoardData';
import useAllowanceOfPoolContract from '../../hooks/farm/useGetAllowanceOfContract';
import useGetEarning from '../../hooks/doge-stake/useGetEarning';
import useGetDogBalance from '../../hooks/doge-stake/useGetDogBalance';
import BigNumber from 'bignumber.js';
import { useWalletModalToggle } from '../../state/application/hooks';
import useApprove from '../../hooks/doge-stake/useApprove';
import DepositWithDrawModal from './DepositStakedModal';
import useStake from '../../hooks/doge-stake/useStake';
import useUnStake from '../../hooks/doge-stake/useUnstake';
import useGetRewards from '../../hooks/doge-stake/useGetRewards';
import {getDogContract}from '../../data/farm';
import { DOGE_TOKEN } from '../../constants/doge-stake';
import { TOKEN, TOKEN_ADDRESS } from '../../constants/farm';
import {UserStakedItem} from '../../hooks/doge-stake/useGetDogePoolContract';
import moment from 'moment-timezone';
import useGetDogData from '../../hooks/homepage/useGetDogData';
import useBatchWithdraw from '../../hooks/doge-stake/useGetBatchWithdraw';
import useGetRebuyRecords from '../../hooks/contract/useGetDogRebuyRecords';
import useGetDogStakeBalance from '../../hooks/doge-stake/useGetDogStakeBalance';
import useGetDogePriceInfo from '../../hooks/useGetDogeTokenInfo';
import { ArrowRight } from 'react-feather';

const BigNumerZero = new BigNumber(0);
const SummaryWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1rem;
`;

const SummaryItem = styled.div`
    border-radius: 10px;
    padding: 0.8rem;
    box-sizing: border-box;
    width: 48%;
    background: ${({theme}) => theme.white};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;

const Noti = styled.div`
    padding: 0.3rem;
    text-align: center;
    margin-top: 1rem;
    width: 100%;
    border-radius: 10px;
    background: ${({theme}) => theme.primary7};
`;

const StakeWrapper = styled.div`
    border-radius: 10px;
    background: ${({theme}) => theme.white};
    padding: 1rem;
    margin-top: 1rem;
`;

const DataRow = styled(RowBetween)`
    margin-bottom: 1rem;
    padding: 0 1rem;
    border-radius: 10px;
    border: 1px solid  ${({theme}) => theme.primary7};
`;

const BalanceWrapper = styled.div`
    box-sizing: border-box;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 1rem;

    &.first {
        margin-bottom: 2rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid ${({theme}) => theme.borderColor3}; 
    }
`;

const Card = styled.div`
    position: relative;
    max-width: 420px;
    width: 100%;
    border-radius: 30px;
    padding: 1rem;
`;

const TableWrapper = styled(Card)`
    width: 100%;
    box-sizing:border-box;
    margin-top: 0.6rem;
    background: ${({theme}) => theme.white};
    border-radius: 10px;
    padding: 1rem;
`;

const TableTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-size: 16px;
    font-weight: bold;
    padding: 0.5rem 0 1rem;
    color: black;
    border-bottom: 1px solid ${({theme}) => theme.borderColor3};
`;

const TableBody = styled.div`
    margin-top: 1rem;
    width: 100%;
`;

const TableRow = styled.div`
    box-sizing: border-box;
    padding: 0.2rem;
    display: flex;
    align-items: center;
    text-align: ${props => props.style?.textAlign || 'left'};
`;

const TableColumn = styled.div`
    width: 30%;
    font-size: 14px;
    color: ${({theme}) => theme.black};
    font-weight: ${props => props.style?.fontWeight || 'normal'};
`;

const TableDataColumn = styled(TableColumn)`
    font-size: 8px;
    color: ${({theme}) => theme.text3};
    font-weight: ${props => props.style?.fontWeight || 'normal'};
    display: flex;
    align-items: center;
    
    &.last {
        width: 40%;
    }
`;

const ButtonSmall = styled(ButtonPrimary)`
    padding: 0.2rem 0.5rem;
    border-radius: 5px;
    font-size: 10px;
    width: auto;
    flex-shrink: 0;
    margin-left: 0.5rem;
`;

const ReBuyWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 0.5rem;
`;

const ReBuyItem = styled.div`
    border-radius: 10px;
    padding: 0.5rem;
    box-sizing: border-box;
    width: 48%;
    background: ${({theme}) => theme.white};
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;
`;

const RecordWrapper = styled.div`
    padding-top: 0.6rem;
    /* border-bottom: 1px solid ${({ theme }) => theme.borderColor3}; */
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const RecordColumn = styled.div`
    width: 40%;
    overflow: hidden;

    &.last {
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        flex-direction: column;
    }
`;

const Link = styled(TYPE.blue)`
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
`;

const RowCenter = styled(Row)`
  justify-content: center;
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

const StyleLink = styled.span`
    display: flex;
    align-items: center;
    margin: 0 auto;
    margin-top: 2rem;
    color: ${({theme}) => theme.text1};
    border-bottom: 1px solid ${({theme}) => theme.text1};
    padding-bottom: 0.25rem;
    text-align: center;
    cursor: pointer;
    font-size: 1.2rem;
`;

interface UserStakedListData extends UserStakedItem {
  isNotEnd: boolean;
}

export default function Board() {
  const { t } = useTranslation();
  const history = useHistory();
  const web3Provider = useActiveWeb3React();
  const toggleWalletModal = useWalletModalToggle();
  const { chainId, account: address } = web3Provider;
  const account = address || '';
  const [web3, setWeb3] = useState(null);
  const [dogContract, setDogContract] = useState<any>(null);
  const [refreshBalance, setRefreshBalance] = useState(0);
  const [refreshAllowance, setRefreshAllowance] = useState(false);
  const [refreshEarning] = useState(false);
  const [harvesting, setHarvesting] = useState(false);
  const [requestedApproval, setRequestedApproval] = useState(false);
  const [isDepositModal, setIsDepositModal] = useState(true);
  const [depositUnStakedModalVisible, setDepositUnStakedModalVisible] = useState(false);
  const [transPendingText, setTransPendingText] = useState('');
  const [userStakedList, setUserStakedList] = useState<UserStakedListData[]>([]);
  const [loadingUserStakedList, setLoadingUserStakedList] = useState(false);
  const getUserStakedListRef = useRef<any>();
  const [stakes, setStakes] = useState(new BigNumber(0));
  const [lockId, setLockId] = useState<number>();
  const dogePriceInfo = useGetDogePriceInfo();

  // web3 init
  useEffect(() => {
    if (web3Provider.library?.provider) {
        const web3 = initWeb3(web3Provider.library.provider);
        setWeb3(web3);
    }
  }, [web3Provider]);

  // contract init
  useEffect(() => {
    if (web3 && chainId) {
        const dogContractInstance = getDogContract(chainId, web3);
        setDogContract(dogContractInstance);
    }
  }, [web3, chainId]);

  
  const {
    boardAPY,
    boardTvl,
    // 待奖励总金额
    totalPendingRewards,
    // 已奖励金额
    rewardsAmount,
    // 当日奖励金额
    todayRewardsAmount,
    // 本周待奖励金额
    weekPendingRewards,
    dogePoolContract,
    getUserLockedInfo,
    dogPrice,
    rebuyAmount
  } = useGetBoardData({
    web3,
    chainId,
  });

  const {
    dogDestory,
    dogDestoryAmount,
  } = useGetDogData({
    web3,
    chainId,
  })

  const {data: rebuyRecords} = useGetRebuyRecords(dogContract, web3);


  const { onApprove } = useApprove(dogContract, dogePoolContract, account);
  const { onStake } = useStake(0, account, dogePoolContract, 18);
  const { onReward } = useGetRewards(0, account, dogePoolContract);
  const { onUnstake } = useUnStake(0, account, dogePoolContract, 18);
  const { batchWithdraw } = useBatchWithdraw(0, account, dogePoolContract);


  const dogBalance = useGetDogBalance(
    dogContract,
    account,
    refreshBalance,
  );

  const allowance = useAllowanceOfPoolContract(
    dogContract, 
    dogePoolContract, 
    account,
    refreshAllowance,
  );

  const dogStakeBalance = useGetDogStakeBalance(
    0,
    dogePoolContract,
    account,
    refreshBalance,
  )

  const onDespositOrWithDrawModalConfirm = function (amount: string) {
    setTransPendingText(t('pending_tx'));
    if (isDepositModal) {
        return onStake(amount);
    } else {
        return onUnstake(amount, lockId);
    }
  };

  const earnings = useGetEarning(
    0,
    dogePoolContract,
    account,
    refreshBalance,
    refreshEarning,
  );

  // approve
  const handleApprove = useCallback(async () => {
    setRequestedApproval(true);
    const result = await onApprove();
    if (result.message) {
        console.error(result.message);
    }
    setRequestedApproval(false);
    setRefreshAllowance(!refreshAllowance);
  }, [onApprove, setRequestedApproval]);

  useEffect(() => {
    if (transPendingText) {
        message.loading({
            key: 'transLoading',
            content: transPendingText,
            duration: 40,
        })
    } else {
        message.destroy('transLoading');
    }

    return () => {
      message.destroy('transLoading');
    }
  }, [transPendingText]);

  async function getUserStakedList() {
    setLoadingUserStakedList(true);
    const res = await getUserLockedInfo(0, account);
    setLoadingUserStakedList(false);
    const now = moment();
    setUserStakedList(res.map((item) => {
      const expireTime = moment(Number(item.expireTime) * 1000);
      return {
        amount: new BigNumber(item.amount).dividedBy(new BigNumber(10).pow(18)).toFixed(),
        // 质押时间，unix时间戳
        stakedTime: moment(Number(item.stakedTime) * 1000).format('MM-DD HH:mm:ss'),
        // 解锁时间，unix时间戳
        expireTime: expireTime.format('MM-DD HH:mm:ss'),
        isWithdrawed: item.isWithdrawed,
        isNotEnd: expireTime > now,
      }
    }));
  }

  const earningMoney = useMemo(() => {
    if (earnings.toNumber() && dogePriceInfo) {
      return earnings.dividedBy(new BigNumber(10).pow(8)).times(dogePriceInfo.price).toNumber();
    }
    return 0;
  }, [earnings, dogePriceInfo]);

  const dogStakeMoney = useMemo(() => {
    if (dogStakeBalance.toNumber() && dogPrice) {
      return dogStakeBalance.times(dogPrice).toNumber();
    }
    return 0;
  }, [dogStakeBalance, dogPrice]);


  useEffect(() => {
    if (dogePoolContract && account) {
      getUserStakedList();
      getUserStakedListRef.current = setInterval(getUserStakedList, 20000);
    }

    return () => {
      if (getUserStakedListRef.current) {
        clearInterval(getUserStakedListRef.current);
      }
    }
  }, [dogePoolContract, account]);
  

  const stakeDisabled = dogBalance.eq(BigNumerZero);
  // const unStakeEnable = !stakes.eq(BigNumerZero);

  function getUnStakedButtonText(isWithDrawed: boolean, isNotEnd: boolean) {
    if (isWithDrawed) {
      return t('unLocked')
    }

    if (isNotEnd) {
      return t('notEndDate')
    }

    return t('unlock');
  }

  const stakeBalance = useMemo(() => {
    return dogStakeBalance.toNumber();
  }, [dogStakeBalance]);

  function handleEvent() {
    setTransPendingText('');
    getUserStakedList();
    setRefreshBalance(new Date().getTime());
  }

  useEffect(() => {
    if (dogePoolContract && account) {
      dogePoolContract.events.Deposit({
          filter: {
              user: account
          }
      }, async (error: any, event: any) => {
          if (error) {
              return;
          }
          handleEvent();
      });
      dogePoolContract.events.Withdraw({
          filter: {
              user: account
          }
      }, async (error: any, event: any) => {
          if (error) {
              return;
          }
          handleEvent();
      });

      dogePoolContract.events.BatchWithdraw({
        filter: {
            user: account
        }
      }, async (error: any) => {
          if (error) {
              return;
          }
          handleEvent();
      });
    }
    

}, [dogePoolContract, account]);

async function handleBatchWithdrawClick() {
  setTransPendingText(t('pending_tx'));
  try {
    await batchWithdraw();
  } catch(e) {
    setTransPendingText('');
  }
}

const batchWithdrawEnabe = useMemo(() => {
  return userStakedList.filter(item => !item.isNotEnd && !item.isWithdrawed).length > 0;
}, [userStakedList]);

const dogeEarningBalanceNumber = useMemo(() => {
  return earnings.dividedBy(new BigNumber(10).pow(8)).toNumber();
}, [earnings])

// function goToSwapOrLiquid() {
//   history.push(`/swap?outputCurrency=${TOKEN_ADDRESS[TOKEN.DOG]}`)
// }


  return (
    <AppBody style={{ background: 'transparent', boxShadow: 'none', marginTop: '0rem' }}>
      {!account ? (
        <ButtonLight style={{ marginTop: '4rem' }} onClick={toggleWalletModal}>
          {t('connectWallet')}
        </ButtonLight>
      ) : (
        <>
          <RowCenter>
            <StyleLink onClick={() => {
                history.push('/board/v2')
              }}>
              <span>{`${t('enterBoardV2')}`}&nbsp;</span>
              <ArrowRight width="16px" />
            </StyleLink>
          </RowCenter>
          <SummaryWrapper>
            <SummaryItem>
              <TYPE.darkGray>{t('amountToBeRewarded')}($)</TYPE.darkGray>
              <TYPE.originBlack fontSize={18}>
                <Value value={totalPendingRewards} />
              </TYPE.originBlack>
            </SummaryItem>
            <SummaryItem>
              <TYPE.darkGray>{t('rewardedAmount')}($)</TYPE.darkGray>
              <TYPE.originBlack fontSize={18}>
                <Value value={rewardsAmount} />
              </TYPE.originBlack>
            </SummaryItem>
          </SummaryWrapper>
          <SummaryWrapper>
            <SummaryItem>
              <TYPE.darkGray>{t('dayOfRewardAmount')}($)</TYPE.darkGray>
              <TYPE.originBlack fontSize={18}>
                <Value value={todayRewardsAmount} />
              </TYPE.originBlack>
            </SummaryItem>
            <SummaryItem>
              <TYPE.darkGray>{t('weekOfRewardAmount')}($)</TYPE.darkGray>
              <TYPE.originBlack fontSize={18}>
                <Value value={weekPendingRewards} />
              </TYPE.originBlack>
            </SummaryItem>
          </SummaryWrapper>
          <Noti>
            <TYPE.white fontSize={14}>*{t('stakeLockInfo')}</TYPE.white>
          </Noti>
          <StakeWrapper>
            <DataRow>
              <TYPE.darkGray>APY</TYPE.darkGray>
              <TYPE.originBlack fontSize={18}>
                <Value value={boardAPY} decimals={0} />%
              </TYPE.originBlack>
            </DataRow>
            <DataRow>
              <TYPE.darkGray>TVL</TYPE.darkGray>
              <TYPE.originBlack fontSize={18}>
                $<Value value={boardTvl} />
              </TYPE.originBlack>
            </DataRow>
            <BalanceWrapper className="first">
              <TYPE.originBlack fontSize={18} style={{ marginBottom: '1rem' }}>
                {t('dogeEarn')}
              </TYPE.originBlack>
              <RowCenter>
                <TYPE.originBlack fontSize={22} style={{ marginBottom: '0rem' }}>
                  <Value value={dogeEarningBalanceNumber} />
                </TYPE.originBlack>
              </RowCenter>
              <RowCenter>
                <StyleBalance>
                  ≈ $ <Value  value={earningMoney} />
                </StyleBalance>
              </RowCenter>
              <TokenImage style={{ marginBottom: '1rem' }} address={DOGE_TOKEN} />
              <ButtonPrimary
                width="100%"
                padding="0.5rem"
                borderRadius="10px"
                disabled={earnings.lt(0.001) || harvesting}
                onClick={async () => {
                  setHarvesting(true)
                  setTransPendingText(t('pending_tx'))
                  try {
                    await onReward()
                  } catch (e) {
                    console.log(e)
                    setTransPendingText('')
                  }
                  setHarvesting(false)
                }}
              >
                {t('get')}
              </ButtonPrimary>
            </BalanceWrapper>
            <BalanceWrapper>
              <TYPE.originBlack fontSize={18} style={{ marginBottom: '1rem' }}>
                ORI {t('stakedAndLocked')}
              </TYPE.originBlack>
              <RowCenter>
                <TYPE.originBlack fontSize={22} style={{ marginBottom: '0rem' }}>
                  <Value value={stakeBalance} />
                </TYPE.originBlack>
              </RowCenter>
              <RowCenter>
                <StyleBalance>
                  ≈ $ <Value  value={dogStakeMoney} />
                </StyleBalance>
              </RowCenter>
              <TokenImage style={{ marginBottom: '1rem' }} address={TOKEN_ADDRESS[TOKEN.DOG]} />
              {!allowance.toNumber() && (
                <ButtonPrimary
                  width="100%"
                  padding="0.5rem"
                  borderRadius="10px"
                  disabled={requestedApproval || true}
                  onClick={handleApprove}
                >
                  {t(requestedApproval ? 'approving' : 'approve')}
                </ButtonPrimary>
              )}
              {!!allowance.toNumber() && (
                <>
                  <ButtonPrimary
                    width="100%"
                    padding="0.5rem"
                    borderRadius="10px"
                    disabled={stakeDisabled || true}
                    onClick={() => {
                      setIsDepositModal(true)
                      setDepositUnStakedModalVisible(true)
                    }}
                  >
                    {/* {t(stakeDisabled ? 'insufficientBalance' : 'stake')} */}
                    {t('stake')}
                  </ButtonPrimary>
                </>
              )}
              {/* {!!allowance.toNumber() && dogBalance.eq(0) && (
                <RowCenter style={{ marginTop: '0.5rem' }}>
                  <LinkStyledButton onClick={goToSwapOrLiquid}>
                    {`${t('noTip')} ${TOKEN.DOG}? ${t('swap')}`}
                  </LinkStyledButton>
                </RowCenter>
              )} */}
              <RowCenter marginTop="0.5rem">
                  <TYPE.originLightGrey textAlign="center">{t('oldBordeFuncStakedDisabledDesc1')}</TYPE.originLightGrey>
              </RowCenter>
              <RowCenter marginTop="0.5rem">
                  <TYPE.originLightGrey textAlign="center">{t('oldBordeFuncStakedDisabledDesc2')}</TYPE.originLightGrey>
              </RowCenter>
            </BalanceWrapper>
          </StakeWrapper>
          <TableWrapper>
            <TableTitle>
              <span>{t('stakeRecord')}</span>
              {!!userStakedList.length && (
                <ButtonSmall disabled={!batchWithdrawEnabe} onClick={handleBatchWithdrawClick}>
                  {t('batchWithdraw')}
                </ButtonSmall>
              )}
            </TableTitle>
            <TableBody>
              {userStakedList.length ? (
                <TableRow style={{ border: 'none' }}>
                  <TableColumn style={{ fontWeight: 'bold' }}>{t('stakeDate')}</TableColumn>
                  <TableColumn style={{ fontWeight: 'bold' }}>{t('stakeAmount')}</TableColumn>
                  <TableColumn style={{ fontWeight: 'bold' }}>{t('unlockDate')}</TableColumn>
                </TableRow>
              ) : (
                <TableRow style={{ border: 'none' }}>
                  <TYPE.originBlack>{t(loadingUserStakedList ? 'loading' : 'noStakedRecord')}</TYPE.originBlack>
                </TableRow>
              )}
              {userStakedList.map((item, index) => {
                return (
                  <TableRow key={index}>
                    <TableDataColumn>{item.stakedTime}</TableDataColumn>
                    <TableDataColumn>{new BigNumber(item.amount).toFixed(6)}</TableDataColumn>
                    <TableDataColumn className="last">
                      <span>{item.expireTime}</span>
                      <ButtonSmall
                        disabled={item.isNotEnd || item.isWithdrawed}
                        onClick={() => {
                          setIsDepositModal(false)
                          setDepositUnStakedModalVisible(true)
                          setStakes(new BigNumber(item.amount).times(new BigNumber(10).pow(18)))
                          setLockId(userStakedList.length - index - 1);
                        }}
                      >
                        {getUnStakedButtonText(item.isWithdrawed, item.isNotEnd)}
                      </ButtonSmall>
                    </TableDataColumn>
                  </TableRow>
                )
              })}
            </TableBody>
          </TableWrapper>
          <TableWrapper>
            <TableTitle>
              <span>{t('dogRebug')}</span>
            </TableTitle>
            <TableBody>
              <ReBuyWrapper>
                <ReBuyItem>
                  <TYPE.darkGray fontSize={12}>{t('amountToBeRepurchase')}</TYPE.darkGray>
                  <TYPE.originBlack fontSize={12}>
                    $ <Value value={rebuyAmount} />
                  </TYPE.originBlack>
                </ReBuyItem>
                <ReBuyItem>
                  <TYPE.darkGray fontSize={12}>{t('rebuyPrice')}</TYPE.darkGray>
                  <TYPE.originBlack fontSize={12}>
                    $ <Value value={dogPrice} />
                  </TYPE.originBlack>
                </ReBuyItem>
              </ReBuyWrapper>
              <ReBuyWrapper>
                <ReBuyItem>
                  <TYPE.darkGray fontSize={12}>{t('totalRebuyDestory')}</TYPE.darkGray>
                  <TYPE.originBlack fontSize={12}>
                    <Value value={dogDestory} /> ORI
                  </TYPE.originBlack>
                </ReBuyItem>
                <ReBuyItem>
                  <TYPE.darkGray fontSize={12}>{t('totalRepurchase')}</TYPE.darkGray>
                  <TYPE.originBlack fontSize={12}>
                    $ <Value value={dogDestoryAmount} />
                  </TYPE.originBlack>
                </ReBuyItem>
              </ReBuyWrapper>
            </TableBody>
            <TableTitle>
              <span>{t('repurchaseRecords')}</span>
            </TableTitle>
            {!rebuyRecords.length && (
              <RecordWrapper>
                <TYPE.originBlack>{t('loading')}</TYPE.originBlack>
              </RecordWrapper>
            )}
            {rebuyRecords.map((item, index) => (
              <RecordWrapper key={index}>
                <RecordColumn style={{ width: '50%' }}>
                  <RowBetween>
                    <Link
                      fontSize={12}
                      fontWeight={300}
                      onClick={() => {
                        window.open(`https://hecoinfo.com/tx/${item.txHash}`)
                      }}
                    >
                      {item.txHash}
                    </Link>
                  </RowBetween>
                  <RowBetween>
                    <TYPE.originBlack fontSize={12} fontWeight={300}>
                      At block {item.blockNumber}
                    </TYPE.originBlack>
                  </RowBetween>
                </RecordColumn>
                <RecordColumn className="last">
                  {/* <TYPE.originBlack fontSize={12} fontWeight={300}>
                        {t('price')}:$6.158
                      </TYPE.originBlack> */}
                  <TYPE.originBlack fontSize={12} fontWeight={300}>
                    {t('amount')}:{item.destoryAmount} ORI
                  </TYPE.originBlack>
                </RecordColumn>
              </RecordWrapper>
            ))}
          </TableWrapper>
          <DepositWithDrawModal
            isOpen={depositUnStakedModalVisible}
            isDepositModal={isDepositModal}
            max={isDepositModal ? dogBalance : stakes}
            decimals={18}
            onClose={() => {
              setDepositUnStakedModalVisible(false)
              setIsDepositModal(true)
              setLockId(undefined)
            }}
            pairOrTokenName={'DOG'}
            onConfirm={onDespositOrWithDrawModalConfirm}
            onError={() => setTransPendingText('')}
          />
        </>
      )}
    </AppBody>
  )
}
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState, useRef, useMemo} from 'react';
import { useTranslation } from 'react-i18next'
import {useHistory} from 'react-router-dom';
import AppBody from '../AppBody';
import styled from 'styled-components';
import { TYPE, LinkStyledButton } from '../../theme';
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
import useGetDogBalance from '../../hooks/doge-stake/useGetDogBalance';
import BigNumber from 'bignumber.js';
import { useWalletModalToggle } from '../../state/application/hooks';
import useApprove from '../../hooks/muti-rewards/useApprove';
import DepositWithDrawModal from './DepositStakedModal';
import useStake from '../../hooks/muti-rewards/useStake';
import useUnStake from '../../hooks/muti-rewards/useUnstake';
import useGetRewards from '../../hooks/muti-rewards/useGetRewards';
import {getDogContract}from '../../data/farm';
import { DOGE_TOKEN } from '../../constants/doge-stake';
import { TOKEN, TOKEN_ADDRESS } from '../../constants/farm';
import {UserStakedItem} from '../../hooks/doge-stake/useGetDogePoolContract';
import moment from 'moment-timezone';
import useGetDogData from '../../hooks/homepage/useGetDogData';
// import useBatchWithdraw from '../../hooks/muti-rewards/useGetBatchWithdraw';
import useGetRebuyRecords from '../../hooks/contract/useGetDogRebuyRecords';
import useGetDogStakeBalance from '../../hooks/muti-rewards/useGetDogStakeBalance';
// import useGetDogePriceInfo from '../../hooks/useGetDogeTokenInfo';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import RewardPool from './RewardPool';
import PendingPool from './PendingPool';
import UnlockModal from './UnlockModal';
import useGetMutiRewardsTokenPoolContract, {PoolStatus} from '../../hooks/muti-rewards/useGetMutiRewardsTokenPoolContract';
import { ArrowRight } from 'react-feather';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3} style={{
          padding: '1rem 0'
        }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const BigNumerZero = new BigNumber(0);


const Noti = styled.div`
    padding: 0.3rem;
    text-align: center;
    margin-top: 1rem;
    width: 100%;
    border-radius: 10px;
    background: ${({theme}) => theme.primary7};
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

const TabWrapper = styled.div`
  margin-top: 1rem;
  box-sizing: border-box;
  width: 100%;
  padding: 0.5rem;
  background: #fff;
  border-radius: 10px;
  color: #000;
`;

const StyleBar = styled.div`
    color: #000;
    width: 100%;

    .PrivateTabIndicator-root-1 {
      background-color: ${({theme}) => theme.primary7} !important;
    }
    /* background: ${({theme}) => theme.primary7}; */
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

const StyleTab = styled(Tab)`
  min-width: unset !important;
`;


interface UserStakedListData extends UserStakedItem {
  isNotEnd: boolean;
  originStakeTime: string;
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
  const [lockDate, setLockDate] =useState<string>();
  // const dogePriceInfo = useGetDogePriceInfo();
  const [tab, setTab] = useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
  };

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
    dogPrice,
    rebuyAmount,
    totalPendingRewards: dogeTotalPendingRewards,
    rewardsAmount: dogeTotalRewardsAmount,
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

  const {
    pools,
    boardAPY,
    boardTVL,
    getUserLockedInfo,
    getAllTokenRewards,
    poolContract,
    pendingRewards,
    tokenPriceInfo,
  } =useGetMutiRewardsTokenPoolContract(account, web3, chainId);


  const { onApprove } = useApprove(dogContract, poolContract, account);
  const { onStake } = useStake(0, account, poolContract, 18);
  const { onReward } = useGetRewards(0, account, poolContract);
  const { onUnstake } = useUnStake(0, account, poolContract, 18);
  // const { batchWithdraw } = useBatchWithdraw(0, account, poolContract);


  const dogBalance = useGetDogBalance(
    dogContract,
    account,
    refreshBalance,
  );

  const allowance = useAllowanceOfPoolContract(
    dogContract, 
    poolContract, 
    account,
    refreshAllowance,
  );

  const dogStakeBalance = useGetDogStakeBalance(
    0,
    poolContract,
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
    // const now = moment();
    setUserStakedList(res.map((item) => {
      const expireTime = moment(Number(item.expireTime) * 1000);
      return {
        amount: new BigNumber(item.amount).dividedBy(new BigNumber(10).pow(18)).toFixed(),
        // 质押时间，unix时间戳
        stakedTime: moment(Number(item.stakedTime) * 1000).format('MM-DD HH:mm:ss'),
        // 解锁时间，unix时间戳
        expireTime: expireTime.format('MM-DD HH:mm:ss'),
        isWithdrawed: item.isWithdrawed,
        isNotEnd: false,
        originStakeTime: item.stakedTime,
      }
    }));
  }

  // const earningMoney = useMemo(() => {
  //   if (earnings.toNumber() && dogePriceInfo) {
  //     return earnings.dividedBy(new BigNumber(10).pow(8)).times(dogePriceInfo.price).toNumber();
  //   }
  //   return 0;
  // }, [earnings, dogePriceInfo]);

  const dogStakeMoney = useMemo(() => {
    if (dogStakeBalance.toNumber() && dogPrice) {
      return dogStakeBalance.times(dogPrice).toNumber();
    }
    return 0;
  }, [dogStakeBalance, dogPrice]);


  useEffect(() => {
    if (poolContract && account) {
      getUserStakedList();
      getUserStakedListRef.current = setInterval(getUserStakedList, 20000);
    }

    return () => {
      if (getUserStakedListRef.current) {
        clearInterval(getUserStakedListRef.current);
      }
    }
  }, [poolContract, account]);
  

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
    getAllTokenRewards();
    setRefreshBalance(new Date().getTime());
  }

  useEffect(() => {
    if (poolContract && account) {
      poolContract.events.Deposit({
          filter: {
              user: account
          }
      }, async (error: any, event: any) => {
          if (error) {
              return;
          }
          handleEvent();
      });
      poolContract.events.Withdraw({
          filter: {
              user: account
          }
      }, async (error: any, event: any) => {
          if (error) {
              return;
          }
          handleEvent();
      });
    }
}, [poolContract, account]);

// async function handleBatchWithdrawClick() {
//   setTransPendingText(t('pending_tx'));
//   try {
//     await batchWithdraw();
//   } catch(e) {
//     setTransPendingText('');
//   }
// }

// const batchWithdrawEnabe = useMemo(() => {
//   return userStakedList.filter(item => !item.isNotEnd && !item.isWithdrawed).length > 0;
// }, [userStakedList]);

const pendingPools = useMemo(() => {
  return pools.filter((item) => item.status === PoolStatus.PENDING).sort((a, b) => b.tokenRemaining - a.tokenRemaining);
}, [pools]);

const miningPools = useMemo(() => {
  const res = pools
    .filter((item) => item.status === PoolStatus.STARTED && item.rewardToken.toLowerCase() !== DOGE_TOKEN.toLowerCase())
    .sort((a, b) => b.apy - a.apy);
  
  const dogePoolArray = pools
  .filter((item) => item.rewardToken.toLowerCase() === DOGE_TOKEN.toLowerCase());

  if (dogePoolArray && dogePoolArray.length) {
    res.unshift(dogePoolArray[0]);
  }
  return res;
}, [pools]);

const endedPools = useMemo(() => {
  return pools.filter((item) => item.status === PoolStatus.ENDED).sort((a, b) => b.apy - a.apy);
}, [pools]);

function goToSwapOrLiquid() {
  history.push(`/swap?outputCurrency=${TOKEN_ADDRESS[TOKEN.DOG]}`)
}

function handleOnCloseModal() {
  setDepositUnStakedModalVisible(false)
  setIsDepositModal(true)
  setLockId(undefined)
  setLockDate(undefined);
}

const harvestAllEnable = useMemo(() => {
  if (pendingRewards) {
    const values = Object.values(pendingRewards);
    for (let i = 0, len = values.length; i < len; i = i + 1) {
      if (values[i]) {
        return true;
      }
    }
  }
  return false;
}, [pendingRewards]);

function getRewardsButton() {
  return (
    <>
      <ButtonPrimary
        width="100%"
        padding="0.5rem"
        marginTop="1rem"
        borderRadius="10px"
        disabled={!harvestAllEnable || harvesting}
        onClick={async () => {
          setHarvesting(true)
          setTransPendingText(t('pending_tx'))
          try {
            await onReward()
          } catch (e) {
            setTransPendingText('')
          }
          setHarvesting(false)
        }}
      >
        {t('harvestAll')}
      </ButtonPrimary>
      <TYPE.originLightGrey width="100%" textAlign="center" fontSize="0.6rem"  marginTop="1rem">{t('harvestAllInfo')}</TYPE.originLightGrey>
    </>
  )
}

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
                history.push('/board')
              }}>
              <span>{`${t('enterOldBoard')}`}&nbsp;</span>
              <ArrowRight width="16px" />
            </StyleLink>
          </RowCenter>
          <Noti>
            <TYPE.white fontSize={14}>*{t('stakeLockInfo')}</TYPE.white>
          </Noti>
          <TabWrapper>
            <StyleBar>
              <Tabs 
                variant="fullWidth"
                value={tab} 
                onChange={handleChange} 
                aria-label="simple tabs example"
              >
                <StyleTab label={`${t('mining')}(${miningPools.length})`} {...a11yProps(0)} />
                <StyleTab label={`${t('miningStop')}(${endedPools.length})`} {...a11yProps(1)} />
                <StyleTab label={`${t('miningPending')}(${pendingPools.length})`} {...a11yProps(2)} />
              </Tabs>
            </StyleBar>
            <TabPanel value={tab} index={0}>
              <DataRow>
                <TYPE.darkGray>APY</TYPE.darkGray>
                <TYPE.originBlack fontSize={18}>
                  <Value value={boardAPY} decimals={0} />%
                </TYPE.originBlack>
              </DataRow>
              <DataRow>
                <TYPE.darkGray>TVL</TYPE.darkGray>
                <TYPE.originBlack fontSize={18}>
                  $<Value value={boardTVL} />
                </TYPE.originBlack>
              </DataRow>
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
                    disabled={requestedApproval}
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
                      disabled={stakeDisabled}
                      onClick={() => {
                        setIsDepositModal(true)
                        setDepositUnStakedModalVisible(true)
                      }}
                    >
                      {t(stakeDisabled ? 'insufficientBalance' : 'stake')}
                    </ButtonPrimary>
                  </>
                )}
                {!!allowance.toNumber() && dogBalance.eq(0) && (
                  <RowCenter style={{ marginTop: '0.5rem' }}>
                    <LinkStyledButton onClick={goToSwapOrLiquid}>
                      {`${t('noTip')} ${TOKEN.DOG}? ${t('swap')}`}
                    </LinkStyledButton>
                  </RowCenter>
                )}
                {getRewardsButton()}
              </BalanceWrapper>
              {
                miningPools.length ? (
                  miningPools.map((item) => (
                    <RewardPool
                        key={item.rewardToken}
                        todayRewards={item.todayRewardsAmount}
                        weekPendingRewards={item.weekPendingRewards}
                        symbol={item.symbol}
                        tokenAddress={item.rewardToken}
                        earnings={pendingRewards[item.rewardToken]}
                        tokenPriceInfo={tokenPriceInfo[item.rewardToken.toLowerCase()]}
                        totalPendingRewards={item.rewardToken.toLowerCase() === DOGE_TOKEN.toLowerCase() ? dogeTotalPendingRewards: undefined}
                        totalRewards={item.rewardToken.toLowerCase() === DOGE_TOKEN.toLowerCase() ? dogeTotalRewardsAmount: undefined}
                    />
                  ))
                ) : (
                  <TYPE.originLightGrey width="100%" textAlign="center">{t(pools.length ? 'noPools' : 'loading')}</TYPE.originLightGrey>
                )
              }
              
            </TabPanel>
            <TabPanel value={tab} index={1}>
             
              {
                endedPools.length ? (
                  <>
                      {getRewardsButton()}
                      {
                        endedPools.map((item) => (
                          <RewardPool
                              key={item.rewardToken}
                              todayRewards={item.todayRewardsAmount}
                              weekPendingRewards={item.weekPendingRewards}
                              symbol={item.symbol}
                              tokenAddress={item.rewardToken}
                              earnings={pendingRewards[item.rewardToken]}
                              tokenPriceInfo={tokenPriceInfo[item.rewardToken.toLowerCase()]}
                              totalPendingRewards={item.rewardToken.toLowerCase() === DOGE_TOKEN.toLowerCase() ? dogeTotalPendingRewards: undefined}
                              totalRewards={item.rewardToken.toLowerCase() === DOGE_TOKEN.toLowerCase() ? dogeTotalRewardsAmount: undefined}
                          />
                        ))
                      }
                  </>
                ) : (
                  <TYPE.originLightGrey width="100%" textAlign="center">{t(pools.length ? 'noPools' : 'loading')}</TYPE.originLightGrey>
                )
              }
            </TabPanel>
            <TabPanel value={tab} index={2}>
              {
                pendingPools.length === 0 ? (
                  <TYPE.originLightGrey width="100%" textAlign="center">{t(pools.length ? 'noPools' : 'loading')}</TYPE.originLightGrey>
                ) : (
                  pendingPools.map((item) => (
                    <PendingPool key={item.rid} tokenAddress={item.rewardToken} symbol={item.symbol} pendingRewardCount={item.tokenRemaining} />
                  ))
                )
              }
            </TabPanel>
          </TabWrapper>          
          <TableWrapper>
            <TableTitle>
              <span>{t('stakeRecord')}</span>
              {/* {!!userStakedList.length && (
                <ButtonSmall disabled={!batchWithdrawEnabe} onClick={handleBatchWithdrawClick}>
                  {t('harvestAll')}
                </ButtonSmall>
              )} */}
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
                    <TableDataColumn>{new BigNumber(item.amount).toFixed(3)}</TableDataColumn>
                    <TableDataColumn className="last">
                      <span>{item.expireTime}</span>
                      <ButtonSmall
                        disabled={item.isNotEnd || item.isWithdrawed}
                        onClick={() => {
                          setIsDepositModal(false)
                          setDepositUnStakedModalVisible(true)
                          setStakes(new BigNumber(item.amount).times(new BigNumber(10).pow(18)))
                          setLockId(userStakedList.length - index - 1);
                          setLockDate(item.originStakeTime);
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
            isOpen={depositUnStakedModalVisible && isDepositModal}
            isDepositModal={true}
            max={dogBalance}
            decimals={18}
            onClose={handleOnCloseModal}
            pairOrTokenName={'DOG'}
            onConfirm={onDespositOrWithDrawModalConfirm}
            onError={() => setTransPendingText('')}
          />
          <UnlockModal 
            lockDate={lockDate}
            unlockAmount={stakes} 
            visible={depositUnStakedModalVisible && !isDepositModal}
            onConfirm={onDespositOrWithDrawModalConfirm} 
            onClose={handleOnCloseModal}
            onError={() => setTransPendingText('')}
          />
        </>
      )}
    </AppBody>
  )
}
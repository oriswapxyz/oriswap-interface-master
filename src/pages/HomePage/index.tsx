/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useMemo, useState, useRef } from 'react';
import AppBody from '../AppBody';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next'
import styled, { ThemeContext }  from 'styled-components';
import BoardPriceImg from '../../assets/images/price.png';
import BoardWalletImg from '../../assets/images/wallet.png';
import BoardMoneyImg from '../../assets/images/money.png';
import BoardPanelImg from '../../assets/images/panel.png';
import BoardChartsImg from '../../assets/images/charts.png';
// import DogsBackground from '../../assets/images/dog.png';
import CycleImg from '../../assets/images/cycle.png';
import RewardsImg from '../../assets/images/rewards.png';
// import SlowMistImg from '../../assets/images/slow-mist.png';
import SlowMistDark from '../../assets/images/slowmist-d.png';
import SlowMistLight from '../../assets/images/slowmist-l.png';
import ChatImg from '../../assets/images/chat.png';
import { useDarkModeManager } from '../../state/user/hooks';
import { TYPE } from '../../theme';
import { AutoColumn } from '../../components/Column';
import Row, { RowBetween } from '../../components/Row';
import initWeb3 from '../../hooks/init-web3';
import { useActiveWeb3React } from '../../hooks';
import {getDogContract, getPoolContract}from '../../data/farm';
import useGetAPYConnectMinerInfo from '../../hooks/farm/useGetAPYConnectMinerInfo'
import useGetPoolInfoWithTokenPrice from '../../hooks/use-get-poolInfo';
import {getGlobalData} from '../../graphql/info-data/api';
import { BigNumber } from 'bignumber.js';
import { useWalletModalToggle } from '../../state/application/hooks';
import Value from '../../components/Value';
import useGetBalance from '../../hooks/farm/useGetLPTokenBalance';
import { getLocalCacheOfGlobalData, setLocalCacheOfGlobalData } from '../../utils/globalDataCache';
import { getLocalCacheOfPlatformTvl, setLocalCacheOfPlatformTvl } from '../../utils/platformTvlCache';
import useGetBoardData from '../../hooks/doge-stake/useGetBoardData';
import useGetDogData from '../../hooks/homepage/useGetDogData';
import useGetMutiRewardsTokenPoolContract from '../../hooks/muti-rewards/useGetMutiRewardsTokenPoolContract';
import { DOGE_TOKEN } from '../../constants/doge-stake';
import moment from 'moment-timezone';

const Card = styled.div`
    position: relative;
    max-width: 420px;
    width: 100%;
    border-radius: 30px;
    padding: 1rem;
`;

const BoardRoomWrapper = styled(Card)`
    background: ${({theme}) => theme.bg8};
`;

const PlatformTvl = styled.div`
    padding: 1rem 0;
    line-height: 1.5rem;
    width: 100%;
    color: ${({theme}) => theme.bg12};
    background: ${({theme}) => theme.white};
    font-size: 1rem;
    border-radius: 1rem;
    text-align: center;

    span {
        font-size: 1.5rem;
        font-weight: bold;
    }
`;
const CardTitle = styled.div`
    padding: 1rem 0;
    line-height: 1.5rem;
    color: ${({theme}) => theme.white};
    font-size: 1rem;
`;

const BoardRoomItemWapper = styled.div`
    width: 100%;
    /* height: 2rem; */
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 0.7rem;
    border-radius: 0.5rem;
    box-sizing: border-box;
    padding: 0.3rem 0.7rem;
    background: ${({theme}) => theme.white};
    color: ${({theme}) => theme.black};
`;

const BoardItemImage = styled.img`
    width: 1.2rem;
    height: 1.2rem;
    margin-right: 0.5rem;
`;

const NormalText = styled.span`
    font-size: 0.75rem;
    padding-right: 0.5rem;
    color: ${({theme}) => theme.black};
`;

const BoardNumber = styled.span`
    flex-grow: 1;
    text-align: right;
    color: ${({theme}) => theme.primary7};
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const BoardRoomButton = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 3.2rem;
	border-radius: 1.6rem;
    font-size: 1.3rem;
    margin-top: 1rem;
    background: ${({theme}) => theme.bg12};
    color: ${({theme}) => theme.white};
`;

const TableWrapper = styled(Card)`
    width: 100%;
    margin-top: 0.6rem;
    /* background: ${({theme}) => theme.bg8}; */
    padding: 0;
    padding-bottom: 0;
`;

const BoradTalbeTitle = styled(CardTitle)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-radius: 30px 30px 0 0;
    width: 100%;
    overflow: hidden;
`;

const TableBody = styled.div`
    width: 100%;
    padding: 0 1rem;
    background: ${({theme}) => theme.white};
    border-radius: 0 0 30px 30px;
`;

const TableRow = styled.div`
    box-sizing: border-box;
    padding: 1rem 0;
    display: flex;
    align-items: center;
    border-top: 1px solid ${({theme}) => theme.borderColor3};
    text-align: ${props => props.style?.textAlign || 'left'};
`;

const TableColumn = styled.div`
    width: 33%;
    color: ${({theme}) => theme.black};
    font-weight: ${props => props.style?.fontWeight || 'normal'};
`;

const SummaryCardWrapper = styled(Card)`
    position: relative;
    width: 100%;
    height: 8.8rem;
    padding: 1.6rem 0.8rem;
    border-radius: 30px;
    margin-top: 0.6rem;
    z-index: 0;
    color: ${({ theme }) => theme.white};
    background-color: ${({ theme }) => theme.bg8};
    overflow: hidden;
`;

// const SummaryCardImg = styled.div`
//     position: absolute;
//     left: 0;
//     top: 0;
//     right: 0;
//     bottom: 0;
//     background-image: url(${DogsBackground});
//     background-repeat: no-repeat;
//     background-position: center center;
//     background-size: 105% 105%;
//     z-index: -1;
// `;

const FeeWrapper = styled(Card)`
    box-shadow: ${({ theme }) => theme.shadow2};
    background-color: ${({ theme }) => theme.bg1};
    padding: 0 1rem;
    margin-top: 0.6rem;
`;

const FeeRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 0rem;
    flex-wrap: wrap;
    border-bottom: 1px solid ${({ theme }) => theme.borderColor3};
`;

const UseCaseWrapper = styled(Card)`
    margin-top: 0.6rem;
    box-shadow: ${({ theme }) => theme.shadow2};
    background-color: ${({ theme }) => theme.bg1};
    text-align: center;
    padding: 2.5rem 1rem;
`;

const UseCaseImage = styled.img`
    margin-top: 2rem;
    width: 60px;
    height: 60px;
`;

const RowCenter = styled(Row)`
    justify-content: center;
`;

const View = styled.span`
    color: ${({theme}) => theme.primary7};
    cursor: pointer;
`;

const TransLabel = styled(TYPE.lightGray)`
    padding-right:1rem;
    flex-shrink: 0;
    flex-grow: 0;
`;

const TransValue = styled(TYPE.black)`
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const DogDataWrapper = styled(Card)`
  position: relative;
    width: 100%;
    padding: 1.6rem 0.8rem;
    border-radius: 30px;
    margin-top: 0.6rem;
    z-index: 0;
    color: ${({ theme }) => theme.white};
    overflow: hidden;
    box-shadow: ${({ theme }) => theme.shadow2};
    background-color: ${({ theme }) => theme.bg1};
`;

const DogDataTitle = styled(TYPE.black)`
    padding-bottom: 1rem;
    border-bottom: 1px solid ${({theme}) => theme.borderColor3};
`;

const DogDataRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0rem;
    flex-wrap: wrap;
`;

const DogDataLabel = styled(TYPE.black)`
    padding-right:1rem;
    flex-shrink: 0;
    flex-grow: 0;
`;

const DogDataValue = styled(TYPE.black)`
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const BoardRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1rem 0rem;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor3};
`;

const BoardLable = styled(TYPE.black)`
    width: 30%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    box-sizing: border-box;
    padding-right: 1rem;
    color: #000;
`;

const BoardValue = styled(TYPE.black)`
    width: 70%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: right;
    color: #000;

    &.breakWorld {
      overflow: unset;
      text-overflow: unset,;
      white-space: unset;
      word-break: break-word;
    }
`;

export default function Mining() {
    const theme = useContext(ThemeContext);
    const history = useHistory();
    const [darkMode] = useDarkModeManager();
    const { t } = useTranslation();
    const hideSomething = true;
    const web3Provider = useActiveWeb3React();
    const { chainId, account } = web3Provider;
    const [web3, setWeb3] = useState(null);
    const [infoData, setInfoData] = useState<{
        amountOf24h: number,
        totalAmount: number,
        feeOf24h: number,
        totalFee: number,
        rebuyDestory: number,
        mintDogTokens: number,
        totalLiquidityUSD: string,
    }>({
        amountOf24h: 0,
        totalAmount: 0,
        feeOf24h: 0,
        totalFee: 0,
        rebuyDestory: 0,
        mintDogTokens: 0,
        totalLiquidityUSD: '',
        ...getLocalCacheOfGlobalData(),
    });
    const [platformTvl, setPlatformTvl] = useState(Number(getLocalCacheOfPlatformTvl()));
    const toggleWalletModal = useWalletModalToggle();
    // 代币合约
    const [dogContract, setDogContract] = useState<any>(null);
    const [minerContract, setMinerContract] = useState<any>(null);
    const userBalanceOfDog = useGetBalance(dogContract, account || '', false);
    const [resetHalvingPeriodEndDate, setResetHalvingPeriodEndDate] = useState<number>();
    const [leftTime, setLeftTime] = useState<string>(`-${t('day')} -${t('hour')} -${t('minute')} -${t('second')}`);
    // const platformBalanceOfDog = useGetBalance(dogContract, minerContract ? minerContract._address : '', false);

    // doge data
    const {
      dogTotalSupply,
      dogDestory,
      dogDestoryAmount,
      dogPerBlock,
    } = useGetDogData({
      web3,
      chainId,
    })

    // old board
    const {
      // boardAPY,
      boardTvl,
      // 本周待奖励金额
      weekPendingRewards,
    } = useGetBoardData({
      web3,
      chainId,
    });

    // board v2
    const {
      pools: boardV2Pools,
      boardAPY: boardV2Apy,
      boardTVL: boardV2Tvl,
    } =useGetMutiRewardsTokenPoolContract(account || '', web3, chainId);

    const APYConnectedInfo = useGetAPYConnectMinerInfo(web3, minerContract)
    const { poolCaculateInfo, dogInfo } = useGetPoolInfoWithTokenPrice(APYConnectedInfo, minerContract)
    // contract init
    useEffect(() => {
        if (web3 && chainId) {
            const minerContractInstance = getPoolContract(chainId, web3);
            const dogContractInstance = getDogContract(chainId, web3);
            setDogContract(dogContractInstance);
            setMinerContract(minerContractInstance);
        }
    }, [web3, chainId]);

    // web3 init
    useEffect(() => {
        if (web3Provider.library?.provider) {
            const web3 = initWeb3(web3Provider.library.provider);
            setWeb3(web3);
        }
    }, [web3Provider]);

    async function getGlobalDataFunc() {
        try {
            const res = await getGlobalData();
            if (res.oneDayVolumeUSD) {
                // 累计交易额 与 24h手续费
                const amountOf24h = new BigNumber(res.oneDayVolumeUSD);
                infoData.amountOf24h = amountOf24h.toNumber();                
                infoData.feeOf24h = amountOf24h.times(0.003).toNumber();
            }

            if (res.totalVolumeUSD) {
                // 总交易额 与总手续费 待回购手续费
                const totalAmount = new BigNumber(res.totalVolumeUSD);
                infoData.totalAmount = totalAmount.toNumber();
                infoData.totalFee = totalAmount.times(0.003).toNumber();
                infoData.rebuyDestory = totalAmount.times(0.003 * 0.9).toNumber();
            }

            if (res.totalLiquidityUSD) {
                infoData.totalLiquidityUSD = res.totalLiquidityUSD;
            }

            if (res.mintDogTokens) {
                const mint = Number(res.mintDogTokens);
                infoData.mintDogTokens = mint;
            }

            setLocalCacheOfGlobalData(infoData);

            setInfoData({
                ...infoData,
            });

        } catch(e) {
            console.error(e)
        }
    }

    const globalDataIntervalRef = useRef<any>();

    useEffect(() => {
        globalDataIntervalRef.current = setInterval(getGlobalDataFunc, 5000);
        return () => {
            if (globalDataIntervalRef.current) {
                clearInterval(globalDataIntervalRef.current);
            }
        }
    }, []);

    const pools = useMemo(() => {
        if (poolCaculateInfo) {
            const res = poolCaculateInfo.sort((a, b) => {
                const aApy = new BigNumber(a.realApy);
                const bApy = new BigNumber(b.realApy);
                return bApy.comparedTo(aApy);
            });
            return res.slice(0,4);
        }
        return [];
    }, [poolCaculateInfo]);

    const dogBalanceAmount = useMemo(() => {
        if (userBalanceOfDog && dogInfo && dogInfo.price) {
            return userBalanceOfDog.dividedBy(new BigNumber(10).pow(18)).times(dogInfo.price).toNumber();
        }
        return 0;
    }, [userBalanceOfDog, dogInfo])

    // const platformDogBalanceAmount = useMemo(() => {
    //     if (platformBalanceOfDog && dogInfo && dogInfo.price) {
    //         return platformBalanceOfDog.dividedBy(new BigNumber(10).pow(18)).times(dogInfo.price).toNumber();
    //     }
    //     return 0;
    // }, [platformBalanceOfDog, dogInfo])

    useEffect(() => {
        let amount = new BigNumber(infoData.totalLiquidityUSD || 0).plus(boardTvl).plus(boardV2Tvl);
        const isPoolCaculatedComplete = poolCaculateInfo && poolCaculateInfo.length === poolCaculateInfo.filter((item) => item.caculated).length;
        if (isPoolCaculatedComplete && poolCaculateInfo.length > 0) {
            for (let i = 0, len = poolCaculateInfo.length; i < len; i++) {
                const pool = poolCaculateInfo[i];
                if (pool.poolType === 0) {
                    amount = amount.plus(pool.realTvl);
                }
            }
            const res = amount.toNumber()
            if (res) {
              setLocalCacheOfPlatformTvl(res)
              setPlatformTvl(res)
            }
        }
    }, [poolCaculateInfo, infoData.totalLiquidityUSD, boardTvl, boardV2Tvl])

    const mintTokenPrice = useMemo(() => {
        if (infoData.mintDogTokens && dogInfo && dogInfo.price) {
            return infoData.mintDogTokens * dogInfo.price;
        }
        return 0;
    }, [infoData.mintDogTokens, dogInfo]);

    const rebuyFee = useMemo(() => {
      const reyBuyDestory = infoData ? infoData.rebuyDestory : 0;

      return reyBuyDestory - (weekPendingRewards || 0) - (dogDestoryAmount || 0);
    }, [infoData, weekPendingRewards, dogDestoryAmount])

    const totalTokenStakedAddress = useMemo(() => {
      let amount = 0;
      // const isPoolCaculatedComplete = poolCaculateInfo && poolCaculateInfo.length === poolCaculateInfo.filter((item) => item.caculated).length;
      if (poolCaculateInfo.length > 0) {
          for (let i = 0, len = poolCaculateInfo.length; i < len; i++) {
              const pool = poolCaculateInfo[i];
              if (pool.poolType === 0 && pool.address) {
                  amount = amount + pool.address;
              }
          }
      }

      return amount || t('caculating');
    }, [poolCaculateInfo]);

    const boardV2PoolsName = useMemo(() => {
      const name = boardV2Pools
      .filter((item) => 
        item.rewardToken.toLowerCase() !== DOGE_TOKEN.toLowerCase()
      )
      .map(item => item.symbol)
      .join(',');
      return `ORIE,${name}`
    }, [boardV2Pools]);
    async function getLeftBlockNumber() {
      try {
        if (web3) {
          const currentBlockNumber = await (web3 as any).eth.getBlockNumber();
          const halvingCycle = 489599;
          const startBlock = 3284000;
          const currentPeriodPassBlocks = (currentBlockNumber - startBlock) % halvingCycle;
          const leftBlockNumOfReset = halvingCycle - currentPeriodPassBlocks;
          setResetHalvingPeriodEndDate(new Date().getTime() + leftBlockNumOfReset * 3 * 1000);
        }
      } catch(e) {
        console.error();
      }
    }

    useEffect(() => {
      if (web3 && chainId === 128) {
        getLeftBlockNumber()
      }
    }, [web3, chainId]);

    useEffect(() => {
      let interval: any;
      if (resetHalvingPeriodEndDate) {
        interval = setInterval(() => {
          const now =  moment();
          const end = moment(resetHalvingPeriodEndDate);
          const diff = end.diff(now);
          if (end > now && diff) {
            let time = '';
            const momentDiff = moment.duration(diff);
            const days = momentDiff.days() >= 10 ? momentDiff.days() : `0${momentDiff.days()}`;
            const hours = momentDiff.hours() >= 10 ? momentDiff.hours() : `0${momentDiff.hours()}`;
            const minutes = momentDiff.minutes() >= 10 ? momentDiff.minutes() : `0${momentDiff.minutes()}`;
            const seconds = momentDiff.seconds() >= 10 ? momentDiff.seconds() : `0${momentDiff.seconds()}`;

            time = `${days} ${t('day')} ${hours} ${t('hour')} ${minutes} ${t('minute')} ${seconds} ${t('second')}`;
            setLeftTime(time);
          } else {
            setLeftTime(`00 ${t('day')} 00 ${t('hour')} 00 ${t('minute')} 00 ${t('second')}`);
            clearInterval(interval);
            interval = null;
          }
        }, 1000);
      }

      return () => {
        if (interval) {
          clearInterval(interval);
        }
      }
    }, [resetHalvingPeriodEndDate]);

    return (
      <AppBody style={{ background: 'transparent', boxShadow: 'none' }}>
        <BoardRoomWrapper>
          <PlatformTvl>
            {t('platformTvl')}
            <br />
            <span>$</span>
            {platformTvl ? <Value value={platformTvl} /> : <span>--</span>}
          </PlatformTvl>
          <BoardRoomItemWapper>
            <BoardItemImage src={BoardPriceImg} />
            <NormalText>{t('currentPrice')}</NormalText>
            <BoardNumber>
              $<Value value={dogInfo ? dogInfo.price : 0} />
            </BoardNumber>
          </BoardRoomItemWapper>
          <BoardRoomItemWapper>
            <BoardItemImage src={BoardWalletImg} />
            <NormalText>{t('dogBalance')}</NormalText>
            <BoardNumber>
              {!account ? (
                <View onClick={toggleWalletModal}>{t('view')}</View>
              ) : (
                <>
                  $<Value value={dogBalanceAmount} />
                </>
              )}
            </BoardNumber>
          </BoardRoomItemWapper>
          {/* <BoardRoomItemWapper>
                    <BoardItemImage src={BoardMoneyImg} />
                    <NormalText>{t('pendingRewards')}</NormalText>
                    <BoardNumber>$<Value value={platformDogBalanceAmount} /></BoardNumber>
                </BoardRoomItemWapper> */}
          <BoardRoomItemWapper>
            <BoardItemImage src={BoardMoneyImg} />
            <NormalText>{t('currentOutput')}</NormalText>
            <BoardNumber>
              <Value value={infoData.mintDogTokens} />
              ORI
            </BoardNumber>
          </BoardRoomItemWapper>
          <BoardRoomItemWapper>
            <BoardItemImage src={BoardPanelImg} />
            <NormalText>{t('cuarrentMarketOutput')}</NormalText>
            <BoardNumber>
              $<Value value={mintTokenPrice} />
            </BoardNumber>
          </BoardRoomItemWapper>
          <BoardRoomItemWapper>
              <BoardItemImage src={BoardChartsImg} />
              <NormalText>{t('totalTokenStakedAddress')}</NormalText>
              <BoardNumber><Value value={totalTokenStakedAddress} decimals={0} /></BoardNumber>
          </BoardRoomItemWapper>
          {
            !hideSomething && (
              <BoardRoomItemWapper>
                <BoardItemImage src={BoardMoneyImg} />
                <NormalText>{t('totalRepurchaseDestruction')}</NormalText>
                <BoardNumber>
                  $<Value value={rebuyFee} />
                </BoardNumber>
              </BoardRoomItemWapper>
            )
          }
          {/* <BoardRoomItemWapper>
                    <BoardItemImage src={BoardChartsImg} />
                    <NormalText>{t('realTimeDeflationRate')}</NormalText>
                    <BoardNumber>$8.88</BoardNumber>
                </BoardRoomItemWapper> */}
          {!hideSomething && <BoardRoomButton>{t('boardRoom')}</BoardRoomButton>}
        </BoardRoomWrapper>
        <DogDataWrapper>
          <DogDataTitle fontWeight="bold" fontSize={16}>{t('dogData')}</DogDataTitle>
          <DogDataRow>
            <DogDataLabel fontSize={16}>{t('dogTotalSupply')}</DogDataLabel>
            <DogDataValue fontSize={16}>
              ≈
              <Value value={dogTotalSupply} />
            </DogDataValue>
          </DogDataRow>
          <DogDataRow>
            <DogDataLabel fontSize={16}>{t('dogTotalDestory')}</DogDataLabel>
            <DogDataValue fontSize={16}>
              <Value value={dogDestory} /> ORI
               ≈ $ 
              <Value value={dogDestoryAmount} />
            </DogDataValue>
          </DogDataRow>
          <DogDataRow>
            <DogDataLabel fontSize={16}>{t('dogNewBlock')}</DogDataLabel>
            <DogDataValue fontSize={16}>
              =
              <Value value={dogPerBlock} />
            </DogDataValue>
          </DogDataRow>
          <DogDataRow>
            <DogDataLabel fontSize={16}>ORI {t('halvingCycle')}</DogDataLabel>
              <DogDataValue fontSize={16}>
                {leftTime}
            </DogDataValue>
          </DogDataRow>
        </DogDataWrapper>
        <TableWrapper>
          <BoradTalbeTitle style={{ background: theme.primary7 }}>
            <span>{t('boardRoom')}</span>
            <span style={{cursor: 'pointer'}} onClick={() => {
                history.push('/board/v2')
              }}>{t('more')} &gt;</span>
          </BoradTalbeTitle>
          <TableBody>
            <BoardRow>
              <BoardLable fontSize={16}>{t('stake')}</BoardLable>
              <BoardValue fontSize={18}>
                ORI
              </BoardValue>
            </BoardRow>
            <BoardRow>
              <BoardLable fontSize={16}>APY</BoardLable>
              <BoardValue fontSize={18}>
                ≈&nbsp;<Value value={boardV2Apy} /> %
              </BoardValue>
            </BoardRow>
            <BoardRow style={{border: 'none'}}>
              <BoardLable fontSize={16} width="30%">{t('earning')}</BoardLable>
              <BoardValue fontSize={18} width="70%" className="breakWorld" textAlign="right">
                {boardV2PoolsName}
              </BoardValue>
            </BoardRow>
          </TableBody>
        </TableWrapper>
        {!hideSomething && (
          <>
            <SummaryCardWrapper>
              {/* {!darkMode && (<SummaryCardImg />)} */}
              <AutoColumn gap="md">
                <RowBetween>
                  <TYPE.white fontSize={18}>{t('currentOutput')}</TYPE.white>
                </RowBetween>
                <RowBetween>
                  <TYPE.white fontSize={32}>
                    <Value value={infoData.mintDogTokens} />
                  </TYPE.white>
                </RowBetween>
              </AutoColumn>
            </SummaryCardWrapper>
            <SummaryCardWrapper>
              {/* {!darkMode && (<SummaryCardImg />)} */}
              <AutoColumn gap="md">
                <RowBetween>
                  <TYPE.white fontSize={18}>{t('cuarrentMarketOutput')}</TYPE.white>
                </RowBetween>
                <RowBetween>
                  <TYPE.white fontSize={32}>
                    $<Value value={mintTokenPrice} />
                  </TYPE.white>
                </RowBetween>
              </AutoColumn>
            </SummaryCardWrapper>
          </>
        )}
        <TableWrapper>
          <BoradTalbeTitle style={{ background: theme.black }}>
            <span>{t('lpmining')}</span>
            <span
              style={{
                cursor: 'pointer'
              }}
              onClick={() => {
                history.push('/mining/lp')
              }}
            >
              {t('more')} &gt;
            </span>
          </BoradTalbeTitle>
          <TableBody>
            <TableRow style={{ border: 'none' }}>
              <TableColumn style={{ fontWeight: 'bold' }}>{t('stake')}</TableColumn>
              <TableColumn style={{ fontWeight: 'bold', textAlign: 'center' }}>{t('earned')}</TableColumn>
              <TableColumn style={{ fontWeight: 'bold', textAlign: 'right' }}>APY</TableColumn>
            </TableRow>
            {pools.length ? (
              pools.map((item, index) => (
                <TableRow key={index}>
                  <TableColumn>{`${item.tokenName0}${item.tokenName1 && `/${item.tokenName1}`}`}</TableColumn>
                  <TableColumn style={{ textAlign: 'center' }}>ORI</TableColumn>
                  <TableColumn style={{ textAlign: 'right' }}>
                    <Value value={item.realApy} />%
                  </TableColumn>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableColumn />
                <TableColumn style={{ textAlign: 'center' }}>{t('caculating')}</TableColumn>
                <TableColumn style={{ textAlign: 'right' }} />
              </TableRow>
            )}
          </TableBody>
        </TableWrapper>
        <FeeWrapper>
          <FeeRow>
            <TransLabel fontSize={16}>{t('24hoursTrans')}</TransLabel>
            <TransValue fontSize={18}>
              ≈$
              <Value value={infoData.amountOf24h} />
            </TransValue>
          </FeeRow>
          <FeeRow style={{ borderBottom: 'none' }}>
            <TransLabel fontSize={16}>{t('totalTrans')}</TransLabel>
            <TransValue fontSize={18}>
              ≈$
              <Value value={infoData.totalAmount} />
            </TransValue>
          </FeeRow>
        </FeeWrapper>
        <FeeWrapper>
          <FeeRow>
            <TransLabel fontSize={16}>{t('24hoursFee')}</TransLabel>
            <TransValue fontSize={18}>
              ≈$
              <Value value={infoData.feeOf24h} />
            </TransValue>
          </FeeRow>
          <FeeRow style={{ borderBottom: 'none' }}>
            <TransLabel fontSize={16}>{t('totalFee')}</TransLabel>
            <TransValue fontSize={18}>
              ≈$
              <Value value={infoData.totalFee} />
            </TransValue>
          </FeeRow>
        </FeeWrapper>
        <UseCaseWrapper>
          <AutoColumn gap="md" justify="center">
            <RowCenter>
              <TYPE.black fontSize={26}>{t('dogUseSenarios')}</TYPE.black>
            </RowCenter>
            <RowCenter>
              <UseCaseImage src={CycleImg} />
            </RowCenter>
            <RowCenter>
              <TYPE.black fontSize={20} fontWeight={300}>
                {t('repurchase')}
              </TYPE.black>
            </RowCenter>
            <RowCenter>
              <TYPE.black fontSize={22} fontWeight={300}>
                {t('repurchaseAndDestory')}
              </TYPE.black>
            </RowCenter>
            <RowCenter>
              <UseCaseImage src={RewardsImg} style={{ width: '62px', height: '70px' }} />
            </RowCenter>
            <RowCenter>
              <TYPE.black fontSize={20} fontWeight={300}>
                {t('rewards')}
              </TYPE.black>
            </RowCenter>
            <RowCenter>
              <TYPE.black fontSize={22} fontWeight={300}>
                {t('rewardsToPeople')}
              </TYPE.black>
            </RowCenter>
            <RowCenter>
              <UseCaseImage src={ChatImg} style={{ width: '60px', height: '58px' }} />
            </RowCenter>
            <RowCenter>
              <TYPE.black fontSize={20} fontWeight={300}>
                DAO
              </TYPE.black>
            </RowCenter>
            <RowCenter>
              <TYPE.black fontSize={22} fontWeight={300}>
                {t('communityVote')}
              </TYPE.black>
            </RowCenter>
          </AutoColumn>
        </UseCaseWrapper>
        <UseCaseWrapper>
          <AutoColumn gap="md" justify="center">
            <RowCenter>
              <TYPE.black fontSize={26}>{t('dogAuditAgency')}</TYPE.black>
            </RowCenter>
            <RowCenter>
              <UseCaseImage src={darkMode ? SlowMistDark : SlowMistLight} style={{ width: '140px' }} />
            </RowCenter>
          </AutoColumn>
        </UseCaseWrapper>
      </AppBody>
    )
}
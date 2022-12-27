/*eslint array-callback-return: ["error", { allowImplicit: true }]*/
import React, { useState,useCallback,useRef, useEffect, useMemo } from 'react';
import { ChevronRight } from 'react-feather';
import { useParams, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next'
import AppBody from '../AppBody';
import styled from 'styled-components';
import Row, {RowBetween} from '../../components/Row';
import { TYPE } from '../../theme';
import { Search } from 'react-feather';
import { NavLink } from 'react-router-dom';
// import RightItems from '../../components/RuleSlider';
// import FireImg from '../../assets/images/fire.png';
// import { TOKEN } from '../../constants/farm';
import initWeb3 from '../../hooks/init-web3';
import { useActiveWeb3React } from '../../hooks';
import * as utils from '../../data/farm';
import TokenImage from '../../components/TokenImage';
import useGetAPYConnectMinerInfo from '../../hooks/farm/useGetAPYConnectMinerInfo';
// import { getTokenPriceMockData } from '../../graphql/token-price';
import useGetPoolInfoWithTokenPrice from '../../hooks/use-get-poolInfo';
import moment from 'moment-timezone';
import useGetPidOfPool from '../../hooks/farm/useGetPidOfPool';
import { BigNumber } from 'bignumber.js';
import Value from '../../components/Value';
import { Tag } from 'antd';

const Wrapper = styled.div`
    padding:0 1rem;
`;

const ListWrapper = styled.div`
    background: ${({ theme }) => theme.bg1};
    border-radius: 1rem;
    overflow: hidden;
    border: none;
    width: cacl(100% - 1rem);

    .ant-collapse-header {
        outline: none;
    }
    
`;

const ItemContainer = styled.div`
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    justify-content: space-between;
    padding: 1.5rem 0;
    padding-right: 1rem;
    flex-direction: column;
    cursor: pointer;
    border-bottom: 1px solid ${({ theme }) => theme.borderColor3};

    &.borderRow:last-child {
        border-bottom: none;
    }
`;

const HeaderRow = styled(Row)`
    height: 1.5rem;
    box-sizing: border-box;
    width: 100%;
    padding: 0 1rem;
    justify-content: space-between;
`;

const OrangeText = styled(TYPE.orange)`
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
`;

const SearchWrapper = styled.div`
    position: relative;
    width: 100%;
    padding-bottom: 2rem;
    display: flex;
    align-items: center;
`;

const SearchButton = styled(NavLink)`
    padding: 0.5rem 1.5rem;
    /* height: 2.4rem; */
    font-size: 0.75rem;
    min-height: 2rem;
    border-radius: 1rem;
    text-align:center;
    text-decoration: none;
    margin-right: 0.5rem;
    width: 30%;
    flex-shrink: 0;
    border: 1px solid ${({ theme }) => theme.primary9};
    color: ${({ theme }) => theme.primary9};

    &:focus {
        border: 1px solid ${({ theme }) => theme.primary10};
        color: ${({ theme }) => theme.primary10};
    }
    &:hover {
        border: 1px solid ${({ theme }) => theme.primary10};
        color: ${({ theme }) => theme.primary10};
    }
    &.active {
        border: 1px solid ${({ theme }) => theme.primary10};
        color: ${({ theme }) => theme.primary10};
    }
    &:disabled {
        opacity: 50%;
        cursor: auto;
    }

    ${({ theme }) => theme.mediaWidth.upToSmall`
        padding: 0.5rem 1rem;
    `};
`;

const SearchInputWrapper = styled.div`
    position: relative;
    flex-grow: 1;
    height: 100%;
    margin-right: 1rem;
    color: ${({ theme }) => theme.primary9};
`;

const SearchInput = styled.input`
  position: relative;
  display: flex;
  padding: 16px;
  padding: 0.5rem 1rem;
  padding-right: 2.5rem;
  align-items: center;
  width: 100%;
  height: 2.2rem;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  border-radius: 20px;
  color: ${({ theme }) => theme.text1};
  border-style: solid;
  border: 1px solid ${({ theme }) => theme.primary9};
  -webkit-appearance: none;

  font-size: 12px;

  ::placeholder {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.primary9};
  }
`;

const SearchIcon = styled(Search)`
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
`;

// const Address = styled.div`

//     overflow: hidden;
//     text-overflow: ellipsis;
//     white-space: nowrap;
//     color: ${({ theme }) => theme.white};
//     background-color: ${({ theme }) => theme.primary7};
//     height: 2rem;
//     border-radius: 1rem;
//     margin-left: 0.5rem;
//     padding: 0.3rem 0.8rem;
// `;

const RightArrow = styled(ChevronRight)`
    position: absolute;
    right: 1%;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: ${({ theme }) => theme.text2};
`; 

// const RightFlag = styled.div`
//     position: absolute;
//     right: 0;
//     top: 0.5rem;
//     padding: 0.1rem 0.3rem;
//     font-size: 0.5rem;
//     color: ${({ theme }) => theme.white};
//     background-color: ${({ theme }) => theme.primary7};
// `;

const TextLabel = styled(TYPE.orange)`
    flex-shrink: 0;
    padding-right: 0.5rem;
`;

const TextValue = styled(TYPE.black)`
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
`;


// const Fire = styled.div`
//     position: absolute;
//     right: 0.6rem;
//     top: 0.4rem;
//     width: 2.25rem;
//     height: 2.25rem;
//     font-size: 10px;
//     padding-top: 0.9rem;
//     text-align: center;
//     background: url(${FireImg}) no-repeat;
//     background-position: center center;
//     background-size: 100% 100%;
//     color: ${({ theme }) => theme.white};
// `;
// const FireFlag = styled.div`
//     position: absolute;
//     right: 0.3rem;
//     top: 0.1rem;
//     width: 1rem;
//     height: 1rem;
//     font-size: 10px;
//     text-align: center;
//     border-radius: 0.5rem;
//     background: ${({ theme }) => theme.red1};
//     color: ${({ theme }) => theme.white};
// `;

const LefeTimeContainer = styled.div`
    display: block;
    padding: 1rem;
    width: 100%;
    background: ${({ theme }) => theme.bg1};
    border-radius: 1rem;
    margin-bottom: 16px;
`;

const lpEndDate = moment().set({
    year: 2021,
    month: 2,
    date: 26,
    hour: 16,
    minute: 0,
    second: 0,
}).tz('Asia/Singapore');
const singleEndDate = moment().set({
    year: 2021,
    month: 2,
    date: 26,
    hour: 18,
    minute: 0,
    second: 0,
}).tz('Asia/Singapore');

export default function MiningTable() {
    const { t } = useTranslation();
    const { type } = useParams<{
        type: string;
    }>();
    const isLp = type !== 'single'
    const history = useHistory();
    // console.log(poolInfos);
    const [filterValue, setFilterValue] = useState('');
    const timer = useRef<ReturnType<typeof setTimeout>>();
    const web3Provider = useActiveWeb3React();
    const { chainId } = web3Provider;
    const [web3, setWeb3] = useState(null);
    const [minerContract, setMinerContract] = useState<any>(null);
    const [lpFormateDate, setLpFormateDate] = useState('');
    const lpTimeRef = useRef<any>();
    const singleTimeRef = useRef<any>();
    const { fetchPid } = useGetPidOfPool(minerContract);
    const [singleFormateDate, setSingleFormateDate] = useState('');
    const APYConnectedInfo = useGetAPYConnectMinerInfo(web3, minerContract)
    const { poolInfos, poolCaculateInfo } = useGetPoolInfoWithTokenPrice(APYConnectedInfo, minerContract)

    // contract init
    useEffect(() => {
        if (web3 && chainId) {
            const minerContractInstance = utils.getPoolContract(chainId, web3);
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

    const onChange = useCallback(
        (newValue: string) => {
            if (timer.current) {
                clearTimeout(timer.current)
            }
            timer.current = setTimeout(() => {
                setFilterValue(newValue)
                timer.current = undefined
            }, 500)
        },
        []
    )
    
    async function goToFarm (address: string) {
        if (poolInfos) {
            const pool = poolInfos[address];
            if (pool) {
                history.push(`/farm/${type}/${pool.pid}/${address}`)
            }
        } else {
            const pid = await fetchPid(address);
            history.push(`/farm/${type}/${pid}/${address}`)
        }
    }

    // function getPoolModulusFlag(value: number) {
    //     return (
    //         <>
    //             <Fire>{value}X</Fire>
    //             {/* <FireFlag>3</FireFlag> */}
    //         </>
    //     )
    // }

    const listData = useMemo(() => {
        if (!poolCaculateInfo) return [];
        const reg = new RegExp(filterValue.toLowerCase());
        const poolType = isLp ? 1 : 0;
        return poolCaculateInfo.filter((item) => {
            return (reg.test(item.tokenName0.toLowerCase()) || (item.tokenName1 && reg.test(item.tokenName1.toLowerCase()))) && item.poolType === poolType;
        }).sort((a, b) => {
            return a.allocPoint > 0 && b.allocPoint > 0
              ? new BigNumber(b.realApy).toNumber() - new BigNumber(a.realApy).toNumber()
              : b.allocPoint - a.allocPoint
        })
    }, [poolCaculateInfo, filterValue, isLp]);

    function startLeftTimeInterval(isLp: boolean) {
        if (isLp) return undefined;
        if (!isLp) return undefined;
        return setInterval(() => {
            const now =  moment().tz('Asia/Singapore');
            const end = isLp ? lpEndDate : singleEndDate;
            const diff = end.diff(now);
            let time = '';
            if (diff > 0 && now < end) {
                const momentDiff = moment.duration(diff);
                const hours = momentDiff.hours() >= 10 ? momentDiff.hours() : `0${momentDiff.hours()}`;
                const minutes = momentDiff.minutes() >= 10 ? momentDiff.minutes() : `0${momentDiff.minutes()}`;
                const seconds = momentDiff.seconds() >= 10 ? momentDiff.seconds() : `0${momentDiff.seconds()}`;

                time = `${hours}: ${minutes}: ${seconds}`
            }
            if (isLp) {
                if (!time && lpTimeRef.current) {
                    clearInterval(lpTimeRef.current);
                    lpTimeRef.current = undefined;
                }
                setLpFormateDate(time);
            } else {
                if (!time && singleTimeRef.current) {
                    clearInterval(singleTimeRef.current);
                    singleTimeRef.current = undefined;
                }
                setSingleFormateDate(time);
            }
          }, 1000);
    }

    function renderLeftTime()  {
        if (isLp && lpFormateDate) {
            return (
                <LefeTimeContainer>
                    <Row justify="center">
                        <TYPE.orange fontSize={18}>{t('startMiningLeftTime')}{lpFormateDate}</TYPE.orange>
                    </Row>
                    <Row justify="center">
                        <TYPE.black textAlign="center">{t('lpMiningTimeStart')}</TYPE.black>
                    </Row>
                </LefeTimeContainer>
            )
        } else if (!isLp && singleFormateDate) {
            return (
                <LefeTimeContainer>
                    <Row justify="center">
                        <TYPE.orange fontSize={18}>{t('startMiningLeftTime')}{singleFormateDate}</TYPE.orange>
                    </Row>
                    <Row justify="center">
                        <TYPE.black textAlign="center">{t('singMiningTimeStart')}</TYPE.black>
                    </Row>
                </LefeTimeContainer>
            )
        }

        return null;
    }

    useEffect(() => {
        // lp
        lpTimeRef.current = startLeftTimeInterval(true);
        //single
        singleTimeRef.current = startLeftTimeInterval(false);

        return  () => {
            if (lpTimeRef.current) {
                clearInterval(lpTimeRef.current);
                lpTimeRef.current = undefined;
            }
            if (singleTimeRef.current) {
                clearInterval(singleTimeRef.current);
                singleTimeRef.current = undefined;
            }
        }
    }, []);

    function renderList() {
        if (!listData.length) {
            return (
                <ItemContainer className="borderRow">
                    {/*<TYPE.black>{t('loading')}</TYPE.black>*/}
                    <TYPE.black>{t('commingSoon')}</TYPE.black>
                </ItemContainer>
            )
        };
        if (isLp) {
            return listData.map((item, index) => (
              <ItemContainer className="borderRow" key={index} onClick={() => goToFarm(item.id)}>
                {item.allocPoint === 0 && (
                  <Tag
                    color="error"
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 10
                    }}
                  >
                    {t('unqualified')}
                  </Tag>
                )}
                <RightArrow />
                <HeaderRow>
                  <Row style={{ width: '35%' }}>
                    <TokenImage address={item.token0} />
                    <TokenImage address={item.token1 || ''} />
                  </Row>
                  <RowBetween style={{ width: '55%' }}>
                    <TextLabel>TVL:</TextLabel>
                    <TextValue>
                      $<Value value={item.realTvl} />
                    </TextValue>
                  </RowBetween>
                </HeaderRow>
                <HeaderRow style={{ marginTop: '0.6rem' }}>
                  <RowBetween style={{ width: '35%' }}>
                    <OrangeText>{`${item.tokenName0}-${item.tokenName1}`}</OrangeText>
                  </RowBetween>
                  <RowBetween style={{ width: '55%' }}>
                    <TextLabel>APY:</TextLabel>
                    <TextValue>
                      <Value value={item.realApy} />%
                    </TextValue>
                  </RowBetween>
                </HeaderRow>
              </ItemContainer>
            ))
        } else {
            return listData.map((item, index) => (
              <ItemContainer className="borderRow" key={index} onClick={() => goToFarm(item.id)}>
                {item.allocPoint === 0 && (
                  <Tag
                    color="error"
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 10
                    }}
                  >
                    {t('unqualified')}
                  </Tag>
                )}
                <RightArrow />
                <HeaderRow>
                  <RowBetween style={{ width: '25%' }}>
                    <TokenImage address={item.token0} />
                  </RowBetween>
                  <RowBetween style={{ width: '60%' }}>
                    <TextLabel>TVL:</TextLabel>
                    <TextValue>
                      {item.realTvl > 0 ? (
                        <>
                          $<Value value={item.realTvl} />
                        </>
                      ) : (
                        t('untracked')
                      )}
                    </TextValue>
                  </RowBetween>
                  <Row style={{ width: '15%' }} />
                </HeaderRow>
                <HeaderRow style={{ marginTop: '0.6rem' }}>
                  <RowBetween style={{ width: '25%' }}>
                    <OrangeText>{item.tokenName0}</OrangeText>
                  </RowBetween>
                  <RowBetween style={{ width: '60%' }}>
                    <TextLabel>APY:</TextLabel>
                    <TextValue>
                      {item.realApy > 0 ? (
                        <>
                          <Value value={item.realApy} />%
                        </>
                      ) : (
                        t('untracked')
                      )}
                    </TextValue>
                  </RowBetween>
                  <Row style={{ width: '15%' }} />
                </HeaderRow>
                <HeaderRow style={{ marginTop: '0.6rem' }}>
                  <Row style={{ width: '25%' }} />
                  <RowBetween style={{ width: '60%' }}>
                    <TextLabel>地址数:</TextLabel>
                    <TextValue>
                      <Value value={item.address || 0} decimals={0} />
                    </TextValue>
                  </RowBetween>
                  <Row style={{ width: '15%' }} />
                </HeaderRow>
              </ItemContainer>
            ))
        }
    }

    return (
        <AppBody style={{ marginTop: '1rem', background: 'transparent', boxShadow: 'none'}}>
            <Wrapper>
                {/*<RightItems isLp={isLp} />*/}
                <SearchWrapper>
                    <SearchButton className={isLp ? 'active' : ''} to={'/mining/lp'}>{t('lpTab')}</SearchButton>
                    <SearchButton className={!isLp ? 'active' : ''} to={'/mining/single'}>{t('singleCurrency')}</SearchButton>
                    <SearchButton className='' to={'/mining/nft'}>{t('nftTab')}</SearchButton>
                    <SearchInputWrapper>
                        <SearchInput placeholder={t('search')} onChange={(e) => {
                            onChange(e.currentTarget.value);
                        }} />
                        <SearchIcon />
                    </SearchInputWrapper>
                </SearchWrapper>
                {renderLeftTime()}
                <ListWrapper>
                    {renderList()}
                </ListWrapper>
            </Wrapper>
        </AppBody>   
    );
}
import { ChainId, TokenAmount } from '@uniswap/sdk'
import React, { useState } from 'react'
import { Text } from 'rebass'
import { NavLink, useLocation } from 'react-router-dom'
import { darken } from 'polished'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import ChartsImg from '../../assets/images/nav-icon/charts.png';
import Logo from '../../assets/svg/logo.png'
import LogoDark from '../../assets/svg/logo_white.png'
import { useActiveWeb3React } from '../../hooks'
import { useDarkModeManager } from '../../state/user/hooks'
import { useETHBalances, useAggregateUniBalance } from '../../state/wallet/hooks'
import { CardNoise } from '../earn/styled'
import { CountUp } from 'use-count-up'
import { TYPE, ExternalLink } from '../../theme'
import { ButtonPrimary } from '../../components/Button';

import { YellowCard } from '../Card'
import { Moon, Sun, Menu as MenuIcon } from 'react-feather'
import Menu from '../Menu'
import LanguageMenu from '../LanguageMenu'

import Row, { RowFixed } from '../Row'
import Web3Status from '../Web3Status'
// import ClaimModal from '../claim/ClaimModal'
import { useToggleSelfClaimModal, useShowClaimPopup } from '../../state/application/hooks'
import { useUserHasAvailableClaim } from '../../state/claim/hooks'
import { useUserHasSubmittedClaim } from '../../state/transactions/hooks'
import { Dots } from '../swap/styleds'
import Modal from '../Modal'
import UniBalanceContent from './UniBalanceContent'
import usePrevious from '../../hooks/usePrevious'
import { isETFChain } from 'utils'
import NavDrawer from './NavDrawer';
import CommingSoonModal from '../Modal/v2';
import DogAirDropModal from './DogAirDropModal';
// import AddDogToMetaMask from '../AddDogToMetaMask';

const HeaderFrame = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  border-bottom: 1px solid ${({theme}) => theme.borderColor1};
  padding: 1rem;
  z-index: 2;
  background-color: ${({ theme }) => theme.bg6};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    padding: 0 1rem;
    width: calc(100%);
    position: relative;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        padding: 0.5rem 1rem;
  `}
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    width: 100%;
    padding: 1rem;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    z-index: 99;
    height: 72px;
    border-radius: 12px 12px 0 0;
    background-color: ${({ theme }) => theme.bg1};
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
   flex-direction: row-reverse;
    align-items: center;
  `};
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;
`

const HeaderRow = styled(RowFixed)`
  ${({ theme }) => theme.mediaWidth.upToSmallMedium`
      width: 100%;
      justify-content: space-between;
  `};

  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 100%;
  `};
`

const HeaderLinks = styled(Row)`
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem 0 1rem 1rem;
    justify-content: flex-end;
`};
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;

  :focus {
    border: 1px solid blue;
  }
`

const DOGAmount = styled(AccountElement)`
  color: white;
  padding: 4px 8px;
  height: 36px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.bg3};
  background: radial-gradient(174.47% 188.91% at 1.84% 0%, #f0791c 0%, #2172e5 100%), #edeef2;
`

const DOGWrapper = styled.span`
  width: fit-content;
  position: relative;
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }

  :active {
    opacity: 0.9;
  }
`

const HideSmallMedium = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmallMedium`
    display: none;
  `};
`;

const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`
const ShowSmallMedium = styled.span`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToSmallMedium`
    display: block;
  `};
`

const ShowSmall = styled.span`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: block;
  `};
`

const NetworkCard = styled(YellowCard)`
  border-radius: 12px;
  padding: 8px 12px;
  color: ${({theme}) => theme.white};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0;
    margin-right: 0.5rem;
    width: initial;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
  `};
  ${({ theme }) => theme.mediaWidth.upToExtraLarge`
    background: ${({ theme }) => theme.bg8};
  `};
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  :hover {
    cursor: pointer;
  }
`

const UniIcon = styled.div`
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text6};
  font-size: 1rem;
  width: fit-content;
  margin: 0 8px;
  font-weight: 500;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.white};
  }

  :hover,
  :focus {
    color: ${({ theme }) => theme.white};
  }
`

const StyledExternalLink = styled(ExternalLink).attrs({
  activeClassName
})<{ isActive?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text6};
  font-size: 1rem;
  width: fit-content;
  margin: 0 8px;
  font-weight: 500;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.white};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.white)};
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      // display: none;
`}
`
const SwitchLanguage = styled.a`
  margin: 0 8px;
	font-size: 0.8rem;
	font-weight: normal;
	font-stretch: normal;
  width: fit-content;
  cursor: pointer;
	color: ${({ theme }) => theme.text6};
`

export const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg3};
  margin-left: 8px;
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }
  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`;

const NavIcon = styled(MenuIcon)`
    display: none;
    width: 1.6rem;
    height: 1.6rem;
    color: ${({ theme }) => theme.white};
    ${({ theme }) => theme.mediaWidth.upToSmallMedium`
        display: block;
    `};
`; 

const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.ROPSTEN]: 'Ropsten',
  [ChainId.GÖRLI]: 'Görli',
  [ChainId.KOVAN]: 'Kovan',
  [ChainId.HECOTESTNET]: 'HecoTest',
  [ChainId.HECOMAINNET]: 'Heco',
  [ChainId.ETHF]: 'EthereumFair'
}

/*const CommingSoonLink = styled.div`
    ${({ theme }) => theme.flexRowNoWrap}
    align-items: left;
    border-radius: 3rem;
    outline: none;
    cursor: pointer;
    text-decoration: none;
    color: ${({ theme }) => theme.text6};
    font-size: 1rem;
    width: fit-content;
    margin: 0 8px;
    font-weight: 500;
    
    :hover,
    :focus {
      color: ${({ theme }) => theme.white};
    }
`;*/

/*const CommingSoonButon = ({
    children,
    onClick,
}: {
    children: React.ReactNode;
    onClick?(): void;
}) => {
    return (
        <CommingSoonLink onClick={onClick}>{children}</CommingSoonLink>
    )
}*/

const ImgIcon = styled.img`
    width: 1.3rem;
    height: 1.3rem;
    margin-right: 0.5rem;
    cursor: pointer;
`;

const DogButton = styled(ButtonPrimary)`
    padding: 8px 12px;
    border-radius: 12px;
    ${({ theme }) => theme.mediaWidth.upToSmall`
        margin-left: 0;
    `};
`;

const SwapOrAddLiquidtyPathRegx = /(\/swap$)|(\/add\/.*)/;

export default function Header() {
  const [commingSoonVisible, setCommingSoonVisible] = useState(false);
  const { account, chainId } = useActiveWeb3React()
  const { t, i18n } = useTranslation()
  const [airdropModalVisible, setAirdropVisible] = useState(false)
  const location = useLocation();
  const isSwapOrAddLiquidtyPath = SwapOrAddLiquidtyPathRegx.test(location.pathname)

  // TODO: hide something of header, will update on the future
  const hideSomething = true

  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  // const [isDark] = useDarkModeManager()
  const [darkMode, toggleDarkMode] = useDarkModeManager()

  const toggleClaimModal = useToggleSelfClaimModal()

  const availableClaim: boolean = useUserHasAvailableClaim(account)

  const { claimTxn } = useUserHasSubmittedClaim(account ?? undefined)

  const aggregateBalance: TokenAmount | undefined = useAggregateUniBalance()

  const [showUniBalanceModal, setShowUniBalanceModal] = useState(false)
  const [showSlider, setShowSlider] = useState(false);
  const showClaimPopup = useShowClaimPopup()

  const countUpValue = aggregateBalance?.toFixed(0) ?? '0'
  const countUpValuePrevious = usePrevious(countUpValue) ?? '0'

  const isEnglish = i18n.language === 'en-US'

  function switchLng() {
    i18n.changeLanguage(isEnglish ? 'zh-CN' : 'en-US');
  }

  return (
    <HeaderFrame>
      {/* <ClaimModal /> */}
      <Modal isOpen={showUniBalanceModal} onDismiss={() => setShowUniBalanceModal(false)}>
        <UniBalanceContent setShowUniBalanceModal={setShowUniBalanceModal} />
      </Modal>
      <HeaderRow>
        <Title href="#">
          <StyledNavLink 
              id={`homepage`}
              to='/swap'>
              <UniIcon>
                <img width={'48px'} src={darkMode ? LogoDark : Logo} alt="logo" />
              </UniIcon>
            </StyledNavLink>
        </Title>
        <HideSmallMedium>
          <HeaderLinks>
           {/* <StyledNavLink id={`home-nav`} to={'/homepage'}>
              {t('homepage')}
            </StyledNavLink>*/}
            <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
              {t('swap')}
            </StyledNavLink>
            <StyledNavLink
              id={`pool-nav-link`}
              to={'/pool'}
              isActive={(match, { pathname }) =>
                Boolean(match) ||
                pathname.startsWith('/add') ||
                pathname.startsWith('/remove') ||
                pathname.startsWith('/create') ||
                pathname.startsWith('/find')
              }
            >
              {t('pool')}
            </StyledNavLink>
            <StyledNavLink 
              id={`lp-mining`} 
              isActive={(match, { pathname }) =>
                Boolean(match) ||
                pathname.startsWith('/mining')
              }
              to={'/mining/lp'}>
              {t('lpmining')}
            </StyledNavLink>
           {/* <StyledNavLink
              id={`lp-mining`} 
              isActive={(match, { pathname }) =>
                Boolean(match) ||
                pathname.startsWith('/board')
              }
              to={'/board/v2'}>
              {t('boardRoom')}
            </StyledNavLink>*/}
            {/* <CommingSoonButon onClick={() => {setCommingSoonVisible(true)}}>{t('lpmining')}</CommingSoonButon> */}
            {/* <CommingSoonButon onClick={() => {setCommingSoonVisible(true)}}>{t('boardRoom')}</CommingSoonButon> */}
          {/*  <StyledNavLink
              id={`lp-mining`} 
              isActive={(match, { pathname }) =>
              Boolean(match) ||
              pathname.startsWith('/nftmarket')
            }
              to={'/nftmarket'}>
              {t('navNftMarket')}
            </StyledNavLink>*/}
{/*
            <CommingSoonButon onClick={() => {setCommingSoonVisible(true)}}>{t('crossChainSwap')}</CommingSoonButon>
*/}
            <StyledExternalLink id={`stake-nav-link`} href={'https://info.oriswap.xyz'}>
              {t('info')} <span style={{ fontSize: '11px' }}>↗</span>
            </StyledExternalLink>
            <SwitchLanguage
              id={`swap-nav-language`}
              onClick={() => {
                switchLng()
              }}
            >
              {isEnglish ? '中文' : 'English'}
            </SwitchLanguage>
            {!hideSomething && (
              <>
                <StyledNavLink id={`stake-nav-link`} to={'/uni'}>
                  DOG
                </StyledNavLink>
                <StyledNavLink id={`stake-nav-link`} to={'/vote'}>
                  Vote
                </StyledNavLink>
              </>
            )}
          </HeaderLinks>
        </HideSmallMedium>
        <ShowSmallMedium>
          <HeaderLinks>
            {
              isSwapOrAddLiquidtyPath && (
                <StyledExternalLink style={{color: 'white'}} id={`stake-nav-link`} href={'https://info.oriswap.xyz'}>
                  <ImgIcon src={ChartsImg} />
                </StyledExternalLink>
              )
            }
            <NavIcon onClick={() => {
              setShowSlider(true);
            }} />
          </HeaderLinks>
          
        </ShowSmallMedium>
        
      </HeaderRow>
      <HeaderControls>
        <HeaderElement>
          {/*<HideSmall>
            <AddDogToMetaMask />
          </HideSmall>*/}
          <HideSmall>
            {chainId && NETWORK_LABELS[chainId] && (
              <NetworkCard title={NETWORK_LABELS[chainId]}>{NETWORK_LABELS[chainId]}</NetworkCard>
            )}
          </HideSmall>
          {!hideSomething && (
            <>
              {availableClaim && !showClaimPopup && (
                <DOGWrapper onClick={toggleClaimModal}>
                  <DOGAmount active={!!account && !availableClaim} style={{ pointerEvents: 'auto' }}>
                    <TYPE.white padding="0 2px">
                      {claimTxn && !claimTxn?.receipt ? <Dots>Claiming ORI</Dots> : 'Claim ORI'}
                    </TYPE.white>
                  </DOGAmount>
                  <CardNoise />
                </DOGWrapper>
              )}
              {!availableClaim && aggregateBalance && (
                <DOGWrapper onClick={() => setShowUniBalanceModal(true)}>
                  <DOGAmount active={!!account && !availableClaim} style={{ pointerEvents: 'auto' }}>
                    {account && (
                      <HideSmall>
                        <TYPE.white
                          style={{
                            paddingRight: '.4rem'
                          }}
                        >
                          <CountUp
                            key={countUpValue}
                            isCounting
                            start={parseFloat(countUpValuePrevious)}
                            end={parseFloat(countUpValue)}
                            thousandsSeparator={','}
                            duration={1}
                          />
                        </TYPE.white>
                      </HideSmall>
                    )}
                    ORI
                  </DOGAmount>
                  <CardNoise />
                </DOGWrapper>
              )}
            </>
          )}
         {/* <HideSmall>
            {
              account && (
                <DogButton onClick={() => {setAirdropVisible(true)}}>ORI</DogButton>
              )
            }
          </HideSmall>*/}
          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            {account && userEthBalance ? (
              <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                {userEthBalance?.toSignificant(4)} {chainId && isETFChain(chainId) ? 'ETHF' : 'ETH'}
              </BalanceText>
            ) : null}
            <Web3Status />
          </AccountElement>
        </HeaderElement>
        <HeaderElementWrap>
          <HideSmall>
              <div style={{display: "flex"}}>
                <StyledMenuButton onClick={() => toggleDarkMode()}>
                        {darkMode ? <Moon size={20} /> : <Sun size={20} />}
                  </StyledMenuButton>
                  <Menu />
              </div>
          </HideSmall>
          <ShowSmall>
            {
              account && (
                <DogButton onClick={() => {setAirdropVisible(true)}}>ORI</DogButton>
              )
            }
          </ShowSmall>
          {!hideSomething && (
            <>
                <LanguageMenu />
            </>
          )}
        </HeaderElementWrap>
      </HeaderControls>
      <NavDrawer visible={showSlider} onClose={() => {
        setShowSlider(false);
      }} />
      <CommingSoonModal visible={commingSoonVisible} title={t('tips')} onClose={() => {setCommingSoonVisible(false)}} >
            <TYPE.black  fontSize={25} textAlign="center">{t('commingSoon')}</TYPE.black>
      </CommingSoonModal>
      {
        account && (
          <DogAirDropModal visible={airdropModalVisible} onClose={() => {setAirdropVisible(false)}} />
        )
      }
    </HeaderFrame>
  )
}

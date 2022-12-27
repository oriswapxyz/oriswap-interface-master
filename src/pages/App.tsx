import React, { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Route, Switch } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
import styled from 'styled-components'
import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'
import AddressClaimModal from '../components/claim/AddressClaimModal'
import Header from '../components/Header'
import Polling from '../components/Header/Polling'
import URLWarning from '../components/Header/URLWarning'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import { ApplicationModal } from '../state/application/actions'
import { useModalOpen, useToggleModal } from '../state/application/hooks'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'
import AddLiquidity from './AddLiquidity'
import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure,
  RedirectToAddLiquidity
} from './AddLiquidity/redirects'
import Earn from './Earn'
import Manage from './Earn/Manage'
import MigrateV1 from './MigrateV1'
import MigrateV1Exchange from './MigrateV1/MigrateV1Exchange'
import RemoveV1Exchange from './MigrateV1/RemoveV1Exchange'
import Pool from './Pool'
import PoolFinder from './PoolFinder'
import RemoveLiquidity from './RemoveLiquidity'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'
import Swap from './Swap'
import { OpenClaimAddressModalAndRedirectToSwap, RedirectPathToSwapOnly, RedirectToSwap } from './Swap/redirects'
import Vote from './Vote'
import VotePage from './Vote/VotePage'
import DogeBackgroundImage from '../assets/images/dog-bg-2.png';
import { useDarkModeManager } from '../state/user/hooks'
// import { ExternalLink } from '../theme'
// import WechatHelperImg from '../assets/images/wechat_helper.png';
import HomePage from './HomePage';
import Board from './Board';
import BoardV2 from './BoardV2';
import MiningTable from './MiningTable';
import Farm from './Farm';
import client from '../graphql';
import NftMarket from './NftMarket';

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
`
const Introduce = styled.div`
  position: relative;
  min-height: 5.5rem;
  width: 100%;
  padding: 1rem 2rem;
  padding-bottom: 3.5rem;
  color: ${({ theme }) => theme.white};
  background-color: ${({ theme }) => theme.bg6};
  font-size: 1rem;
	font-weight: normal;
	font-stretch: normal;
	line-height: 1.5rem;
  z-index: 0;
  text-align: center;
`;

const DogeImage = styled.div`
  position: absolute;
  left:0;
  right: 0;
  top: 0;
  bottom: 0;
  background: url(${DogeBackgroundImage});
  background-position: right;
  background-size: auto 100%;
  background-repeat: no-repeat;
  z-index: -1;
`;

const Marginer = styled.div`
  margin-top: 5rem;
`

// const FooterWrapper = styled.div`
//   width: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   z-index: 0;
//   padding-bottom: 40px;
//   ${({ theme }) => theme.mediaWidth.upToSmall`
//     position: relative;
//     bottom: 0;
//     margin-top: -4rem;
//     padding-bottom: 80px;
//   `};
// `;

// const FooterNavLink = styled(ExternalLink)`
//   font-size: 0.75rem;
//   color: ${({theme}) => theme.text2};
//   text-decoration: none;
//   margin: 0 0.75rem;
// `;

function TopLevelModals() {
  const open = useModalOpen(ApplicationModal.ADDRESS_CLAIM)
  const toggle = useToggleModal(ApplicationModal.ADDRESS_CLAIM)
  return <AddressClaimModal isOpen={open} onDismiss={toggle} />
}

// function Footer() {
//   const { t } = useTranslation();

//   return (
//     <FooterWrapper>
//         <FooterNavLink href="https://twitter.com/dogeswap_fans" target="_blank">Twitter</FooterNavLink>
//         <FooterNavLink href="https://medium.com/@dogeswap_fans" target="_blank">Medium</FooterNavLink>
//         <FooterNavLink href="https://t.me/dogeswap_en" target="_blank">Telegram</FooterNavLink>
//         <FooterNavLink href={WechatHelperImg} target="_blank">{t('wechatAssistant')}</FooterNavLink>
//     </FooterWrapper>
//   )
// };

const Desc = styled.p`
  width: 100%;
  text-align: center;
  font-size: 0.75rem;
  box-sizing: border-box;
`

export default function App() {
  const { t } = useTranslation();
  const [darkMode] = useDarkModeManager()
  return (
    <ApolloProvider client={client}>
      <Suspense fallback={null}>
        <Route component={GoogleAnalyticsReporter} />
        <Route component={DarkModeQueryParamReader} />
        <AppWrapper>
          <URLWarning />
          <HeaderWrapper>
            <Header />
          </HeaderWrapper>
          <BodyWrapper>
            <Introduce>
              {!darkMode && <DogeImage />}
              <Desc>{t('platformInfo')}</Desc>
            </Introduce>
            <Popups />
            <Polling />
            <TopLevelModals />
            <Web3ReactManager>
              <Switch>
                <Route exact strict path="/swap" component={Swap} />
                <Route exact strict path="/claim" component={OpenClaimAddressModalAndRedirectToSwap} />
                <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
                <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
                <Route exact strict path="/find" component={PoolFinder} />
                <Route exact strict path="/pool" component={Pool} />
                <Route exact strict path="/uni" component={Earn} />
                <Route exact strict path="/vote" component={Vote} />
                <Route exact strict path="/create" component={RedirectToAddLiquidity} />
                <Route exact path="/add" component={AddLiquidity} />
                <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
                <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
                <Route exact path="/create" component={AddLiquidity} />
                <Route exact path="/create/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
                <Route exact path="/create/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
                <Route exact strict path="/remove/v1/:address" component={RemoveV1Exchange} />
                <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
                <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />
                <Route exact strict path="/migrate/v1" component={MigrateV1} />
                <Route exact strict path="/migrate/v1/:address" component={MigrateV1Exchange} />
                <Route exact strict path="/uni/:currencyIdA/:currencyIdB" component={Manage} />
                <Route exact strict path="/vote/:id" component={VotePage} />
                <Route exact path="/homepage" component={HomePage} />
                <Route exact path="/board" component={Board} />
                <Route exact path="/board/v2" component={BoardV2} />
                <Route exact path="/farm/:type/:pid/:pairOrTokenAddress" component={Farm} />
                <Route exact path="/mining/:type" component={MiningTable} />
                <Route exact path="/nftmarket" component={NftMarket} />
                <Route component={RedirectPathToSwapOnly} />
              </Switch>
            </Web3ReactManager>
            <Marginer />
          </BodyWrapper>
        </AppWrapper>
      </Suspense>
    </ApolloProvider>
  )
}

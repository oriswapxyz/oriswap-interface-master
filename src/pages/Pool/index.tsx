import React, { useContext, useMemo } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Pair, JSBI } from '@uniswap/sdk'
import { Link } from 'react-router-dom'
import { SwapPoolTabs } from '../../components/NavigationTabs'

import FullPositionCard from '../../components/PositionCard'
import { useUserHasLiquidityInAllTokens } from '../../data/V1'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { StyledInternalLink, ExternalLink, TYPE } from '../../theme'
import { Text } from 'rebass'
import Card from '../../components/Card'
import { RowBetween, RowFixed } from '../../components/Row'
import { ButtonPrimary, ButtonSecondary } from '../../components/Button'
import { AutoColumn } from '../../components/Column'

import { useActiveWeb3React } from '../../hooks'
import { usePairs } from '../../data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import { Dots } from '../../components/swap/styleds'
import { CardNoise, CardBGImage } from '../../components/earn/styled'
import { useStakingInfo } from '../../state/stake/hooks'
import { BIG_INT_ZERO } from '../../constants'
import { isETFChain } from 'utils'
import { useTranslation } from 'react-i18next'
import AppBody from '../AppBody'

const ButtonRow = styled(RowFixed)`
  gap: 2rem;
  width: 100%;
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    gap: 8px;
    width: 100%;
    flex-direction: row-reverse;
  `};
`

const ResponsiveButtonPrimary = styled(ButtonPrimary)`
  width: fit-content;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 46%;
    margin-right: 1rem;
  `};
`

const ResponsiveButtonSecondary = styled(ButtonSecondary)`
  width: fit-content;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 46%;
  `};
`

const EmptyProposals = styled.div`
  border: 1px solid ${({ theme }) => theme.text4};
  padding: 16px 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const StyledPoolHeader = styled.div`
  padding: 0.5rem 0;
  width: 100%;
  max-width: 420px;

  color: ${({ theme }) => theme.text2};
`

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: ${({ theme }) => theme.bg9};
  box-shadow: ${({theme}) => theme.shadow2};
  padding: 1rem;
  z-index: 1;
`

export const Wrapper = styled.div`
  position: relative;
  padding: 1rem;
`

export default function Pool() {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const { account, chainId } = useActiveWeb3React()

  // TODO: hide something of header, will update on the future
  const hideSomething = true

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken), [
    tokenPairsWithLiquidityTokens
  ])
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )
  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some(V2Pair => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  const hasV1Liquidity = useUserHasLiquidityInAllTokens()

  // show liquidity even if its deposited in rewards contract
  const stakingInfo = useStakingInfo()
  const stakingInfosWithBalance = stakingInfo?.filter(pool => JSBI.greaterThan(pool.stakedAmount.raw, BIG_INT_ZERO))
  const stakingPairs = usePairs(stakingInfosWithBalance?.map(stakingInfo => stakingInfo.tokens))

  // remove any pairs that also are included in pairs with stake in mining pool
  const v2PairsWithoutStakedAmount = allV2PairsWithLiquidity.filter(v2Pair => {
    return (
      stakingPairs
        ?.map(stakingPair => stakingPair[1])
        .filter(stakingPair => stakingPair?.liquidityToken.address === v2Pair.liquidityToken.address).length === 0
    )
  })

  return (
    <>
      <AppBody>
        <SwapPoolTabs active={'pool'} />
        <Wrapper>
          <StyledPoolHeader>
              <RowBetween>
                <TYPE.black fontWeight={500}>{t('pool')}</TYPE.black>
              </RowBetween>
          </StyledPoolHeader>
          <InputPanel>
            {
              !hideSomething && (
                <>
                  <CardBGImage />
                  <CardNoise />
                </>
              )
            }
            <AutoColumn gap="md">
              {/* <RowBetween>
                <TYPE.black fontWeight={500}>{t('lpRewards')}</TYPE.black>
              </RowBetween> */}
              <RowBetween>
                <TYPE.lightGray fontSize={14}>{t('lpRewardsDesc')}</TYPE.lightGray>
              </RowBetween>
              {!hideSomething && (
                <ExternalLink
                  style={{ color: 'white', textDecoration: 'underline' }}
                  target="_blank"
                  href="https://uniswap.org/docs/v2/core-concepts/pools/"
                >
                  <TYPE.white fontSize={14}>Read more about providing liquidity</TYPE.white>
                </ExternalLink>
              )}
              <RowBetween>
                <ButtonRow>
                    <ResponsiveButtonSecondary
                      as={Link}
                      padding="6px 8px"
                      to={isETFChain(chainId) ? '/create/ETHF' : '/create/ETH'}
                    >
                      {t('createPair')}
                    </ResponsiveButtonSecondary>
                    <ResponsiveButtonPrimary
                      id="join-pool-button"
                      as={Link}
                      padding="6px 8px"
                      borderRadius="12px"
                      to={isETFChain(chainId) ? '/add/ETHF' : '/add/ETH'}
                    >
                      <Text fontWeight={500} fontSize={`0.75rem`}>
                        {t('addLp')}
                      </Text>
                    </ResponsiveButtonPrimary>
                  </ButtonRow>
              </RowBetween>
            </AutoColumn>
          </InputPanel>
           <InputPanel style={{marginTop: '1rem'}}>
            <AutoColumn gap="lg" style={{ width: '100%' }}>
                <RowBetween>
                  <TYPE.black fontWeight={500}>{t('yourlp')}</TYPE.black>
                </RowBetween>

              {!account ? (
                <Card padding="40px">
                  <TYPE.body color={theme.text3} textAlign="center">
                    {t('viewLiquidTip')}
                  </TYPE.body>
                </Card>
              ) : v2IsLoading ? (
                <EmptyProposals>
                  <TYPE.body color={theme.text3} textAlign="center">
                    <Dots>{t('loading')}</Dots>
                  </TYPE.body>
                </EmptyProposals>
              ) : allV2PairsWithLiquidity?.length > 0 || stakingPairs?.length > 0 ? (
                <>
                  <ButtonSecondary>
                    <RowBetween>
                      <ExternalLink href={'https://info.oriswap.xyz/account/' + account}>
                        {t('accountTip')}
                      </ExternalLink>
                      <span> ↗</span>
                    </RowBetween>
                  </ButtonSecondary>
                  {v2PairsWithoutStakedAmount.map(v2Pair => (
                    <FullPositionCard key={v2Pair.liquidityToken.address} pair={v2Pair} />
                  ))}
                  {stakingPairs.map(
                    (stakingPair, i) =>
                      stakingPair[1] && ( // skip pairs that arent loaded
                        <FullPositionCard
                          key={stakingInfosWithBalance[i].stakingRewardAddress}
                          pair={stakingPair[1]}
                          stakedBalance={stakingInfosWithBalance[i].stakedAmount}
                        />
                      )
                  )}
                </>
              ) : (
                <EmptyProposals>
                  <TYPE.body color={theme.text3} textAlign="center">
                    No liquidity found.
                  </TYPE.body>
                </EmptyProposals>
              )}

              <AutoColumn justify={'center'} gap="md">
                <Text textAlign="center" fontSize={14} style={{ padding: '.5rem 0 .5rem 0' }}>
                  {hasV1Liquidity ? 'DogeSwapV1 liquidity found!' : t('dontSeePool')}{' '}
                  <StyledInternalLink id="import-pool-link" to={hasV1Liquidity ? '/migrate/v1' : '/find'}>
                    {hasV1Liquidity ? 'Migrate now.' : t('importIt')}
                  </StyledInternalLink>
                </Text>
              </AutoColumn>
            </AutoColumn>
          </InputPanel>
        </Wrapper>
      </AppBody>
    </>
  )
}

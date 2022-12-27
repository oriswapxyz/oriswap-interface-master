import { ChainId, Currency, ETHER, Token } from '@uniswap/sdk'
import { isETFChain } from 'utils'

export function currencyId(currency: Currency, chainId: ChainId | undefined): string {
  if (currency === ETHER) return isETFChain(chainId) ? 'ETHF' : 'ETH'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}

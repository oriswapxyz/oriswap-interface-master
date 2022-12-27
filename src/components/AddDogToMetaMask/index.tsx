import React from 'react';
import { TOKEN, TOKEN_ADDRESS } from '../../constants/farm';
import TokenImage from '../../components/TokenImage';
import { Tooltip } from 'antd';
import { TooltipPlacement } from 'antd/lib/tooltip';
import { useActiveWeb3React } from '../../hooks';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components'

interface Props {
   toolTipsPlacement?: TooltipPlacement
}

const Container = styled.span`
    .ant-tooltip {
        .ant-tooltip-content {
            border-radius: 8px !important;
            overflow: hidden;
        }
    }
`;

const StyleTokenImage = styled(TokenImage)`
    cursor: pointer;
`;

export default function AddDogToMetaMask({
    toolTipsPlacement,
}: Props) {
    const { t } = useTranslation();
    const { account, library } = useActiveWeb3React();
    if (!account || !library || !library.provider.isMetaMask ) return null;

    function addToMetaMask() {
        const params: any = {
            type: 'ERC20',
            options: {
                address: TOKEN_ADDRESS[TOKEN.DOG],
                symbol: 'ORI',
                decimals: 18,
                image:
                    'https://graph.oriswap.xyz/static/images/tokens/0x5342F2CEE30ca8a8D1a971C375a3B5E73cF2733B.png'
            }
        }

        if (
            library &&
            library.provider.isMetaMask &&
            library.provider.request
        ) {
            library.provider
                .request({
                    method: 'wallet_watchAsset',
                    params
                })
                .then(success => {
                    if (success) {
                        console.log(
                            'Successfully added DOG to MetaMask'
                        )
                    } else {
                        throw new Error('Something went wrong.')
                    }
                })
                .catch(console.error)
        }
    }

    return (
        <Container>
            <Tooltip 
                placement={toolTipsPlacement} 
                title={t('addOriToMetaMask')}
                getPopupContainer={(node) => node}
            >
                <StyleTokenImage id="dogTokenImage" address={TOKEN_ADDRESS[TOKEN.DOG]} onClick={addToMetaMask} />
            </Tooltip>
        </Container>
    )
}
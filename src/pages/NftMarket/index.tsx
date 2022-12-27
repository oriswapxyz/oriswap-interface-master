import React from 'react';
import AppBody from '../AppBody';
import styled from 'styled-components';
import { useDarkModeManager } from '../../state/user/hooks';

const StyleIframe = styled.iframe`
    width: 100%;
    height: 100%;
    border: none;
`;

document.domain="oriswap.xyz";

export default function NftMarket() {
    const [isDark] = useDarkModeManager()

    return (
        <AppBody style={{ 
            background: 'transparent', boxShadow: 'none',
            position: 'absolute',
            width: '100vw',
            maxWidth: 'unset',
            top: '113px',
            height: "100vh"
        }}>
            <StyleIframe frameBorder="0" src={`https://popnfts.oriswap.xyz/doge/market?theme=${isDark ? 'dark' : 'light'}`} />
        </AppBody>  
    )

}
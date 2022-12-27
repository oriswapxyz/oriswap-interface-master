/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import styled from 'styled-components'
import { ButtonPrimary, ButtonSecondary } from '../Button';
import Row, { RowBetween } from '../Row';
import { message } from 'antd';
import Logo from '../../assets/svg/logo.png'
import Modal from '../Modal/v2';
import { TYPE } from '../../theme';
import {getAirdropContract} from '../../data/airdrop';
import { useActiveWeb3React } from '../../hooks';
import initWeb3 from '../../hooks/init-web3';
import useClaim from '../../hooks/airdrop/useClaim';
import useIsClaim from '../../hooks/airdrop/useGetIsClaim';
import checkUserAirdrop from '../../graphql/check-user-has-airdrop';
import { getTokenPrice } from '../../graphql/token-price';
import { TOKEN, TOKEN_ADDRESS } from 'constants/farm';
import Web3 from 'web3';
import { getFullDisplayBalance } from '../../utils/web3';
import { getDogContract } from '../../data/farm';
import { BigNumber } from 'bignumber.js';
import useGetTotalSupply from '../../hooks/airdrop/useGetTotalSupply';
import Value from '../Value';

const Title = styled(Row)`
    justify-content: center;
`;

const DogCard = styled.div`
    border-radius: 1rem;
    padding: 1rem;
    background: ${({theme}) => theme.bg14};
    margin-top: 1.2rem;
`;

const LogoWrapper = styled.div`
    display: inline-block;
    width: 4rem;
    height: 4rem;
    border-radius: 2rem;
    overflow: hidden;
    margin-right: 2.5rem;
    background: url(${Logo}) no-repeat;
    background-color: ${({theme}) => theme.white};
    background-size: contain;
    background-position: center;
    flex-shrink: 0;
`;

const AddressInput = styled.input`
    outline: none;
    width: 100%;
    background: ${({theme}) => theme.primary7};
    padding: 0.5rem;
    border-radius: 0.4rem;
    border: none;
    color: ${({theme}) => theme.white};

    &::placeholder {
        color: ${({theme}) => theme.lightGrey};
    }
`;

const InnerRow = styled(Row)`
    display: flex;
    flex-direction: column;
`;

const CheckButton  = styled(ButtonPrimary)`
    padding: 0.5rem 1rem;
    width: auto;
    border-radius: 0.2rem;
    flex-shrink: 0;
`;

interface Props {
    visible: boolean;
    onClose(): void;
}

export default function DogModal({
    visible,
    onClose
}: Props) {
    const { t } = useTranslation();
    const web3Provider = useActiveWeb3React();
    const { account, chainId } = web3Provider;
    const [web3, setWeb3] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [receiveDisabled, setReceiveDisabled] = useState(false);
    // dog合约 
    const [dogContract, setDogContract] = useState<any>(null);
    // 空投合约
    const [airDropContract, setAirDropContract] = useState<any>(null);
    const [dogTokenInfo, setDogTokenInfo] = useState<any>(0);
    const [userRewardInfo, setUserRewardInfo] = useState<any>({});
    const [receiveVisible, setReceiveVisible] = useState<any>();
    const [receiving, setReceiving] = useState(false);
    const [totalSupply, setTotalSupply] = useState(0);

    const { claim } = useClaim(airDropContract);
    const { checkIsclaim } = useIsClaim(airDropContract);
    const { getTotalSupply } = useGetTotalSupply(dogContract);

    async function checkUserRewardInfo() {
        if (!account) return;
        let rewardInfo: any;
        const res: any = await checkUserAirdrop(account);
        let hasClaimed = false;
        if (res) {
            hasClaimed = await checkIsclaim((res as any).index);
            rewardInfo = {
                ...res,
                amount: (res as any).amount ? getFullDisplayBalance(
                    new BigNumber(Web3.utils.hexToNumberString((res as any).amount)),
                    18,
                    2,
                ) : 0,
            };
        }

        setUserRewardInfo({
            ...rewardInfo,
            hasClaimed,
        });
    }

    async function getDogTokenInfo() {
        const data = await getTokenPrice(TOKEN_ADDRESS[TOKEN.DOG]);
        setDogTokenInfo(data);
    }

    useEffect(() => {
        getDogTokenInfo();
    }, [])

    async function getTokenTotalSupply() {
        const res = await getTotalSupply();
        if (res) {
            setTotalSupply(new BigNumber(res).dividedBy(new BigNumber(10).pow(18)).toNumber())
        }
    }

    useEffect(() => {
        if(dogContract) {
            getTokenTotalSupply();
        }
    }, [dogContract])

    useEffect(() => {
        if (account && airDropContract) {
            checkUserRewardInfo();
        }
    }, [account, airDropContract]);

    // useEffect(() => {
    //     if (!airDropContract || !account) {
    //         return;
    //     }
    //     airDropContract.events.Claimed({
    //         filter: {
    //             account: account,
    //         }
    //     }, async (error: any, event: any) => {
    //         if (error) {
    //             return;
    //         }
    //         message.destroy('pending_tx');
    //     });
    // }, [airDropContract, account]);

    async function receive(address?: string) {
        try {
            if (!address && !inputValue) {
                setErrorMessage(t('noRecipient'));
                setReceiveDisabled(true);
                return;
            }

            if (!Web3.utils.isAddress(address || inputValue)) {
                setErrorMessage(t('invalidRecipient'));
                setReceiveDisabled(true);
                return;
            }
    
            const params: any = await checkUserAirdrop(address || inputValue);
            if (!params) {
                setErrorMessage(t('noSupply'));
                setReceiveDisabled(true);
                return;
            }
            const hasClaimed = await checkIsclaim(params.index);
            if (hasClaimed) {
                setErrorMessage(t('claimed'));
                setReceiveDisabled(true);
                return;
            }
            setReceiving(true);
            // message.info({
            //     key: 'receiveLoading',
            //     content: t('pending_tx'),
            //     duration: 0,
            // })
            setErrorMessage('');
            await claim(params.index, account || '', inputValue, params.amount, params.proof);
            message.success({
                key: 'success',
                content: t('claimed')
            });
            setReceiving(false);
            
        } catch(e) {
            setReceiving(false);
            setErrorMessage(e.message);
        }
    }

    // contract init
    useEffect(() => {
        if (web3 && account && chainId) {
            const airDropContractInstance = getAirdropContract(chainId, web3);
            const dogContractInstance = getDogContract(chainId, web3);
            setAirDropContract(airDropContractInstance);
            setDogContract(dogContractInstance);
        }
    }, [web3, account, chainId]);

    // web3 init
    useEffect(() => {
        if (web3Provider.library?.provider) {
            const web3 = initWeb3(web3Provider.library.provider);
            setWeb3(web3);
        }
    }, [web3Provider]);

    return (
        <Modal visible={visible} onClose={onClose} hideFooter>
            <Title><TYPE.black>{t('dogDetail')}</TYPE.black></Title>
            <DogCard>
                <Row>
                    <LogoWrapper />
                    <InnerRow>
                        <Row>
                            <TYPE.white fontSize={14}>{t('rewards')}</TYPE.white>
                        </Row>
                        <Row>
                            <TYPE.white fontSize={14}>{userRewardInfo.amount || 0} {userRewardInfo.hasClaimed && `[${t('claimed')}]`}</TYPE.white>
                        </Row>
                    </InnerRow>
                </Row>
                <RowBetween style={{marginTop: '1rem'}}>
                    <InnerRow>
                        <Row>
                            <TYPE.white fontSize={24}>{t('applyDogToken')}</TYPE.white>
                        </Row>
                        <Row>
                            <TYPE.white fontSize={14}>{t('checkAddreeSupply')}</TYPE.white>
                        </Row>
                    </InnerRow>
                    <CheckButton onClick={() => {
                        setReceiveVisible(true);
                        setInputValue(account || '');
                    }}>{t('check')}</CheckButton>
                </RowBetween>
            </DogCard>
            {
                dogTokenInfo && (
                    <>
                        <RowBetween style={{marginTop: '1rem', padding: '0 2rem'}}>
                            <TYPE.black fontWeight={300}>{t('dogPrice')}</TYPE.black>
                            <TYPE.black fontWeight={300}>${<Value value={Number(dogTokenInfo.price)} />}</TYPE.black>
                        </RowBetween>
                        <RowBetween style={{marginTop: '1rem', padding: '0 2rem'}}>
                            <TYPE.black fontWeight={300}>{t('totalSupply')}</TYPE.black>
                            <TYPE.black fontWeight={300}><Value value={totalSupply} /></TYPE.black>
                        </RowBetween>
                    </>
                )
            }
           {
               receiveVisible && (
                   <>
                    <Row style={{marginTop: '1rem'}}>
                        <TYPE.black fontWeight={300}>{t('getSupplyDesc')}</TYPE.black>
                    </Row>
                    <Row style={{marginTop: '1.5rem'}}>
                        <TYPE.black>{t('walletAddress')}</TYPE.black>
                    </Row>
                    <Row style={{marginTop: '0.5rem'}}>
                        <AddressInput 
                            onChange={(e) => {
                                if (e.currentTarget.value) {
                                    setErrorMessage('');
                                    setReceiveDisabled(false);
                                }
                                setInputValue(e.currentTarget.value);
                            }}  
                            value={inputValue}
                            placeholder={t('noRecipient')} 
                        />
                    </Row>
                    {
                        errorMessage && (
                            <Row style={{marginTop: '0.5rem'}}>
                                <TYPE.error error>{errorMessage}</TYPE.error>
                            </Row>
                        )
                    }
                    <Row style={{marginTop: '1rem'}}>
                        <ButtonSecondary disabled={receiveDisabled || receiving} onClick={() => {
                            receive();
                        }}>{t(receiving ? 'receiving' :'receive')}</ButtonSecondary>
                    </Row>
                   </>
               )
           }
        </Modal>
    )
}
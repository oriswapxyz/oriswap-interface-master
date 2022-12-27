import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components';
import Row from '../../components/Row';
import { Modal } from 'antd';
import { TYPE } from '../../theme';
import LpModulusImage from '../../assets/images/lp_modulus.png';
import SingleModulusImage from '../../assets/images/single_modulus.png';
const RightFloatWrapper = styled.div`
    position: fixed;
    top: 40%;
    right: 0;
    z-index: 999;
    background: transparent;
`;

// const FloatItem = styled.div`
//     cursor: pointer;
//     /* width: 3rem; */
//     text-align: center;
//     padding: 0.4rem;
//     border-radius: 1rem 0 0 1rem;
//     font-size: 0.65rem;
//     margin-bottom: 0.6rem;
//     border: 1px solid ${({ theme }) => theme.white};
//     color: ${({ theme }) => theme.white};
//     background-color: ${({ theme }) => theme.primary7};
// `;

const CustomModal  = styled(Modal)`
    .ant-modal-content {
        border-radius: 1rem;
    }

    .ant-modal-body {
        padding: 0;
        padding-top: 24px;
        overflow: hidden;
        border-radius: 1rem;
        background-color: ${({ theme }) => theme.bg9};
    }

    .ant-modal-close-icon {
        border: 2px solid #000;
        border-radius: 50%;
        padding: 5px;
        > svg {
            fill:${({ theme }) => theme.text1};
        }
    }
`;

const ModalRowCenter = styled(Row)`
    box-sizing: border-box;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    justify-content: center;
`;

const ModalLineText = styled(TYPE.black)`
    display: block;
    width: 100%;
    box-sizing: border-box;
    padding: 0 1rem;
    line-height: 1.4rem;
    margin: 1rem 0 !important;
    font-size: 1rem;
`;

const ModulusImg = styled.img`
    margin-top: 2rem;
    width: 100%;
`;

// const StyleTable = styled.table`
//     margin-top: 2rem;
//     width: 100%;
//     background: ${({ theme }) => theme.bg9};

//     th {
//         background: ${({ theme }) => theme.bg12};
//         color: #fff;
//         border: 1px solid grey;
//         padding: 0.5rem;
//     }
//     td {
//         border: 1px solid grey;
//         padding: 0.5rem;
//     }
// `;

interface Props {
    isLp?: boolean;
    top?: string;
}

export default function RightItems({
    isLp = true,
    top = '35%',
}: Props) {
    const {t} = useTranslation();
    const [modulusVisible, setModulusVisible] = useState(false);
    const [notiVisible, setNotiVisible] = useState(false);
    return (
        <RightFloatWrapper style={{top: top}}>
            {/*<FloatItem onClick={() => setModulusVisible(true)}>{t('modulus')}</FloatItem>*/}
            {/*<FloatItem onClick={() => setNotiVisible(true)}>{t('rules')}</FloatItem>*/}
            <CustomModal closable visible={modulusVisible} onCancel={() => setModulusVisible(false)} footer={null}>
                {
                    isLp ? (
                        <>
                            <ModalRowCenter>
                                <TYPE.black textAlign="center" fontSize={24}>{t("lpModulusTitle")}</TYPE.black>
                            </ModalRowCenter>
                            <ModulusImg src={LpModulusImage} />
                        </>
                    ) : (
                        <>
                            <ModalRowCenter>
                                <TYPE.black textAlign="center" fontSize={24}>{t("singleModulusTitle")}</TYPE.black>
                            </ModalRowCenter>
                            <ModulusImg src={SingleModulusImage} />
                        </>
                    )
                }
            </CustomModal>
            <CustomModal closable visible={notiVisible} onCancel={() => setNotiVisible(false)} footer={null}>
                {
                    isLp ? (
                        <>
                            <ModalRowCenter>
                                <TYPE.black fontSize={24}>{t('lpRuleTitle')}</TYPE.black>
                            </ModalRowCenter>
                            <ModalLineText fontWeight={300}>
                                {t('lpRules1')}
                            </ModalLineText>
                            <ModalLineText fontWeight={300}>
                                {t('lpRules1-1')}
                            </ModalLineText>
                            <ModalLineText fontWeight={300}>
                                {t('lpRules1-2')}
                            </ModalLineText>
                            <ModalLineText fontWeight={300}>
                                {t('lpRules1-3')}
                            </ModalLineText>
                            <ModalLineText fontWeight={300}>
                                {t('lpRules2')}
                            </ModalLineText>
                            <ModalLineText fontWeight={300}>
                                {t('lpRules3')}
                            </ModalLineText>
                            <ModalLineText fontWeight={300}>
                                {t('lpRules4')}
                            </ModalLineText>
                            <ModalLineText fontWeight={300}>
                                {t('lpRules5')}
                            </ModalLineText>
                        </>
                    ) : (
                        <>
                            <ModalRowCenter>
                                <TYPE.black fontSize={24}>{t('singleRuleTitle')}</TYPE.black>
                            </ModalRowCenter>
                            <ModalLineText fontWeight={300}>
                                {t('singleTitle')}
                                <a href='http://dogeswap.mikecrm.com/wjLIUNJ' target='_blank' rel="noopener noreferrer" style={{
                                    marginLeft: '16px',
                                    wordBreak: 'break-all',
                                }}>http://dogeswap.mikecrm.com/wjLIUNJ</a>
                            </ModalLineText>
                            <ModalLineText fontWeight={300}>
                                {t('singleRules2')}
                            </ModalLineText>
                            <ModalLineText fontWeight={300}>
                                {t('singleRules2-1')}
                            </ModalLineText>
                            <ModalLineText fontWeight={300}>
                                {t('singleRules2-2')}
                            </ModalLineText>
                            <ModalLineText fontWeight={300}>
                                {t('singleRules2-3')}
                            </ModalLineText>
                            <ModalLineText fontWeight={300}>
                                {t('singleRules3')}
                            </ModalLineText>
                            <ModalLineText fontWeight={300}>
                                {t('singleRules4')}
                            </ModalLineText>
                            <ModalLineText fontWeight={300}>
                                {t('singleRules5')}
                            </ModalLineText>
                            <ModalLineText fontWeight={300}>
                                {t('lpRules5')}
                            </ModalLineText>
                        </>
                    )
                }
            </CustomModal>
        </RightFloatWrapper>
    )
}
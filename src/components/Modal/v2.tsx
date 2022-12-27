import React from 'react';
import { Modal } from 'antd';
import Row from '../Row';
import {ButtonPrimary} from '../Button';
import styled from 'styled-components';
import { TYPE } from '../../theme';

const DogModal = styled(Modal)`
    .ant-modal-content {
        border-radius: 1rem;
        background-color: ${({ theme }) => theme.bg9};
    }

    .ant-modal-header {
        border-radius: 1rem 1rem 0 0;
        background: transparent;
    }

    .ant-modal-body {
        padding-top: 24px;
        overflow: hidden;
        border-radius: 1rem;
        background: transparent;
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

const FooterWrapper = styled(Row)`
    margin-top: 1rem;
    justify-content: flex-end;
`;

interface Props {
    title?: string;
    visible: boolean;
    onClose(): void;
    onOk?(): void;
    children?: React.ReactNode;
    hideFooter?: boolean
}

export default function DogModalFunc(props: Props) {
    return (
        <DogModal 
            visible={props.visible} 
            onCancel={props.onClose}
            title={props.title && <TYPE.black>{props.title}</TYPE.black>}
            footer={null}
            centered
        >
            {props.children}
            {
                !props.hideFooter && (
                    <FooterWrapper>
                        <ButtonPrimary onClick={() => {
                            props.onOk && props.onOk();
                            props.onClose();
                        }}>OK</ButtonPrimary>
                    </FooterWrapper>
                )
            }
        </DogModal>

    )
}
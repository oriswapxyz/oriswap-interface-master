import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { ReactComponent as ZHIcon } from '../../assets/images/zh.svg'
import { ReactComponent as ENIcon } from '../../assets/images/en.svg'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'

const StyledZHIcon = styled(ZHIcon)`
  path {
    stroke: ${({ theme }) => theme.text1};
  }
`

const StyledENIcon = styled(ENIcon)`
  path {
    stroke: ${({ theme }) => theme.text1};
  }
`

const StyledMenuButton = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg3};

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
`

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const MenuFlyout = styled.span`
  min-width: 8.125rem;
  background-color: ${({ theme }) => theme.bg3};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 12px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 4rem;
  right: 0rem;
  z-index: 100;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    top: -6.25rem;
  `};
`

const MenuItem = styled.a`
  flex: 1;
  padding: 0.5rem 0.5rem;
  color: ${({ theme }) => theme.text2};
  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }
  > svg {
    margin-right: 8px;
    vertical-align: middle;
  }
`


export default function LanguageMenu() {
  const { i18n } = useTranslation()

  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.MENU)
  const toggle = useToggleModal(ApplicationModal.MENU)
  useOnClickOutside(node, open ? toggle : undefined)

  function switchLng(value: string) {
    i18n.changeLanguage(value)
  }

  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={toggle}>
        {i18n.language === 'en-US' ? <StyledENIcon /> : <StyledZHIcon />}
      </StyledMenuButton>
      {open && (
        <MenuFlyout>
          <MenuItem
            onClick={() => {
              switchLng('zh-CN')
            }}
          >
            <StyledZHIcon />
            中文
          </MenuItem>
          <MenuItem
            onClick={() => {
              switchLng('en-US')
            }}
          >
            <StyledENIcon />
            English
          </MenuItem>
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}

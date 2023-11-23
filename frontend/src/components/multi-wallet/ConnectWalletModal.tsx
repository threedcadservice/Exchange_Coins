import React from 'react'
import { useReactiveVar } from '@apollo/client'
import { Button, Checkbox, Modal } from 'antd'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import metamaskIcon from '../../assets/multi-wallet/metamask.svg'
import walletConnectIcon from '../../assets/multi-wallet/walletConnect.svg'
import { accountVar, chainIdVar, connectWalletModalVar, MultiWalletProvider, languageVar } from '../../variables/WalletVariable'
import { multiWalletService } from '../../services/MultiWalletService'
import { colorsV2, fonts } from '../../styles/variables'
import { texts } from '../../styles/text'

interface Wallet {
  key: number
  name: string
  code: MultiWalletProvider
  image: string
  active: boolean
  loading: boolean
  disabled: boolean
}
interface Network {
  key: number
  name: string
  image: string
  active: boolean
  chainId: number
}

export const ConnectWalletModal = () => {
  const account = useReactiveVar(accountVar)
  const chainId = useReactiveVar(chainIdVar)
  const connectWalletModal = useReactiveVar(connectWalletModalVar)
  const language = useReactiveVar(languageVar)

  const [walletList, setWalletList] = useState<Wallet[]>([
    {
      key: 0,
      name: 'MetaMask',
      code: MultiWalletProvider.metaMask,
      image: metamaskIcon,
      active: false,
      loading: false,
      disabled: true
    },
    {
      key: 1,
      name: 'WalletConnect',
      code: MultiWalletProvider.walletConnect,
      image: walletConnectIcon,
      active: false,
      loading: false,
      disabled: true
    }
  ])

  const setLoading = (key: number | undefined) => {
    const newWalletList: Wallet[] = []
    walletList.forEach(wallet => {
      if (wallet.key === key) {
        const walletUpdate = {
          ...wallet,
          loading: true
        }
        newWalletList.push(walletUpdate)
      } else {
        const walletUpdate = {
          ...wallet,
          loading: false
        }
        newWalletList.push(walletUpdate)
      }
    })
    setWalletList(newWalletList)
  }

  const selectWallet = async (wallet: Wallet) => {
    setLoading(wallet.key)
    await multiWalletService(wallet.code, chainId).connect()
    setLoading(undefined)
  }

  useEffect(() => {
    if (account) {
      handleCancel()
    }
  }, [account])

  const handleCancel = () => {
    connectWalletModalVar(false)
  }
  return (
    <S.Modal title={texts[language]['wallet']} onCancel={handleCancel} visible={!!connectWalletModal} footer={null} destroyOnClose>
      <div>
        <S.BoxContainer>
          <S.ContainerCards>
            {walletList.map(wallet => (
              <S.CardButton
                key={wallet.key}
                onClick={() => selectWallet(wallet)}
                loading={wallet.loading}>
                <div>
                  <img alt={wallet.name} src={wallet.image} />
                  <span>{wallet.name}</span>
                </div>
              </S.CardButton>
            ))}
          </S.ContainerCards>
        </S.BoxContainer>
      </div>
    </S.Modal>
  )
}
const S = {
  Modal: styled(Modal)`
    .ant-modal-content {
      background: ${props=>props.theme.gray['0']};
      border-radius: 16px;
      width: 320px;
      margin: auto;
    }
    .ant-modal-body {
      display: flex;
      padding: 32px 32px;
      padding-top: 0px;
      flex-direction: column;
      > div {
        display: flex;
        flex-direction: column;
        > h4 {
          margin-top: 8px;
          margin-bottom: 8px;
          font-size: 1.4rem;
          line-height: 1.6rem;
          font-weight: 400;
          color: ${props=>props.theme.gray[4]};
        }
        &:not(:last-child) {
          margin-bottom: 16px;
        }
      }
    }
    .ant-modal-header {
      background: ${props=>props.theme.gray['0']};
      padding: 16px 32px;
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
      border-bottom: none;
    }
    .ant-modal-title {
      font-style: normal;
      font-weight: 400;
      font-size: 25px;
      line-height: 20px;
      padding-bottom: 16px;
      color: ${props=>props.theme.gray[4]};
      text-align: center;
      margin-top: 4px;
    }
    .ant-modal-close-x {
      display: flex;
      justify-content: center;
      align-items: center;
      display: none;
      height: 48px;
    }
  `,
  BoxContainer: styled.div`
    display: flex;
    flex-direction: column;
    gap: 18px 0px;
  `,
  ContainerCards: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    h1 {
      font-weight: 500;
      font-size: 14px;
      line-height: 18px;
      color: ${props=>props.theme.gray[2]};
      line-height: 18px;
      margin-bottom: 16px;
    }

    div {
      display: flex;
      gap: 0px 16px;
    }
  `,
  CardButton: styled(Button)`
    display: flex;
    border: none;
    border-radius: 8px;
    background: ${props=>props.theme.white};
    justify-content: left;
    align-items: center;
    height: 50px;
    width: 100%;
    margin-top: 5px;
    cursor: pointer;
    white-space: normal;
    font-family: ${fonts.nunito};
    font-style: normal;
    font-weight: normal;
    font-size: 10px;
    color: ${props=>props.theme.gray[4]};
    box-shadow: 1px 1px 5px hsla(0, 0%, 0%, 0.05);
    &::after {
      display: none;
    }
    &:hover {
      background: ${props=>props.theme.gray[0]};
      color: ${props=>props.theme.gray[4]};
    }
    div {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: left;
      padding-top: 5px;
      img {
        height: 30px;
        width: 30px;
        margin-bottom: 4px;
      }
      span {
        font-size: 1.3rem;
        line-height: 1.4rem;
        margin-top: 4px;
        margin-left: 20px;
        color: ${props=>props.theme.gray[4]};
      }
    }
  `,
  Checkbox: styled(Checkbox)`
    color: ${colorsV2.gray[4]};
    font-size: 12px;
    line-height: 14px;
    font-weight: 400;
    margin-top: 8px;
    a {
      color: ${colorsV2.blue.main};
      &:hover {
        opacity: 0.7;
      }
    }
  `
}

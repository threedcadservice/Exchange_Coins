import { useReactiveVar } from '@apollo/client'
import { Button, Col, Row } from 'antd'
import React, { useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
import { DefaultPageTemplate } from './shared/templates/DefaultPageTemplate'
import { accountVar, contractAddressVar, multiplyerVar, languageVar } from '../variables/WalletVariable'
import { AppContext } from "../contexts"
import { texts } from '../styles/text'
import { creatingWallet } from '../services/UserService';
import TradingViewComponent from '../components/tradingView/index';

export default function ExchangePage() {
  const account = useReactiveVar(accountVar)
  const contracAddress = useReactiveVar(contractAddressVar)
  const multiplier = useReactiveVar(multiplyerVar)
  const language = useReactiveVar(languageVar)

  const { user } = useContext(AppContext);

  const [coinAmount, setCoinAmount] = useState<number>();
  const [coinPrice, setCoinPrice] = useState<number>();
  const [coinValue, setCoinValue] = useState<number>();
  const [walletAddress, setWalletAddress] = useState('');

  const coinAmountChange = (e) => {
    setCoinAmount(e.target.value)
    setCoinValue(Math.round(e.target.value * coinPrice * 1000) / 1000)
  }

  const coinPriceChange = (e) => {
    setCoinPrice(e.target.value)
    setCoinValue(Math.round(e.target.value * coinAmount * 1000) / 1000)
  } 

  const CreateWallet = async() => {
      let data = {mnemonic: user.email + user.username};
      const wallet_address = await creatingWallet(data);
      setWalletAddress(wallet_address)
  }

  useEffect(() => {
    
  }, []);

  const tradingChart_ = (index) => {
    if (index && contracAddress != '') {
      return (<TradingViewComponent index={index}/>);
    } else {
        return (
            <div className='chart_before_content'>
                <svg className="w-6 h-6 flex-shrink-0 fill-current text-primary-dark dark:text-primary" fill="white" viewBox="0 0 25 24">
                    <path d="M6.5 21h-2a2 2 0 01-2-2v-3a2 2 0 012-2h2a2 2 0 012 2v3a2 2 0 01-2 2zM20.5 21h-2a2 2 0 01-2-2v-6a2 2 0 012-2h2a2 2 0 012 2v6a2 2 0 01-2 2zM13.5 21h-2a2 2 0 01-2-2v-9a2 2 0 012-2h2a2 2 0 012 2v9a2 2 0 01-2 2z" fill="" opacity=".35"></path>
                    <path d="M5.52 9a1 1 0 01-.504-1.865l6.982-4.04c.235-.135.514-.168.772-.097l7 1.973a1 1 0 01-.543 1.925l-6.594-1.858L6.02 8.865a.995.995 0 01-.5.135z" fill=""></path>
                    <path d="M19.5 8a2 2 0 100-4 2 2 0 000 4zM12.5 6a2 2 0 100-4 2 2 0 000 4zM5.5 10a2 2 0 100-4 2 2 0 000 4z" fill=""></path>
                </svg>
                <div className='text_'>{`${texts[language]['chartcontent5']}#${index}`}
                </div>
            </div>
        )
    }
  } 

  return (
    <>    
    <DefaultPageTemplate bgGray >
      { !account || !user.authenticated ?
          <Row justify='center' style={{marginTop: '30px', marginBottom: '50px'}}>
            <Col xs={24} sm={24} md={16} lg={12} xl={12} >
              <S.NoteCard>
                  <div className='header'>
                      <h1 className='title'>{texts[language]['charttitle']}</h1>
                  </div>
                  <div className='content'>
                      <p>🔒 {texts[language]['chartcontent1']}</p>
                      <p>{texts[language]['chartcontent2']}</p>
                      <ul className="UL_circle">
                          <li>{texts[language]['chartcontent3']}</li>
                          <li>{texts[language]['chartcontent4']}</li>
                      </ul>
                  </div>
              </S.NoteCard>
            </Col>
          </Row>
        :
          <Row justify='center'>
            <S.MultiChartCard>
                <Row className='cat-center RugCheckerCard'>
                    <Col xs={8} sm={8} md={8} lg={8} xl={8} >
                        <div className='card'>
                            <input className='RugCeckerInput'
                                placeholder={texts[language]['exchangecontent1']}
                                value={coinAmount}
                                onChange={coinAmountChange}
                            />
                        </div>
                    </Col>
                    <Col xs={8} sm={8} md={8} lg={8} xl={8} >
                        <div className='card'>
                            <input className='RugCeckerInput'
                                placeholder={texts[language]['exchangecontent2']}
                                value={coinPrice}
                                onChange={coinPriceChange}
                            />
                        </div>
                    </Col>
                    <Col xs={8} sm={8} md={8} lg={8} xl={8} >
                        <div className='card'>
                            <input className='RugCeckerInput'
                                placeholder={texts[language]['exchangecontent3']}
                                value={coinValue}
                                readOnly={true}
                            />
                        </div>
                    </Col>
                </Row>
                <Row className='cat-center RugCheckerCard'>
                  <Col xs={24} sm={6} md={6} lg={4} xl={4} >
                      <div className='card' style={{marginLeft: '20px' }} onClick={CreateWallet}>
                          <div className='RugCeckerSearch'>
                              <p>{texts[language]['exchangecontent4']}</p>
                          </div>
                      </div>
                  </Col>
                  <Col xs={24} sm={18} md={18} lg={20} xl={20} >
                      <div className='content'>
                          {walletAddress}
                      </div>
                  </Col>
                </Row>
                <Row className='cat-center multichart_container'>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} >
                        <div className='card' style={{padding: '10px 10px'}}>
                            {tradingChart_(2)}
                        </div>
                    </Col>
                </Row>
            </S.MultiChartCard>
            <S.SwapCard>
              <iframe seamless={true} src="http://localhost/ftx/exchange.html"></iframe>
            </S.SwapCard>
          </Row>
        }
    </DefaultPageTemplate>
    </>
  )
}

export const S = {
  NoteCard: styled.div`
    border: 1px solid ${props=>props.theme.gray[1]};
    box-sizing: border-box;
    border-radius: 18px;
    background: ${props=>props.theme.white};
    padding: 20px;
    height: 100%;
    .header {
      .title {
          color: ${(props)=>props.theme.gray['4']};
          line-height: 50px;
          font-weight: bold;
          font-family: Poppins;
          font-size: 28px;
          margin-top: 0;
          margin-bottom: 0;
      }
    }
    .content {
      font-size: 20px;
      font-weight: 400;
      color: ${(props)=>props.theme.gray['4']};
      margin: 10px 0 0;
      line-height: 35px;

      .UL_circle {
          list-style-type: circle;
          text-align: left;
          margin: auto;
          width: -webkit-fit-content;
      }

      p {
          margin: 0px;
      }
    }

    .footer {
      user-select: none;
      margin-top: 30px;
      justify-content: center;
      text-align: center;
      align-items: center;
      justify-items: center;

      a {
        text-decoration: none;
        justify-content: center;
        text-align: center;
        display: flex;
        justify-items: center;
        align-items: center;

        &:hover {
            text-decoration: none;
        }
      }

      .button {
        justify-content: center;
        display: flex;
        text-align: center;
        justify-items: center;
        align-items: center;
        background: #ff9600;
        color: #fff;
        border-radius: 10px;
        font-weight: 600;
        font-style: normal;
        letter-spacing: normal;
        text-align: center;
        width: 300px;
        border: 0;
        cursor: pointer;
        letter-spacing: .3px;
        height: 50px;
        font-size: 15px;
        font-family: Poppins;
        &:hover {
          background-color: #ba5a00;
          color: #fff;
          border: 1px solid #ba5a00;
        }
      }
    }
  }
  `,
  MultiChartCard: styled.div`
    background-color: #ff9600;
    border-radius: 15px;
    margin-top: 50px;
    padding: 15px;
    height: 100%;
    width: 100%;
    .multichart_text {
        overflow-wrap: anywhere;
        .head {
            color: white !important;
            font-weight: 700;
            margin-top: 0;
            margin-bottom: 0;
            font-size: 44px !important;
            font-family: 'Work Sans' !important;
        }

        .content {
            color: #fff;
            font-size: 15px;
            margin-bottom: 5px;
        }
        @media screen and (max-width: 400px) {
            .head {
                font-size: 20px !important;
            }
        }
    }
    .content {
      font-size: 20px;
      font-weight: 400;
      text-align: center;
      color: ${(props)=>props.theme.gray['4']};
      line-height: 35px;
      @media (max-width: 375px) {
        font-size: 12px;
      }
      @media (max-width: 414px) {
        font-size: 14px;
      }
      
    }
    .RugCheckerCard {
        margin-top: 30px;   
        border-radius: 10px;
        margin-bottom: 30px;

        .card {
            height: 40px;
            border-radius: 7px;
            background-color: white;
            margin-right: 15px;
            .RugCeckerInput {
                height: 100%;
                width: 100%;
                font-size: .875rem;
                font-weight: 400;
                color: black;
                background-color: white;
                border: none;
                outline: 0;
                mix-blend-mode: normal;
                border-radius: 5px;
                padding: 5px;
                &::placeholder {
                    color: rgb(48, 47, 47);
                    font-weight: 500;
                }
            }

            .RugCeckerSearch {
                height: 100% !important;
                background: #1f1f3a;
                border-radius: 5px;
                border: 1px solid #09497c;
                outline: 0;
                font-weight: 600;
                font-size: 16px;
                text-align: center;
                height: max-content;
                font-weight: bold;
                cursor: pointer;
                display: flex;
                text-align: center;
                align-items: center;
                justify-content: center;
                justify-items: center;
                color: #fff;
                p {
                    padding: 0px 2px;
                    margin: 0px;
                }
                &:hover {
                  background-color: #ba5a00;
                  color: #fff;
                  border: 1px solid #ba5a00;
                }
            }
        }
    }
    .multichart_container {
        width: 100%;
        margin: 0px;
        margin-bottom: 30px;
        .card {
            height: 500px;
            background-color: #1f1f3a;
            border-radius: 3px;
            margin: 5px;

            .chart_before_content {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                text-align: center;
                align-items: center;
                justify-content: center;
                justify-items: center;

                svg {
                    width: 100px;
                }

                .text_ {
                    color: #fff;
                    font-family: 'Work Sans' !important;
                    font-size: 18px;
                    font-weight: bold;
                }
            }
        }
    }
  }
  `,
  Title: styled.p`
    color: #ff9600;
    width: 100%;
    text-align: center;
    font-size: 30px;
    font-weight: 600;
    font-family: Bungee;
    margin: 5px 5px 30px;
  `,
  Desc: styled.p`
    color: ${(props)=>props.theme.gray['4']};
    width: 100%;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 10px;
  `, 
  Button: styled(Button)`
    background: ${props=>props.theme.white};
    color: ${props=>props.theme.gray['4']};
    font-weight: 600;
    border: 1px solid ${props=>props.theme.gray['1']};
    border-radius: 10px !important;
    padding: 5px 7px 5px 7px !important;
    cursor: pointer !important;
    height: 40px;
    width: 100%;
    margin: 50px 0px 30px;
    &:hover,
    &:active,
    &:focus {
      background-color: rgb(34, 106, 237);
    }
    @media (min-width: 768px) {
      width: 70%;
    }
  `,
  SwapCard: styled.div`
    text-align: center;
    width: 100%;
    margin-top: 20px;
    iframe {
        border: 0px;
        overflow: hidden;
        height: 600px;
        width: 100%;
        @media (min-width: 768px) {
          height: 800px;
        }
        @media (min-width: 1024px) {
          height: 1180px;
        }
        @media (min-width: 1366px) {
          height: 800px;
        }
        @media (min-width: 1366px) {
          height: 780px;
        }
        @media (min-width: 1620px) {
          height: 780px;
        }
    }
  `
}
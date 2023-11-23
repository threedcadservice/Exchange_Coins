import { useReactiveVar } from '@apollo/client'
import { Button, Col, Row, Radio } from 'antd'
import React, { useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
import { DefaultPageTemplate } from './shared/templates/DefaultPageTemplate'
import { accountVar, contractAddressVar, multiplyerVar, languageVar } from '../variables/WalletVariable'
import { AppContext } from "../contexts"
import { texts } from '../styles/text'
import TradingViewComponent from '../components/tradingView/index';

const tokenOption = [
  { id: 1, value: "BNB" },
  { id: 2, value: "BUSD" },
  { id: 3, value: "CAKE" }
];

export default function MultichartPage() {
  const account = useReactiveVar(accountVar)
  const contracAddress = useReactiveVar(contractAddressVar)
  const multiplier = useReactiveVar(multiplyerVar)
  const language = useReactiveVar(languageVar)

  const { user } = useContext(AppContext);

  const [multi_vaule, set_multi_value] = useState(1);
  const [idChekedFromRequest,setIdChekedFromRequest] = useState(1);

  const multi_change_input = (e) => {
    set_multi_value(e.target.value)
  } 

  const AddContractAddress = () => {
    if(idChekedFromRequest === 1) {
      contractAddressVar("0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c")
      localStorage.setItem('contractAddress', "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c");
    } else if(idChekedFromRequest === 2) {
      contractAddressVar("0xe9e7cea3dedca5984780bafc599bd69add087d56")
      localStorage.setItem('contractAddress', "0xe9e7cea3dedca5984780bafc599bd69add087d56");
    } else if(idChekedFromRequest === 3) {
      contractAddressVar("0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82") 
      localStorage.setItem('contractAddress', "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82");
    }    
    multiplyerVar(multi_vaule);
    localStorage.setItem('multiplyer', multi_vaule + '');
  }
    
  useEffect(() => {
    set_multi_value(multiplier)
    if(contracAddress === "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c") {
      setIdChekedFromRequest(1)
    } else if(contracAddress === "0xe9e7cea3dedca5984780bafc599bd69add087d56") {
      setIdChekedFromRequest(2)
    } else if(contracAddress === "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82") {
      setIdChekedFromRequest(3)
    }
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
    { !account || !user.authenticated || user.first_name !== 'admin' ||  user.last_name !== 'admin' ?
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
            <div className='multichart_text'>
                <div className={`head`}>{texts[language]['chartcontent3']}</div>
                <p className='content'>{texts[language]['chartcontent6']}</p>
                <div className='content'>
                    <div>{texts[language]['chartcontent7']}</div>
                </div>
            </div>
            <Row className='cat-center RugCheckerCard'>
                <Col xs={24} sm={24} md={12} lg={5} xl={5} style={{paddingTop: '10px', paddingLeft: '20px'}}>
                {tokenOption.map(({value, id}) => {
                  return (
                    <Radio key={id} onChange={()=>setIdChekedFromRequest(id)} checked={id===idChekedFromRequest}>
                      {value}
                    </Radio>
                  );
                })}
                </Col>
                <Col xs={12} sm={12} md={4} lg={6} xl={6} >
                    <div className='card'>
                        <input className='RugCeckerInput'
                            placeholder='Enter the multiplier.'
                            value={multi_vaule}
                            onChange={multi_change_input}
                        />
                    </div>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4} xl={4} >
                    <div className='card' onClick={AddContractAddress}>
                        <div className='RugCeckerSearch'>
                            <p>{texts[language]['chartcontent8']}</p>
                        </div>
                    </div>
                </Col>
            </Row>
            <div style={{marginBottom: '20px', paddingLeft: '20px'}}>
                <div style={{color: 'white'}}>{texts[language]['chartcontent' + (idChekedFromRequest + 8)]}</div>
            </div>    
            <Row className='cat-center multichart_container'>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} >
                    <div className='card' style={{padding: '10px 10px'}}>
                        {tradingChart_(1)}
                    </div>
                </Col>
            </Row>
        </S.MultiChartCard>
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
    .RugCheckerCard {
        margin-top: 30px;   
        border-radius: 10px;
        margin-bottom: 10px;   
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
                background: white;
                border-radius: 5px;
                border: 0px solid #09497c;
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
                p {
                    padding: 0px 2px;
                    margin: 0px;
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
  `
}
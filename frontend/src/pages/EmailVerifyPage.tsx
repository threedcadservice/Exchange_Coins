import { useReactiveVar } from '@apollo/client'
import { Alert, Button, Input } from 'antd'
import React, { useState, useContext } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { AppContext } from '../contexts'
import { colors } from '../styles/variables'
import { DefaultPageTemplate } from './shared/templates/DefaultPageTemplate'
import { verify } from '../services/UserService';
import { validate } from '../services/ValidationService';
import { languageVar } from '../variables/WalletVariable'
import { texts } from '../styles/text'

export default function EmailVerifyPage() {
  const history = useHistory()
  const language = useReactiveVar(languageVar)

  const location = useLocation();
  const {setUser} = useContext(AppContext)

  const [opt_num, setOptNum] = useState<string>()

  const submitVerify = async () => {
    if(!validate('Opt number', opt_num)) return;
    let data = {activation_code: location.state, opt_code: opt_num};
    const userdata = await verify(data);
    if(userdata !== ''){    
      setUser({
        authenticated: true,
        username: userdata['username'], 
        email: userdata['email'],
        exp: userdata['exp'],
        first_name: userdata['first_name'],
        last_name: userdata['last_name'],
        account: userdata['account'],
        photo: userdata['photo'],
        status: userdata['status']
      })
      history.push('/')
    }
  }

  return (
    <DefaultPageTemplate>
      <S.Container>
        <S.Box> 
          <div>
            <S.Title>
              {texts[language]['emailtitle']}
            </S.Title>                  
          </div>  
          <div>
            <div>
              <S.Input maxLength={60} value={opt_num} placeholder={texts[language]['emailcontent1']} onChange={event => setOptNum(event.target.value)} />
            </div>
            <div style={{marginTop: '20px'}}>
              <S.Button onClick={submitVerify}>
                {texts[language]['emailcontent2']}
              </S.Button>
            </div>
          </div>     
        </S.Box>
      </S.Container>
    </DefaultPageTemplate>
  )
}

const S = {
  Title: styled.div `
  font-size: 20px;
  font-weight: bold;
  color: ${(props)=>props.theme.gray['4']};
  @media (min-width: 400px) {
    font-size: 22px;
  }
  @media (min-width: ${props => props.theme.viewport.tablet}) {
    font-size: 22px;
  }
  @media (min-width: ${props => props.theme.viewport.desktop}) {
    font-size: 24px;
  }
`,
  Container: styled.div`
    width: 100%;
    justify-content: center;
    margin-top: 25vh;
    @media (min-width: ${props => props.theme.viewport.tablet}) {
      margin-top: 30vh;    
      display: flex;
    }
  `,
  Button: styled(Button)`
    border-radius: 8px;
    background-color: ${colors.red1};
    color: ${colors.white};
    border: none;
    box-shadow: none;
    width: 100px;
    font-size: 16px;
    font-weight: bold;
    height: 40px;
    padding-bottom: 7px;

    &:hover,
    &:active,
    &:focus {
      background-color: ${colors.red2};
      color: ${colors.white};
      opacity: 0.8;
      box-shadow: none;
      border: none;
    }
  `,
  Input: styled(Input)`
    border-radius: 5px;
    background: ${(props)=>props.theme.gray['0']};
    color: ${(props)=>props.theme.gray['4']};
    border: 1px solid ${(props)=>props.theme.gray['2']};
    box-shadow: 1px 1px 5px hsl(0deg 0% 0% / 5%);
    margin-top: 20px;
  `,
  Alert: styled(Alert)`
    border-radius: 8px;
    font-weight: 400;

    .ant-alert-message {
      margin-bottom: 8px;
      font-size: 14px;
    }
  `,
  Box: styled.div`
    width: 100%;
    max-width: 400px;
    height: 180px;
    display: block !important;
    padding: 20px;    
    border: 1px solid ${(props)=>props.theme.gray['2']};
    border-radius: 5px;
    @media (min-width: 400px) {
      height: 190px;
    }
    @media (min-width: ${props => props.theme.viewport.tablet}) {
      width: 50%;
      display: inline-block !important;
    }
    @media (min-width: ${props => props.theme.viewport.desktop}) {
      width: 50%;
      display: inline-block !important;
    }
  `
}

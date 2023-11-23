import React from 'react'
import { Row } from 'antd'
import styled from 'styled-components'
import { DefaultPageTemplate } from './shared/templates/DefaultPageTemplate'

export default function SupportPage() {
  return (
    <>    
    <DefaultPageTemplate bgGray fullWidth >
      <Row justify="center" style={{margin: '0px', width: '100%'}}>
        <S.SwapCard>
          <iframe seamless={true} src="http://localhost/ftx/support.html"></iframe>
        </S.SwapCard>
      </Row>
    </DefaultPageTemplate>
    </>
  )
}

export const S = {
  SwapCard: styled.div`
    text-align: center;
    width: 100%;
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
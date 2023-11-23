import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Row, Col } from 'antd'
import { Link } from 'react-router-dom'
import "antd/dist/antd.css";
import "../../../../styles/globalstyle.css";


export type DashboardCardTemplateProps = {
  onClick?: () => void
  card_title?: string
  description?: string
  button_string?: string
  link?: string
  icon?: ReactNode
  children?: ReactNode
}

export function DashboardCard({
    card_title,
    description,
    button_string,
    link,
    icon,
    children,
    onClick
}: DashboardCardTemplateProps) {
  
  const handleClick = () => {
    onClick()
  }
  return (
    <>
        <S.Card>
            <div>
            <Row>
                <Col span={20}>
                <S.Label3 style={{fontSize: 28, fontWeight: 'bold'}}>
                    {card_title}
                </S.Label3>
                </Col>
                <Col span={4} style={{paddingTop: '7px', textAlign:'right'}}>
                    <S.Icon>
                        {icon}
                    </S.Icon>
                    
                </Col>
                <Col span={24} style={{minHeight: '60px'}}>
                    <S.Label3 style={{fontSize: 14}}>
                        {description}
                    </S.Label3>
                </Col>
                <Col span={24} style={{textAlign:'center'}}>
                <div style={{paddingTop: '20px'}}>
                    <S.Link to={link}>{button_string}</S.Link>
                </div>
                </Col>
            </Row>
            </div>
        </S.Card>

    </>
  )
}


const S = {
    Label3: styled.div`
        color: ${props=>props.theme.gray['5']};
    `,
    Card: styled.div`
        border-radius: 10px;
        align-item: center;
        background-color: ${(props)=>props.theme.gray['1']};
        margin: 20px 0px;
        padding: 20px;
        box-shadow: 1px 2px 5px ${(props)=>props.theme.gray['2']};
        @media (min-width: 1024px) {
            margin: 20px 20px; 
        }
    `,
    Link: styled(Link)`
        border-radius: 5px;
        background-color: ${props=>props.theme.gray['5']};
        color: ${props=>props.theme.gray['1']} !important;    
        box-shadow: none;
        width: 100%;
        font-size: 16px;
        font-weight: bold;
        padding: 10px 35px;
        cursor: pointer;

        &:hover,
        &:active,
        &:focus {
            color: #1890ff !important;
            box-shadow: none;
            border: solid 1px #1890ff;
        }    
    `,
    Icon: styled.div`
        color: ${props=>props.theme.gray['5']};
        font-weight: bold;
    `
}

import { useReactiveVar } from '@apollo/client'
//import { widget } from "./charting_library";
import React, { useEffect } from 'react'
import { Row } from 'antd'
import { tokenNameVar, contractAddressVar, multiplyerVar } from '../../variables/WalletVariable'
import styled from 'styled-components'
import PricesFeed from './datafeed/datafeed'

function getLocalLanguage() {
  return navigator.language.split('-')[0] || 'en'
}

export default function TradingViewComponent(props) {  
  const tokenName = useReactiveVar(tokenNameVar)
  const Contract_address = useReactiveVar(contractAddressVar)
  const multiplier = useReactiveVar(multiplyerVar)
  let DataFeed = null;

  useEffect(() => {
    DataFeed = new PricesFeed({address: Contract_address, network: tokenName, multival: multiplier, index: props.index});
    let widgetOptions = {
      symbol: 'Bitfinex:BTC/USD', // default symbol
      interval: '15', // default interval
      fullscreen: true, // displays the chart in the fullscreen mode
      container_id: `tv_chart_container` + props.index,
      datafeed: DataFeed,
      library_path: '/scripts/charting_library/',
      theme: 'Dark',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      locale: getLocalLanguage(),
      autosize: true
    }
    let tradingViewWidget = window.tvWidget = new window.TradingView.widget(
      widgetOptions
    );
    if (tradingViewWidget) return;
    tradingViewWidget.onChartReady(() => {
      tradingViewWidget.activeChart();
    });
  }, [Contract_address]);

  return (
    <S.Row>
      <div id={`tv_chart_container${props.index }`} className='tv_chart_container' style={{ width: '100%', height: '100%'}}></div>
    </S.Row>
  );
}

export const S = {
  Row: styled(Row)`
    width: 100%;
    height: 100%;

    .tv_chart_container {
      iframe{
        height: 100% !important;
      }
    }
  `
}
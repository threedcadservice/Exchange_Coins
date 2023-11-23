import { useReactiveVar } from '@apollo/client'
import { widget } from "./charting_library"
import React, { useEffect, useState } from 'react';
import { Row } from 'antd'
import axios from 'axios';
import { networkVar } from '../../variables/WalletVariable'
import styled from 'styled-components'

export default function TradingViewComponent() {
  const [isLoading, setIsLoading] = useState(true);
  const network = useReactiveVar(networkVar)

  const [timeframe, setTimeframe] = useState(15);

  const configurationData = {
    supported_resolutions: ['1', '3', '5', '15', '30', '1h', '2h', '4h', '1D', '1W'],
    exchanges: [{ 
      value: 'value',
      name: 'name',
      desc: 'desc',
    }
    ],
  };

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      await axios.post(`${process.env.REACT_APP_BASE_URL}/trending/getChartData`, {
        address: network.address,
        network: network.network,
        from: '1644872497',
        to: (new Date().getTime() / 1000).toFixed(0)
      })
        .then(res => {
          if (res.data) {
            let Data = [];
            for (let index = 0; index < res.data.t.length; index++) {
              Data.push({
                time: res.data.t[index],
                low: res.data.l[index],
                high: res.data.h[index],
                open: res.data.o[index],
                close: res.data.c[index]
              })
            }
            setIsLoading(false);
            setChartData(Data);
          }
        })
        .catch(err => {
          console.log(err, 'error');
        })
    }
    if (network.address) {
      fetchData();
    }
  }, [network])

  let Datafeed = {
    onReady: (callback) => {
      setTimeout(() => callback(configurationData));
    },
    resolveSymbol: async (
      symbolName,
      onSymbolResolvedCallback,
      onResolveErrorCallback,
    ) => {
      var symbolData = {
        ticker: `USD`,
        name: `${network.name}`,
        description: `${network.description}`,
        type: "crypto",
        session: '24x7',
        timezone: 'Etc/UTC',
        exchange: `${network.AMM}`,
        minmov: 1,
        pricescale: 1000000000,
        has_intraday: true,
        has_no_volume: true,
        has_weekly_and_monthly: false,
        supported_resolutions: configurationData.supported_resolutions,
        volume_precision: 2,
        data_status: 'streaming',
      }
      onSymbolResolvedCallback(symbolData);
    },
    getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
      const { from, to } = periodParams;
      try {

        let bars = [];
        chartData.forEach(bar => {
          if (bar.time * 1000 >= from * 1000 && bar.time * 1000 < to * 1000) {
            bars = [...bars, {
              time: bar.time * 1000,
              low: bar.low,
              high: bar.high,
              open: bar.open,
              close: bar.close,
            }];
          }
        });
        setIsLoading(false);

        onHistoryCallback(bars, {
          noData: false,
        });

      } catch (error) {
        onErrorCallback(error);
      }
    },
  }

  useEffect(() => {
    if (chartData.length) {
      window.tvWidget = new widget({
        symbol: 'Bitfinex:BTC/USD', // default symbol
        interval: timeframe, // default interval
        fullscreen: true, // displays the chart in the fullscreen mode
        container: 'tv_chart_container',
        datafeed: Datafeed,
        library_path: './charting_library/',
        theme: 'Dark'
      });
    }
  }, [chartData])

  return (
    <S.Row>
      <div id="tv_chart_container" className='tradingChart' sx={{ width: '100%', height: '60vh', display: isLoading ? 'none':'bock' }}></div>
    </S.Row>
  );
}

export const S = {
  Row: styled(Row)`
    width: 100%;
    height: 100%;

    .tradingChart {
      iframe{
        height: 100% !important;
      }
    }
  `
}
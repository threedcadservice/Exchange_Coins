import priceWS from './socketClient'
import axios from 'axios';

export default class PricesFeed {
  constructor(options) {
    this.debug = options.debug || false
    this.token = options.address
    this.network = options.network
    this.multival = options.multival
    this.index = options.index
    this.name = ''
    this.exchange = ''
    this.description = ''
    this.ws = new priceWS(this.index, this.multival, this.name, this.token, this.network)
  }

  exchangeSymbols() {
    return axios.post(`${process.env.REACT_APP_BASE_URL}/trending/search`, {
      value: this.token,
      network: this.network
    }).then(res => {
      if (res.data.total !== 0) {
        if (res.data.total === 1) {
          return res.data.data[0]
        }
      }
      return null
    })
  }

  exchangeKlines(interval, startTime, endTime) {
     return axios.post(`${process.env.REACT_APP_BASE_URL}/trending/getChartData`, {
        address: this.token,
        network: this.network,
        resolution: interval,
        from: (startTime / 1000).toFixed(0),
        to: (endTime / 1000).toFixed(0)
    }).then(res => {
        if (res.data) {
            return res.data
        }
        return {}
    }).catch(err => {
        console.log(err, 'error');
        return {}
    })
  }

  // chart specific functions below, impt that their function names stay same
  onReady(callback) {
    this.exchangeSymbols().then((symbols) => {
      this.name = symbols.name
      this.exchange = symbols.AMM
      this.description = symbols.description
      callback({
        supports_marks: false,
        supports_timescale_marks: false,
        supports_time: true,
        supported_resolutions: [
          '1', '3', '5', '15', '30', '60', '120', '240', '360', '480', '720', '1D', '3D', '1W', '1M'
        ]
      })
    }).catch(err => {
      console.error(err)
    })
  }

  resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    console.log('👉 resolveSymbol:', symbolName)
    
    setTimeout(() => {
        onSymbolResolvedCallback({
            name: this.name,
            description: this.description,
            ticker: 'USD',
            exchange: this.exchange,
            type: 'crypto',
            session: '24x7',
            minmov: 1,
            pricescale: 1000000000,
            has_intraday: true,
            has_daily: true,
            has_weekly_and_monthly: true
        })
    }, 0)
  }

  getBars(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
    let totalKlines = {}
    //const kLinesLimit = 500
    const finishKlines = () => {
      if (Object.keys(totalKlines).length === 0 || totalKlines.t.length === 0) {
        onHistoryCallback([], { noData: true })
      } else {
        let historyCBArray = []
        
        for (let index = 0; index < totalKlines.t.length; index++) {
            if(this.index == 1) {
                historyCBArray.push({
                    time: totalKlines.t[index]*1000,
                    low: totalKlines.l[index],
                    high: totalKlines.h[index],
                    open: totalKlines.o[index],
                    close: totalKlines.c[index]
                })
            } else {
                historyCBArray.push({
                    time: totalKlines.t[index]*1000,
                    low: Math.round(totalKlines.l[index] * this.multival * 100) / 100,
                    high: Math.round(totalKlines.h[index] * this.multival * 100) / 100,
                    open: Math.round(totalKlines.o[index] * this.multival * 100) / 100,
                    close: Math.round(totalKlines.c[index] * this.multival * 100) / 100,
                })
            }
        }
        
        onHistoryCallback(historyCBArray, { noData: false })
      }
    }

    const getKlines = async (from, to) => {
      try {
        const data = await this.exchangeKlines(resolution, from, to)
        totalKlines = data
        finishKlines()

      }
      catch (e) {
        console.error(e)
        onErrorCallback(`Error in 'getKlines' func`)
      }
    }

    from *= 1000
    to *= 1000
    getKlines(from, to)
  }

  subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
    this.ws.subscribeOnStream(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback)
  }

  unsubscribeBars(subscriberUID) {
    this.ws.unsubscribeFromStream(subscriberUID)
  }
}

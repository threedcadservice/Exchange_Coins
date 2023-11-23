import io from 'socket.io-client'; 

export default class SocketClient {
  constructor(index, multival, name, address, network) {
    this.streams = {}; // e.g: {'BTCUSDT': { paramStr: '', data:{}, listener:  } }
    this.index = index;
    this.multival = multival;
    this.name = name;
    this.socketConnected = false;
    this.address = address;
    this.network = network;
    this._ws = null;
    this._createSocket();

    this.timeInterval = null;
  }

  _createSocket() {
    this._ws = io('ws://localhost:5000');
    let tempObj = this;
    this._ws.on('connect', function() {
      console.log("connected")
      tempObj.socketConnected = true;
    });

    this._ws.on('disconnect', function() {
      tempObj.socketConnected = false;
    });

    this._ws.on('prices', function(data) {
      console.log("dd")
      if (!data) return
      try {
        // Update data
        let lastSocketData;
        if(tempObj.index == 1) {
          lastSocketData = {
            time: data.t*1000,
            close: data.c,
            open: data.o,
            high: data.h,
            low: data.l
          }
        } else {
          lastSocketData = {
            time: data.t*1000,
            close: Math.round(data.c * tempObj.multival * 100) / 100,
            open: Math.round(data.o * tempObj.multival * 100) / 100,
            high: Math.round(data.h * tempObj.multival * 100) / 100,
            low: Math.round(data.l * tempObj.multival * 100) / 100
          }
        }
        if (Object.keys(tempObj.streams).length) {
          tempObj.streams['USD']['data'] = lastSocketData
          tempObj.streams['USD'].listener(lastSocketData)
        }
      } catch (e) {
        console.error(e)
      }
    })
  }

  subscribeOnStream(symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback, lastDailyBar) {
    let tempObj = this;
    this.timeInterval = setInterval(function() {   
      if (tempObj.socketConnected) {
        tempObj._ws.emit('gettingprice', {
          coin: tempObj.address,
          network: tempObj.network,
          interval: resolution
        })

        tempObj.streams['USD'] = {  //register multiple streams in streams object
          listener: onRealtimeCallback
        }

        clearInterval(tempObj.timeInterval)
      }
    }, 1000)
  }

  unsubscribeFromStream(subscriberUID) {
    try {
      let id = subscriberUID.split("_")[0]
      
      delete this.streams['USD']
      if (this.socketConnected) {
        this._ws.emit('end')
        this._ws.disconnect();
      }
    }
    catch (e) {
      console.error(e)
    }
  }
}

var ble= {
    id :0,
	devices : [],
    stringReceived:'',
    callback:0,
    r_callback:0,
    listDevice:function(callback){
         ble.callback=callback;
        chrome.serial.getDevices(ble.onGetDevices);
    },
    onGetDevices : function(ports) {
      ble.callback(ports);
    },

    connect:function(port,speed,callback){
        ble.callback=callback;
        chrome.serial.connect(port, {bitrate: speed}, ble.onConnect);
    },
    disconect:function(callback){
        ble.callback=callback;
        chrome.serial.disconnect(ble.id, ble.onDisconnect);
    },
    onConnect : function(connectionInfo) {
            ble.id = connectionInfo.connectionId;
            console.log( ble.id);
            ble.callback(ble.id);
           // chrome.serial.onReceive.addListener(ble.onReceiveCallback);
    },
    setReceive:function(callback){
         ble.r_callback=callback;
         chrome.serial.onReceive.addListener(ble.onReceiveCallback);
    },
    onDisconnect : function(result) {
        if (result) {
            ble.callback("ok");
            console.log("Disconnected from the serial port");
        } else {
            ble.callback("nok");
            console.log("Disconnect failed");
        }
    },

    send:function(data,callback){
        ble.callback=callback;
         chrome.serial.send(  ble.id, ble.convertStringToArrayBuffer(data), ble.onSend);
    },
    sendByte:function(data,callback){
         ble.callback=callback;

         chrome.serial.send(  ble.id,ble.convertToArrayBuffer(data), ble.onSend);
    },
     sendByte2:function(data,callback){
         ble.callback=callback;

         chrome.serial.send(  ble.id,data, ble.onSend);
    },
    package:function(data){

    },
    onSend:function(info){
         ble.callback(info);
    },

    onReceiveCallback : function(info) {
      ble.stringReceived="";
      if (info.connectionId == ble.id && info.data) {
            var buff = ble.convertArrayBufferToString(info.data);
            ble.r_callback(buff);
        }
    },

    convertToArrayBuffer:function(buffs) {
        console.log(buffs);
        var lan=buffs.length;
        var buf=new ArrayBuffer(lan+4);
        var bufView=new Uint8Array(buf);
        bufView[0]=126;
        bufView[1]=lan+1;
        bufView[2]=03;
        var chsum=3;
        for (var i=0; i<buffs.length; i++) {
            bufView[i+3]=buffs[i];
            //chsum+=buffs[i];
            chsum = (chsum ^ buffs[i]) & 0xFF;
           // chsum = (chsum >> 8) ^ CRCTable[str[i] ^ (chsum & 0x000000FF)];
        }
        //chsum=256-chsum;
        bufView[lan+4-1]=chsum;
        return buf;
    },
    convertStringToArrayBuffer:function(str) {
        var buf=new ArrayBuffer(str.length);
        var bufView=new Uint8Array(buf);
        for (var i=0; i<str.length; i++) {
            bufView[i]=str.charCodeAt(i);
        }
        return buf;
    },

    convertArrayBufferToString:function(str) {
        var Int8View  = new Int8Array(str);
		return Int8View;
    }



}

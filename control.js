(function () {
  'use strict';
    var isBrl=false;
    document.getElementById('btntran').addEventListener('click',function(){
        var str=document.getElementById("str").value;
        var buffs=brlc.translator(str);
        var unicode=brlc.toUnicode2800(buffs);
      
   	    var bb=convertToArrayBuffer(buffs);
        //var hexs=brlc.toHex(bb);
       // document.getElementById('brl_byte').innerHTML=hexs;
        document.getElementById('brl_out').innerHTML=unicode;
        if(isBrl){
            
            ble.sendByte2(bb,callback_send);
        }
    } );

      document.getElementById('btncon').addEventListener('click',function(){
          if(isBrl==false){
             var x=document.getElementById('devices');
             var port = x.options[x.selectedIndex].value;
             console.log(port);
             ble.connect(port,115200,callback_con)
          }else{
              ble.disconect(callback_decon);
          }
      });
      function callback_getdevice(ports){
        document.getElementById('devices').innerHTML='';
        document.getElementById('btncon').style.display = "none";
        for (var i=0; i<ports.length; i++) {
            console.log(ports[i].path);
            document.getElementById('devices').innerHTML+="<option value='"+ports[i].path+"'>"+ports[i].path+"</option>";
            document.getElementById('btncon').style.display = "inline";
        }
      }
      function callback_con(id){
          isBrl=true;
          document.getElementById('btncon').innerText="Disconnect";
          ble.setReceive(callback_rec);
      };
      function callback_send(info){
        
      };
      function callback_decon(info){
          isBrl=false;
          document.getElementById('btncon').innerText="Connect";
      };
      function callback_rec(buffs){
          var hexs=brlc.toHex(buffs);
          //console.log(buffs);
         // var unicode=brlc.toUnicode2800(buffs);
          document.getElementById('brl_byte2').innerHTML=hexs;
         // document.getElementById('brl_out2').innerHTML=unicode;
      };
    function  convertToArrayBuffer(buffs) {
        console.log(buffs);
        var lan=buffs.length;
        var buf=new ArrayBuffer(lan+4);
        var bufView=new Uint8Array(buf);
        document.getElementById('brl_byte').innerHTML="0x7e ";
        document.getElementById('brl_byte').innerHTML+="0x"+ (lan+1).toString(lan+1) +" ";
        document.getElementById('brl_byte').innerHTML+="0x03 ";
      
        bufView[0]=126;
        bufView[1]=lan+1;
        bufView[2]=3;
        var chsum=3;
        for (var i=0; i<buffs.length; i++) {
            bufView[i+3]=buffs[i];
            //chsum+=buffs[i];
            chsum = (chsum ^ buffs[i]) & 0xFF;
              document.getElementById('brl_byte').innerHTML+="0x" +buffs[i].toString(16)+" ";
           // chsum = (chsum >> 8) ^ CRCTable[str[i] ^ (chsum & 0x000000FF)];
        }
        //chsum=256-chsum;
        bufView[lan+4-1]=chsum;
        document.getElementById('brl_byte').innerHTML+="0x" +chsum.toString(16)+" ";
        return buf;
    };

      ble.listDevice(callback_getdevice);
})();
/* Hearth bundle – built by tools/build.sh. Edit src/app.js, not this file. */
(function () {
/*******************************************************************************
 * Copyright (c) 2013, 2016 IBM Corp.
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * and Eclipse Distribution License v1.0 which accompany this distribution.
 *
 * The Eclipse Public License is available at
 *    http://www.eclipse.org/legal/epl-v10.html
 * and the Eclipse Distribution License is available at
 *   http://www.eclipse.org/org/documents/edl-v10.php.
 *
 *******************************************************************************/
(function(t,q){"object"===typeof exports&&"object"===typeof module?module.exports=q():"function"===typeof define&&define.amd?define(q):"object"===typeof exports?exports=q():t.Paho=q()})(this,function(){return function(t){function q(a,b,c){b[c++]=a>>8;b[c++]=a%256;return c}function r(a,b,c,k){k=q(b,c,k);E(a,c,k);return k+b}function n(a){for(var b=0,c=0;c<a.length;c++){var k=a.charCodeAt(c);2047<k?(55296<=k&&56319>=k&&(c++,b++),b+=3):127<k?b+=2:b++}return b}function E(a,b,c){for(var k=0;k<a.length;k++){var e=
    a.charCodeAt(k);if(55296<=e&&56319>=e){var g=a.charCodeAt(++k);if(isNaN(g))throw Error(f(h.MALFORMED_UNICODE,[e,g]));e=(e-55296<<10)+(g-56320)+65536}127>=e?b[c++]=e:(2047>=e?b[c++]=e>>6&31|192:(65535>=e?b[c++]=e>>12&15|224:(b[c++]=e>>18&7|240,b[c++]=e>>12&63|128),b[c++]=e>>6&63|128),b[c++]=e&63|128)}return b}function F(a,b,c){for(var k="",e,g=b;g<b+c;){e=a[g++];if(!(128>e)){var m=a[g++]-128;if(0>m)throw Error(f(h.MALFORMED_UTF,[e.toString(16),m.toString(16),""]));if(224>e)e=64*(e-192)+m;else{var d=
    a[g++]-128;if(0>d)throw Error(f(h.MALFORMED_UTF,[e.toString(16),m.toString(16),d.toString(16)]));if(240>e)e=4096*(e-224)+64*m+d;else{var l=a[g++]-128;if(0>l)throw Error(f(h.MALFORMED_UTF,[e.toString(16),m.toString(16),d.toString(16),l.toString(16)]));if(248>e)e=262144*(e-240)+4096*m+64*d+l;else throw Error(f(h.MALFORMED_UTF,[e.toString(16),m.toString(16),d.toString(16),l.toString(16)]));}}}65535<e&&(e-=65536,k+=String.fromCharCode(55296+(e>>10)),e=56320+(e&1023));k+=String.fromCharCode(e)}return k}
    var s=t.localStorage||function(){var a={};return{setItem:function(b,c){a[b]=c},getItem:function(b){return a[b]},removeItem:function(b){delete a[b]}}}(),A=function(a,b){for(var c in a)if(a.hasOwnProperty(c))if(b.hasOwnProperty(c)){if(typeof a[c]!==b[c])throw Error(f(h.INVALID_TYPE,[typeof a[c],c]));}else{c="Unknown property, "+c+". Valid properties are:";for(var k in b)b.hasOwnProperty(k)&&(c=c+" "+k);throw Error(c);}},u=function(a,b){return function(){return a.apply(b,arguments)}},h={OK:{code:0,text:"AMQJSC0000I OK."},
    CONNECT_TIMEOUT:{code:1,text:"AMQJSC0001E Connect timed out."},SUBSCRIBE_TIMEOUT:{code:2,text:"AMQJS0002E Subscribe timed out."},UNSUBSCRIBE_TIMEOUT:{code:3,text:"AMQJS0003E Unsubscribe timed out."},PING_TIMEOUT:{code:4,text:"AMQJS0004E Ping timed out."},INTERNAL_ERROR:{code:5,text:"AMQJS0005E Internal error. Error Message: {0}, Stack trace: {1}"},CONNACK_RETURNCODE:{code:6,text:"AMQJS0006E Bad Connack return code:{0} {1}."},SOCKET_ERROR:{code:7,text:"AMQJS0007E Socket error:{0}."},SOCKET_CLOSE:{code:8,
    text:"AMQJS0008I Socket closed."},MALFORMED_UTF:{code:9,text:"AMQJS0009E Malformed UTF data:{0} {1} {2}."},UNSUPPORTED:{code:10,text:"AMQJS0010E {0} is not supported by this browser."},INVALID_STATE:{code:11,text:"AMQJS0011E Invalid state {0}."},INVALID_TYPE:{code:12,text:"AMQJS0012E Invalid type {0} for {1}."},INVALID_ARGUMENT:{code:13,text:"AMQJS0013E Invalid argument {0} for {1}."},UNSUPPORTED_OPERATION:{code:14,text:"AMQJS0014E Unsupported operation."},INVALID_STORED_DATA:{code:15,text:"AMQJS0015E Invalid data in local storage key\x3d{0} value\x3d{1}."},
    INVALID_MQTT_MESSAGE_TYPE:{code:16,text:"AMQJS0016E Invalid MQTT message type {0}."},MALFORMED_UNICODE:{code:17,text:"AMQJS0017E Malformed Unicode string:{0} {1}."},BUFFER_FULL:{code:18,text:"AMQJS0018E Message buffer is full, maximum buffer size: {0}."}},H={0:"Connection Accepted",1:"Connection Refused: unacceptable protocol version",2:"Connection Refused: identifier rejected",3:"Connection Refused: server unavailable",4:"Connection Refused: bad user name or password",5:"Connection Refused: not authorized"},
    f=function(a,b){var c=a.text;if(b)for(var k,e,g=0;g<b.length;g++)if(k="{"+g+"}",e=c.indexOf(k),0<e)var h=c.substring(0,e),c=c.substring(e+k.length),c=h+b[g]+c;return c},B=[0,6,77,81,73,115,100,112,3],C=[0,4,77,81,84,84,4],p=function(a,b){this.type=a;for(var c in b)b.hasOwnProperty(c)&&(this[c]=b[c])};p.prototype.encode=function(){var a=(this.type&15)<<4,b=0,c=[],k=0,e;void 0!==this.messageIdentifier&&(b+=2);switch(this.type){case 1:switch(this.mqttVersion){case 3:b+=B.length+3;break;case 4:b+=C.length+
    3}b+=n(this.clientId)+2;void 0!==this.willMessage&&(b+=n(this.willMessage.destinationName)+2,e=this.willMessage.payloadBytes,e instanceof Uint8Array||(e=new Uint8Array(h)),b+=e.byteLength+2);void 0!==this.userName&&(b+=n(this.userName)+2);void 0!==this.password&&(b+=n(this.password)+2);break;case 8:for(var a=a|2,g=0;g<this.topics.length;g++)c[g]=n(this.topics[g]),b+=c[g]+2;b+=this.requestedQos.length;break;case 10:a|=2;for(g=0;g<this.topics.length;g++)c[g]=n(this.topics[g]),b+=c[g]+2;break;case 6:a|=
    2;break;case 3:this.payloadMessage.duplicate&&(a|=8);a=a|=this.payloadMessage.qos<<1;this.payloadMessage.retained&&(a|=1);var k=n(this.payloadMessage.destinationName),h=this.payloadMessage.payloadBytes,b=b+(k+2)+h.byteLength;h instanceof ArrayBuffer?h=new Uint8Array(h):h instanceof Uint8Array||(h=new Uint8Array(h.buffer))}var f=b,g=Array(1),d=0;do{var z=f%128,f=f>>7;0<f&&(z|=128);g[d++]=z}while(0<f&&4>d);f=g.length+1;b=new ArrayBuffer(b+f);d=new Uint8Array(b);d[0]=a;d.set(g,1);if(3==this.type)f=r(this.payloadMessage.destinationName,
    k,d,f);else if(1==this.type){switch(this.mqttVersion){case 3:d.set(B,f);f+=B.length;break;case 4:d.set(C,f),f+=C.length}a=0;this.cleanSession&&(a=2);void 0!==this.willMessage&&(a=a|4|this.willMessage.qos<<3,this.willMessage.retained&&(a|=32));void 0!==this.userName&&(a|=128);void 0!==this.password&&(a|=64);d[f++]=a;f=q(this.keepAliveInterval,d,f)}void 0!==this.messageIdentifier&&(f=q(this.messageIdentifier,d,f));switch(this.type){case 1:f=r(this.clientId,n(this.clientId),d,f);void 0!==this.willMessage&&
    (f=r(this.willMessage.destinationName,n(this.willMessage.destinationName),d,f),f=q(e.byteLength,d,f),d.set(e,f),f+=e.byteLength);void 0!==this.userName&&(f=r(this.userName,n(this.userName),d,f));void 0!==this.password&&r(this.password,n(this.password),d,f);break;case 3:d.set(h,f);break;case 8:for(g=0;g<this.topics.length;g++)f=r(this.topics[g],c[g],d,f),d[f++]=this.requestedQos[g];break;case 10:for(g=0;g<this.topics.length;g++)f=r(this.topics[g],c[g],d,f)}return b};var G=function(a,b){this._client=
    a;this._keepAliveInterval=1E3*b;this.isReset=!1;var c=(new p(12)).encode(),k=function(a){return function(){return e.apply(a)}},e=function(){this.isReset?(this.isReset=!1,this._client._trace("Pinger.doPing","send PINGREQ"),this._client.socket.send(c),this.timeout=setTimeout(k(this),this._keepAliveInterval)):(this._client._trace("Pinger.doPing","Timed out"),this._client._disconnected(h.PING_TIMEOUT.code,f(h.PING_TIMEOUT)))};this.reset=function(){this.isReset=!0;clearTimeout(this.timeout);0<this._keepAliveInterval&&
    (this.timeout=setTimeout(k(this),this._keepAliveInterval))};this.cancel=function(){clearTimeout(this.timeout)}},v=function(a,b,c,f){b||(b=30);this.timeout=setTimeout(function(a,b,c){return function(){return a.apply(b,c)}}(c,a,f),1E3*b);this.cancel=function(){clearTimeout(this.timeout)}},d=function(a,b,c,d,e){if(!("WebSocket"in t&&null!==t.WebSocket))throw Error(f(h.UNSUPPORTED,["WebSocket"]));if(!("ArrayBuffer"in t&&null!==t.ArrayBuffer))throw Error(f(h.UNSUPPORTED,["ArrayBuffer"]));this._trace("Paho.Client",
    a,b,c,d,e);this.host=b;this.port=c;this.path=d;this.uri=a;this.clientId=e;this._wsuri=null;this._localKey=b+":"+c+("/mqtt"!=d?":"+d:"")+":"+e+":";this._msg_queue=[];this._buffered_msg_queue=[];this._sentMessages={};this._receivedMessages={};this._notify_msg_sent={};this._message_identifier=1;this._sequence=0;for(var g in s)0!==g.indexOf("Sent:"+this._localKey)&&0!==g.indexOf("Received:"+this._localKey)||this.restore(g)};d.prototype.host=null;d.prototype.port=null;d.prototype.path=null;d.prototype.uri=
    null;d.prototype.clientId=null;d.prototype.socket=null;d.prototype.connected=!1;d.prototype.maxMessageIdentifier=65536;d.prototype.connectOptions=null;d.prototype.hostIndex=null;d.prototype.onConnected=null;d.prototype.onConnectionLost=null;d.prototype.onMessageDelivered=null;d.prototype.onMessageArrived=null;d.prototype.traceFunction=null;d.prototype._msg_queue=null;d.prototype._buffered_msg_queue=null;d.prototype._connectTimeout=null;d.prototype.sendPinger=null;d.prototype.receivePinger=null;d.prototype._reconnectInterval=
    1;d.prototype._reconnecting=!1;d.prototype._reconnectTimeout=null;d.prototype.disconnectedPublishing=!1;d.prototype.disconnectedBufferSize=5E3;d.prototype.receiveBuffer=null;d.prototype._traceBuffer=null;d.prototype._MAX_TRACE_ENTRIES=100;d.prototype.connect=function(a){var b=this._traceMask(a,"password");this._trace("Client.connect",b,this.socket,this.connected);if(this.connected)throw Error(f(h.INVALID_STATE,["already connected"]));if(this.socket)throw Error(f(h.INVALID_STATE,["already connected"]));
    this._reconnecting&&(this._reconnectTimeout.cancel(),this._reconnectTimeout=null,this._reconnecting=!1);this.connectOptions=a;this._reconnectInterval=1;this._reconnecting=!1;a.uris?(this.hostIndex=0,this._doConnect(a.uris[0])):this._doConnect(this.uri)};d.prototype.subscribe=function(a,b){this._trace("Client.subscribe",a,b);if(!this.connected)throw Error(f(h.INVALID_STATE,["not connected"]));var c=new p(8);c.topics=a.constructor===Array?a:[a];void 0===b.qos&&(b.qos=0);c.requestedQos=[];for(var d=
    0;d<c.topics.length;d++)c.requestedQos[d]=b.qos;b.onSuccess&&(c.onSuccess=function(a){b.onSuccess({invocationContext:b.invocationContext,grantedQos:a})});b.onFailure&&(c.onFailure=function(a){b.onFailure({invocationContext:b.invocationContext,errorCode:a,errorMessage:f(a)})});b.timeout&&(c.timeOut=new v(this,b.timeout,b.onFailure,[{invocationContext:b.invocationContext,errorCode:h.SUBSCRIBE_TIMEOUT.code,errorMessage:f(h.SUBSCRIBE_TIMEOUT)}]));this._requires_ack(c);this._schedule_message(c)};d.prototype.unsubscribe=
    function(a,b){this._trace("Client.unsubscribe",a,b);if(!this.connected)throw Error(f(h.INVALID_STATE,["not connected"]));var c=new p(10);c.topics=a.constructor===Array?a:[a];b.onSuccess&&(c.callback=function(){b.onSuccess({invocationContext:b.invocationContext})});b.timeout&&(c.timeOut=new v(this,b.timeout,b.onFailure,[{invocationContext:b.invocationContext,errorCode:h.UNSUBSCRIBE_TIMEOUT.code,errorMessage:f(h.UNSUBSCRIBE_TIMEOUT)}]));this._requires_ack(c);this._schedule_message(c)};d.prototype.send=
    function(a){this._trace("Client.send",a);var b=new p(3);b.payloadMessage=a;if(this.connected)0<a.qos?this._requires_ack(b):this.onMessageDelivered&&(this._notify_msg_sent[b]=this.onMessageDelivered(b.payloadMessage)),this._schedule_message(b);else if(this._reconnecting&&this.disconnectedPublishing){if(Object.keys(this._sentMessages).length+this._buffered_msg_queue.length>this.disconnectedBufferSize)throw Error(f(h.BUFFER_FULL,[this.disconnectedBufferSize]));0<a.qos?this._requires_ack(b):(b.sequence=
    ++this._sequence,this._buffered_msg_queue.unshift(b))}else throw Error(f(h.INVALID_STATE,["not connected"]));};d.prototype.disconnect=function(){this._trace("Client.disconnect");this._reconnecting&&(this._reconnectTimeout.cancel(),this._reconnectTimeout=null,this._reconnecting=!1);if(!this.socket)throw Error(f(h.INVALID_STATE,["not connecting or connected"]));var a=new p(14);this._notify_msg_sent[a]=u(this._disconnected,this);this._schedule_message(a)};d.prototype.getTraceLog=function(){if(null!==
    this._traceBuffer){this._trace("Client.getTraceLog",new Date);this._trace("Client.getTraceLog in flight messages",this._sentMessages.length);for(var a in this._sentMessages)this._trace("_sentMessages ",a,this._sentMessages[a]);for(a in this._receivedMessages)this._trace("_receivedMessages ",a,this._receivedMessages[a]);return this._traceBuffer}};d.prototype.startTrace=function(){null===this._traceBuffer&&(this._traceBuffer=[]);this._trace("Client.startTrace",new Date,"1.1.0-2018-11-22T11:35:36Z")};d.prototype.stopTrace=
    function(){delete this._traceBuffer};d.prototype._doConnect=function(a){this.connectOptions.useSSL&&(a=a.split(":"),a[0]="wss",a=a.join(":"));this._wsuri=a;this.connected=!1;this.socket=4>this.connectOptions.mqttVersion?new WebSocket(a,["mqttv3.1"]):new WebSocket(a,["mqtt"]);this.socket.binaryType="arraybuffer";this.socket.onopen=u(this._on_socket_open,this);this.socket.onmessage=u(this._on_socket_message,this);this.socket.onerror=u(this._on_socket_error,this);this.socket.onclose=u(this._on_socket_close,
    this);this.sendPinger=new G(this,this.connectOptions.keepAliveInterval);this.receivePinger=new G(this,this.connectOptions.keepAliveInterval);this._connectTimeout&&(this._connectTimeout.cancel(),this._connectTimeout=null);this._connectTimeout=new v(this,this.connectOptions.timeout,this._disconnected,[h.CONNECT_TIMEOUT.code,f(h.CONNECT_TIMEOUT)])};d.prototype._schedule_message=function(a){this._msg_queue.unshift(a);this.connected&&this._process_queue()};d.prototype.store=function(a,b){var c={type:b.type,
    messageIdentifier:b.messageIdentifier,version:1};switch(b.type){case 3:b.pubRecReceived&&(c.pubRecReceived=!0);c.payloadMessage={};for(var d="",e=b.payloadMessage.payloadBytes,g=0;g<e.length;g++)d=15>=e[g]?d+"0"+e[g].toString(16):d+e[g].toString(16);c.payloadMessage.payloadHex=d;c.payloadMessage.qos=b.payloadMessage.qos;c.payloadMessage.destinationName=b.payloadMessage.destinationName;b.payloadMessage.duplicate&&(c.payloadMessage.duplicate=!0);b.payloadMessage.retained&&(c.payloadMessage.retained=
    !0);0===a.indexOf("Sent:")&&(void 0===b.sequence&&(b.sequence=++this._sequence),c.sequence=b.sequence);break;default:throw Error(f(h.INVALID_STORED_DATA,[a+this._localKey+b.messageIdentifier,c]));}s.setItem(a+this._localKey+b.messageIdentifier,JSON.stringify(c))};d.prototype.restore=function(a){var b=s.getItem(a),c=JSON.parse(b),d=new p(c.type,c);switch(c.type){case 3:for(var b=c.payloadMessage.payloadHex,e=new ArrayBuffer(b.length/2),e=new Uint8Array(e),g=0;2<=b.length;){var m=parseInt(b.substring(0,
    2),16),b=b.substring(2,b.length);e[g++]=m}b=new w(e);b.qos=c.payloadMessage.qos;b.destinationName=c.payloadMessage.destinationName;c.payloadMessage.duplicate&&(b.duplicate=!0);c.payloadMessage.retained&&(b.retained=!0);d.payloadMessage=b;break;default:throw Error(f(h.INVALID_STORED_DATA,[a,b]));}0===a.indexOf("Sent:"+this._localKey)?(d.payloadMessage.duplicate=!0,this._sentMessages[d.messageIdentifier]=d):0===a.indexOf("Received:"+this._localKey)&&(this._receivedMessages[d.messageIdentifier]=d)};
    d.prototype._process_queue=function(){for(var a=null;a=this._msg_queue.pop();)this._socket_send(a),this._notify_msg_sent[a]&&(this._notify_msg_sent[a](),delete this._notify_msg_sent[a])};d.prototype._requires_ack=function(a){var b=Object.keys(this._sentMessages).length;if(b>this.maxMessageIdentifier)throw Error("Too many messages:"+b);for(;void 0!==this._sentMessages[this._message_identifier];)this._message_identifier++;a.messageIdentifier=this._message_identifier;this._sentMessages[a.messageIdentifier]=
    a;3===a.type&&this.store("Sent:",a);this._message_identifier===this.maxMessageIdentifier&&(this._message_identifier=1)};d.prototype._on_socket_open=function(){var a=new p(1,this.connectOptions);a.clientId=this.clientId;this._socket_send(a)};d.prototype._on_socket_message=function(a){this._trace("Client._on_socket_message",a.data);a=this._deframeMessages(a.data);for(var b=0;b<a.length;b+=1)this._handleMessage(a[b])};d.prototype._deframeMessages=function(a){a=new Uint8Array(a);var b=[];if(this.receiveBuffer){var c=
    new Uint8Array(this.receiveBuffer.length+a.length);c.set(this.receiveBuffer);c.set(a,this.receiveBuffer.length);a=c;delete this.receiveBuffer}try{for(c=0;c<a.length;){var d;a:{var e=a,g=c,m=g,n=e[g],l=n>>4,z=n&15,g=g+1,x=void 0,D=0,q=1;do{if(g==e.length){d=[null,m];break a}x=e[g++];D+=(x&127)*q;q*=128}while(0!==(x&128));x=g+D;if(x>e.length)d=[null,m];else{var y=new p(l);switch(l){case 2:e[g++]&1&&(y.sessionPresent=!0);y.returnCode=e[g++];break;case 3:var m=z>>1&3,s=256*e[g]+e[g+1],g=g+2,t=F(e,g,s),
    g=g+s;0<m&&(y.messageIdentifier=256*e[g]+e[g+1],g+=2);var r=new w(e.subarray(g,x));1==(z&1)&&(r.retained=!0);8==(z&8)&&(r.duplicate=!0);r.qos=m;r.destinationName=t;y.payloadMessage=r;break;case 4:case 5:case 6:case 7:case 11:y.messageIdentifier=256*e[g]+e[g+1];break;case 9:y.messageIdentifier=256*e[g]+e[g+1],g+=2,y.returnCode=e.subarray(g,x)}d=[y,x]}}var u=d[0],c=d[1];if(null!==u)b.push(u);else break}c<a.length&&(this.receiveBuffer=a.subarray(c))}catch(v){d="undefined"==v.hasOwnProperty("stack")?
    v.stack.toString():"No Error Stack Available";this._disconnected(h.INTERNAL_ERROR.code,f(h.INTERNAL_ERROR,[v.message,d]));return}return b};d.prototype._handleMessage=function(a){this._trace("Client._handleMessage",a);try{switch(a.type){case 2:this._connectTimeout.cancel();this._reconnectTimeout&&this._reconnectTimeout.cancel();if(this.connectOptions.cleanSession){for(var b in this._sentMessages){var c=this._sentMessages[b];s.removeItem("Sent:"+this._localKey+c.messageIdentifier)}this._sentMessages=
    {};for(b in this._receivedMessages){var d=this._receivedMessages[b];s.removeItem("Received:"+this._localKey+d.messageIdentifier)}this._receivedMessages={}}if(0===a.returnCode)this.connected=!0,this.connectOptions.uris&&(this.hostIndex=this.connectOptions.uris.length);else{this._disconnected(h.CONNACK_RETURNCODE.code,f(h.CONNACK_RETURNCODE,[a.returnCode,H[a.returnCode]]));break}a=[];for(var e in this._sentMessages)this._sentMessages.hasOwnProperty(e)&&a.push(this._sentMessages[e]);if(0<this._buffered_msg_queue.length)for(e=
    null;e=this._buffered_msg_queue.pop();)a.push(e),this.onMessageDelivered&&(this._notify_msg_sent[e]=this.onMessageDelivered(e.payloadMessage));a=a.sort(function(a,b){return a.sequence-b.sequence});e=0;for(var g=a.length;e<g;e++)if(c=a[e],3==c.type&&c.pubRecReceived){var m=new p(6,{messageIdentifier:c.messageIdentifier});this._schedule_message(m)}else this._schedule_message(c);if(this.connectOptions.onSuccess)this.connectOptions.onSuccess({invocationContext:this.connectOptions.invocationContext});
    c=!1;this._reconnecting&&(c=!0,this._reconnectInterval=1,this._reconnecting=!1);this._connected(c,this._wsuri);this._process_queue();break;case 3:this._receivePublish(a);break;case 4:if(c=this._sentMessages[a.messageIdentifier])if(delete this._sentMessages[a.messageIdentifier],s.removeItem("Sent:"+this._localKey+a.messageIdentifier),this.onMessageDelivered)this.onMessageDelivered(c.payloadMessage);break;case 5:if(c=this._sentMessages[a.messageIdentifier])c.pubRecReceived=!0,m=new p(6,{messageIdentifier:a.messageIdentifier}),
    this.store("Sent:",c),this._schedule_message(m);break;case 6:d=this._receivedMessages[a.messageIdentifier];s.removeItem("Received:"+this._localKey+a.messageIdentifier);d&&(this._receiveMessage(d),delete this._receivedMessages[a.messageIdentifier]);var n=new p(7,{messageIdentifier:a.messageIdentifier});this._schedule_message(n);break;case 7:c=this._sentMessages[a.messageIdentifier];delete this._sentMessages[a.messageIdentifier];s.removeItem("Sent:"+this._localKey+a.messageIdentifier);if(this.onMessageDelivered)this.onMessageDelivered(c.payloadMessage);
    break;case 9:if(c=this._sentMessages[a.messageIdentifier]){c.timeOut&&c.timeOut.cancel();if(128===a.returnCode[0]){if(c.onFailure)c.onFailure(a.returnCode)}else if(c.onSuccess)c.onSuccess(a.returnCode);delete this._sentMessages[a.messageIdentifier]}break;case 11:if(c=this._sentMessages[a.messageIdentifier])c.timeOut&&c.timeOut.cancel(),c.callback&&c.callback(),delete this._sentMessages[a.messageIdentifier];break;case 13:this.sendPinger.reset();break;case 14:this._disconnected(h.INVALID_MQTT_MESSAGE_TYPE.code,
    f(h.INVALID_MQTT_MESSAGE_TYPE,[a.type]));break;default:this._disconnected(h.INVALID_MQTT_MESSAGE_TYPE.code,f(h.INVALID_MQTT_MESSAGE_TYPE,[a.type]))}}catch(l){c="undefined"==l.hasOwnProperty("stack")?l.stack.toString():"No Error Stack Available",this._disconnected(h.INTERNAL_ERROR.code,f(h.INTERNAL_ERROR,[l.message,c]))}};d.prototype._on_socket_error=function(a){this._reconnecting||this._disconnected(h.SOCKET_ERROR.code,f(h.SOCKET_ERROR,[a.data]))};d.prototype._on_socket_close=function(){this._reconnecting||
    this._disconnected(h.SOCKET_CLOSE.code,f(h.SOCKET_CLOSE))};d.prototype._socket_send=function(a){if(1==a.type){var b=this._traceMask(a,"password");this._trace("Client._socket_send",b)}else this._trace("Client._socket_send",a);this.socket.send(a.encode());this.sendPinger.reset()};d.prototype._receivePublish=function(a){switch(a.payloadMessage.qos){case "undefined":case 0:this._receiveMessage(a);break;case 1:var b=new p(4,{messageIdentifier:a.messageIdentifier});this._schedule_message(b);this._receiveMessage(a);
    break;case 2:this._receivedMessages[a.messageIdentifier]=a;this.store("Received:",a);a=new p(5,{messageIdentifier:a.messageIdentifier});this._schedule_message(a);break;default:throw Error("Invaild qos\x3d"+a.payloadMessage.qos);}};d.prototype._receiveMessage=function(a){if(this.onMessageArrived)this.onMessageArrived(a.payloadMessage)};d.prototype._connected=function(a,b){if(this.onConnected)this.onConnected(a,b)};d.prototype._reconnect=function(){this._trace("Client._reconnect");this.connected||(this._reconnecting=
    !0,this.sendPinger.cancel(),this.receivePinger.cancel(),128>this._reconnectInterval&&(this._reconnectInterval*=2),this.connectOptions.uris?(this.hostIndex=0,this._doConnect(this.connectOptions.uris[0])):this._doConnect(this.uri))};d.prototype._disconnected=function(a,b){this._trace("Client._disconnected",a,b);if(void 0!==a&&this._reconnecting)this._reconnectTimeout=new v(this,this._reconnectInterval,this._reconnect);else if(this.sendPinger.cancel(),this.receivePinger.cancel(),this._connectTimeout&&
    (this._connectTimeout.cancel(),this._connectTimeout=null),this._msg_queue=[],this._buffered_msg_queue=[],this._notify_msg_sent={},this.socket&&(this.socket.onopen=null,this.socket.onmessage=null,this.socket.onerror=null,this.socket.onclose=null,1===this.socket.readyState&&this.socket.close(),delete this.socket),this.connectOptions.uris&&this.hostIndex<this.connectOptions.uris.length-1)this.hostIndex++,this._doConnect(this.connectOptions.uris[this.hostIndex]);else if(void 0===a&&(a=h.OK.code,b=f(h.OK)),
    this.connected){this.connected=!1;if(this.onConnectionLost)this.onConnectionLost({errorCode:a,errorMessage:b,reconnect:this.connectOptions.reconnect,uri:this._wsuri});a!==h.OK.code&&this.connectOptions.reconnect&&(this._reconnectInterval=1,this._reconnect())}else if(4===this.connectOptions.mqttVersion&&!1===this.connectOptions.mqttVersionExplicit)this._trace("Failed to connect V4, dropping back to V3"),this.connectOptions.mqttVersion=3,this.connectOptions.uris?(this.hostIndex=0,this._doConnect(this.connectOptions.uris[0])):
    this._doConnect(this.uri);else if(this.connectOptions.onFailure)this.connectOptions.onFailure({invocationContext:this.connectOptions.invocationContext,errorCode:a,errorMessage:b})};d.prototype._trace=function(){if(this.traceFunction){var a=Array.prototype.slice.call(arguments),b;for(b in a)"undefined"!==typeof a[b]&&a.splice(b,1,JSON.stringify(a[b]));b=a.join("");this.traceFunction({severity:"Debug",message:b})}if(null!==this._traceBuffer)for(b=0,a=arguments.length;b<a;b++)this._traceBuffer.length==
    this._MAX_TRACE_ENTRIES&&this._traceBuffer.shift(),0===b?this._traceBuffer.push(arguments[b]):"undefined"===typeof arguments[b]?this._traceBuffer.push(arguments[b]):this._traceBuffer.push("  "+JSON.stringify(arguments[b]))};d.prototype._traceMask=function(a,b){var c={},d;for(d in a)a.hasOwnProperty(d)&&(c[d]=d==b?"******":a[d]);return c};var w=function(a){var b;if("string"===typeof a||a instanceof ArrayBuffer||ArrayBuffer.isView(a)&&!(a instanceof DataView))b=a;else throw f(h.INVALID_ARGUMENT,[a,
    "newPayload"]);var c,d=0,e=!1,g=!1;Object.defineProperties(this,{payloadString:{enumerable:!0,get:function(){return"string"===typeof b?b:F(b,0,b.length)}},payloadBytes:{enumerable:!0,get:function(){if("string"===typeof b){var a=new ArrayBuffer(n(b)),a=new Uint8Array(a);E(b,a,0);return a}return b}},destinationName:{enumerable:!0,get:function(){return c},set:function(a){if("string"===typeof a)c=a;else throw Error(f(h.INVALID_ARGUMENT,[a,"newDestinationName"]));}},qos:{enumerable:!0,get:function(){return d},
    set:function(a){if(0===a||1===a||2===a)d=a;else throw Error("Invalid argument:"+a);}},retained:{enumerable:!0,get:function(){return e},set:function(a){if("boolean"===typeof a)e=a;else throw Error(f(h.INVALID_ARGUMENT,[a,"newRetained"]));}},topic:{enumerable:!0,get:function(){return c},set:function(a){c=a}},duplicate:{enumerable:!0,get:function(){return g},set:function(a){g=a}}})};return{Client:function(a,b,c,k){var e;if("string"!==typeof a)throw Error(f(h.INVALID_TYPE,[typeof a,"host"]));if(2==arguments.length){k=
    b;e=a;var g=e.match(/^(wss?):\/\/((\[(.+)\])|([^\/]+?))(:(\d+))?(\/.*)$/);if(g)a=g[4]||g[2],b=parseInt(g[7]),c=g[8];else throw Error(f(h.INVALID_ARGUMENT,[a,"host"]));}else{3==arguments.length&&(k=c,c="/mqtt");if("number"!==typeof b||0>b)throw Error(f(h.INVALID_TYPE,[typeof b,"port"]));if("string"!==typeof c)throw Error(f(h.INVALID_TYPE,[typeof c,"path"]));e="ws://"+(-1!==a.indexOf(":")&&"["!==a.slice(0,1)&&"]"!==a.slice(-1)?"["+a+"]":a)+":"+b+c}for(var m=g=0;m<k.length;m++){var n=k.charCodeAt(m);
    55296<=n&&56319>=n&&m++;g++}if("string"!==typeof k||65535<g)throw Error(f(h.INVALID_ARGUMENT,[k,"clientId"]));var l=new d(e,a,b,c,k);Object.defineProperties(this,{host:{get:function(){return a},set:function(){throw Error(f(h.UNSUPPORTED_OPERATION));}},port:{get:function(){return b},set:function(){throw Error(f(h.UNSUPPORTED_OPERATION));}},path:{get:function(){return c},set:function(){throw Error(f(h.UNSUPPORTED_OPERATION));}},uri:{get:function(){return e},set:function(){throw Error(f(h.UNSUPPORTED_OPERATION));
    }},clientId:{get:function(){return l.clientId},set:function(){throw Error(f(h.UNSUPPORTED_OPERATION));}},onConnected:{get:function(){return l.onConnected},set:function(a){if("function"===typeof a)l.onConnected=a;else throw Error(f(h.INVALID_TYPE,[typeof a,"onConnected"]));}},disconnectedPublishing:{get:function(){return l.disconnectedPublishing},set:function(a){l.disconnectedPublishing=a}},disconnectedBufferSize:{get:function(){return l.disconnectedBufferSize},set:function(a){l.disconnectedBufferSize=
    a}},onConnectionLost:{get:function(){return l.onConnectionLost},set:function(a){if("function"===typeof a)l.onConnectionLost=a;else throw Error(f(h.INVALID_TYPE,[typeof a,"onConnectionLost"]));}},onMessageDelivered:{get:function(){return l.onMessageDelivered},set:function(a){if("function"===typeof a)l.onMessageDelivered=a;else throw Error(f(h.INVALID_TYPE,[typeof a,"onMessageDelivered"]));}},onMessageArrived:{get:function(){return l.onMessageArrived},set:function(a){if("function"===typeof a)l.onMessageArrived=
    a;else throw Error(f(h.INVALID_TYPE,[typeof a,"onMessageArrived"]));}},trace:{get:function(){return l.traceFunction},set:function(a){if("function"===typeof a)l.traceFunction=a;else throw Error(f(h.INVALID_TYPE,[typeof a,"onTrace"]));}}});this.connect=function(a){a=a||{};A(a,{timeout:"number",userName:"string",password:"string",willMessage:"object",keepAliveInterval:"number",cleanSession:"boolean",useSSL:"boolean",invocationContext:"object",onSuccess:"function",onFailure:"function",hosts:"object",
    ports:"object",reconnect:"boolean",mqttVersion:"number",mqttVersionExplicit:"boolean",uris:"object"});void 0===a.keepAliveInterval&&(a.keepAliveInterval=60);if(4<a.mqttVersion||3>a.mqttVersion)throw Error(f(h.INVALID_ARGUMENT,[a.mqttVersion,"connectOptions.mqttVersion"]));void 0===a.mqttVersion?(a.mqttVersionExplicit=!1,a.mqttVersion=4):a.mqttVersionExplicit=!0;if(void 0!==a.password&&void 0===a.userName)throw Error(f(h.INVALID_ARGUMENT,[a.password,"connectOptions.password"]));if(a.willMessage){if(!(a.willMessage instanceof
    w))throw Error(f(h.INVALID_TYPE,[a.willMessage,"connectOptions.willMessage"]));a.willMessage.stringPayload=null;if("undefined"===typeof a.willMessage.destinationName)throw Error(f(h.INVALID_TYPE,[typeof a.willMessage.destinationName,"connectOptions.willMessage.destinationName"]));}"undefined"===typeof a.cleanSession&&(a.cleanSession=!0);if(a.hosts){if(!(a.hosts instanceof Array))throw Error(f(h.INVALID_ARGUMENT,[a.hosts,"connectOptions.hosts"]));if(1>a.hosts.length)throw Error(f(h.INVALID_ARGUMENT,
    [a.hosts,"connectOptions.hosts"]));for(var b=!1,d=0;d<a.hosts.length;d++){if("string"!==typeof a.hosts[d])throw Error(f(h.INVALID_TYPE,[typeof a.hosts[d],"connectOptions.hosts["+d+"]"]));if(/^(wss?):\/\/((\[(.+)\])|([^\/]+?))(:(\d+))?(\/.*)$/.test(a.hosts[d]))if(0===d)b=!0;else{if(!b)throw Error(f(h.INVALID_ARGUMENT,[a.hosts[d],"connectOptions.hosts["+d+"]"]));}else if(b)throw Error(f(h.INVALID_ARGUMENT,[a.hosts[d],"connectOptions.hosts["+d+"]"]));}if(b)a.uris=a.hosts;else{if(!a.ports)throw Error(f(h.INVALID_ARGUMENT,
    [a.ports,"connectOptions.ports"]));if(!(a.ports instanceof Array))throw Error(f(h.INVALID_ARGUMENT,[a.ports,"connectOptions.ports"]));if(a.hosts.length!==a.ports.length)throw Error(f(h.INVALID_ARGUMENT,[a.ports,"connectOptions.ports"]));a.uris=[];for(d=0;d<a.hosts.length;d++){if("number"!==typeof a.ports[d]||0>a.ports[d])throw Error(f(h.INVALID_TYPE,[typeof a.ports[d],"connectOptions.ports["+d+"]"]));var b=a.hosts[d],g=a.ports[d];e="ws://"+(-1!==b.indexOf(":")?"["+b+"]":b)+":"+g+c;a.uris.push(e)}}}l.connect(a)};
    this.subscribe=function(a,b){if("string"!==typeof a&&a.constructor!==Array)throw Error("Invalid argument:"+a);b=b||{};A(b,{qos:"number",invocationContext:"object",onSuccess:"function",onFailure:"function",timeout:"number"});if(b.timeout&&!b.onFailure)throw Error("subscribeOptions.timeout specified with no onFailure callback.");if("undefined"!==typeof b.qos&&0!==b.qos&&1!==b.qos&&2!==b.qos)throw Error(f(h.INVALID_ARGUMENT,[b.qos,"subscribeOptions.qos"]));l.subscribe(a,b)};this.unsubscribe=function(a,
    b){if("string"!==typeof a&&a.constructor!==Array)throw Error("Invalid argument:"+a);b=b||{};A(b,{invocationContext:"object",onSuccess:"function",onFailure:"function",timeout:"number"});if(b.timeout&&!b.onFailure)throw Error("unsubscribeOptions.timeout specified with no onFailure callback.");l.unsubscribe(a,b)};this.send=function(a,b,c,d){var e;if(0===arguments.length)throw Error("Invalid argument.length");if(1==arguments.length){if(!(a instanceof w)&&"string"!==typeof a)throw Error("Invalid argument:"+
    typeof a);e=a;if("undefined"===typeof e.destinationName)throw Error(f(h.INVALID_ARGUMENT,[e.destinationName,"Message.destinationName"]));}else e=new w(b),e.destinationName=a,3<=arguments.length&&(e.qos=c),4<=arguments.length&&(e.retained=d);l.send(e)};this.publish=function(a,b,c,d){var e;if(0===arguments.length)throw Error("Invalid argument.length");if(1==arguments.length){if(!(a instanceof w)&&"string"!==typeof a)throw Error("Invalid argument:"+typeof a);e=a;if("undefined"===typeof e.destinationName)throw Error(f(h.INVALID_ARGUMENT,
    [e.destinationName,"Message.destinationName"]));}else e=new w(b),e.destinationName=a,3<=arguments.length&&(e.qos=c),4<=arguments.length&&(e.retained=d);l.send(e)};this.disconnect=function(){l.disconnect()};this.getTraceLog=function(){return l.getTraceLog()};this.startTrace=function(){l.startTrace()};this.stopTrace=function(){l.stopTrace()};this.isConnected=function(){return l.connected}},Message:w}}("undefined"!==typeof global?global:"undefined"!==typeof self?self:"undefined"!==typeof window?window:
    {})});
}).call(window);
//---------------------------------------------------------------------
//
// QR Code Generator for JavaScript
//
// Copyright (c) 2009 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//  http://www.opensource.org/licenses/mit-license.php
//
// The word 'QR Code' is registered trademark of
// DENSO WAVE INCORPORATED
//  http://www.denso-wave.com/qrcode/faqpatent-e.html
//
//---------------------------------------------------------------------

var qrcode = function() {

  //---------------------------------------------------------------------
  // qrcode
  //---------------------------------------------------------------------

  /**
   * qrcode
   * @param typeNumber 1 to 40
   * @param errorCorrectionLevel 'L','M','Q','H'
   */
  var qrcode = function(typeNumber, errorCorrectionLevel) {

    var PAD0 = 0xEC;
    var PAD1 = 0x11;

    var _typeNumber = typeNumber;
    var _errorCorrectionLevel = QRErrorCorrectionLevel[errorCorrectionLevel];
    var _modules = null;
    var _moduleCount = 0;
    var _dataCache = null;
    var _dataList = [];

    var _this = {};

    var makeImpl = function(test, maskPattern) {

      _moduleCount = _typeNumber * 4 + 17;
      _modules = function(moduleCount) {
        var modules = new Array(moduleCount);
        for (var row = 0; row < moduleCount; row += 1) {
          modules[row] = new Array(moduleCount);
          for (var col = 0; col < moduleCount; col += 1) {
            modules[row][col] = null;
          }
        }
        return modules;
      }(_moduleCount);

      setupPositionProbePattern(0, 0);
      setupPositionProbePattern(_moduleCount - 7, 0);
      setupPositionProbePattern(0, _moduleCount - 7);
      setupPositionAdjustPattern();
      setupTimingPattern();
      setupTypeInfo(test, maskPattern);

      if (_typeNumber >= 7) {
        setupTypeNumber(test);
      }

      if (_dataCache == null) {
        _dataCache = createData(_typeNumber, _errorCorrectionLevel, _dataList);
      }

      mapData(_dataCache, maskPattern);
    };

    var setupPositionProbePattern = function(row, col) {

      for (var r = -1; r <= 7; r += 1) {

        if (row + r <= -1 || _moduleCount <= row + r) continue;

        for (var c = -1; c <= 7; c += 1) {

          if (col + c <= -1 || _moduleCount <= col + c) continue;

          if ( (0 <= r && r <= 6 && (c == 0 || c == 6) )
              || (0 <= c && c <= 6 && (r == 0 || r == 6) )
              || (2 <= r && r <= 4 && 2 <= c && c <= 4) ) {
            _modules[row + r][col + c] = true;
          } else {
            _modules[row + r][col + c] = false;
          }
        }
      }
    };

    var getBestMaskPattern = function() {

      var minLostPoint = 0;
      var pattern = 0;

      for (var i = 0; i < 8; i += 1) {

        makeImpl(true, i);

        var lostPoint = QRUtil.getLostPoint(_this);

        if (i == 0 || minLostPoint > lostPoint) {
          minLostPoint = lostPoint;
          pattern = i;
        }
      }

      return pattern;
    };

    var setupTimingPattern = function() {

      for (var r = 8; r < _moduleCount - 8; r += 1) {
        if (_modules[r][6] != null) {
          continue;
        }
        _modules[r][6] = (r % 2 == 0);
      }

      for (var c = 8; c < _moduleCount - 8; c += 1) {
        if (_modules[6][c] != null) {
          continue;
        }
        _modules[6][c] = (c % 2 == 0);
      }
    };

    var setupPositionAdjustPattern = function() {

      var pos = QRUtil.getPatternPosition(_typeNumber);

      for (var i = 0; i < pos.length; i += 1) {

        for (var j = 0; j < pos.length; j += 1) {

          var row = pos[i];
          var col = pos[j];

          if (_modules[row][col] != null) {
            continue;
          }

          for (var r = -2; r <= 2; r += 1) {

            for (var c = -2; c <= 2; c += 1) {

              if (r == -2 || r == 2 || c == -2 || c == 2
                  || (r == 0 && c == 0) ) {
                _modules[row + r][col + c] = true;
              } else {
                _modules[row + r][col + c] = false;
              }
            }
          }
        }
      }
    };

    var setupTypeNumber = function(test) {

      var bits = QRUtil.getBCHTypeNumber(_typeNumber);

      for (var i = 0; i < 18; i += 1) {
        var mod = (!test && ( (bits >> i) & 1) == 1);
        _modules[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod;
      }

      for (var i = 0; i < 18; i += 1) {
        var mod = (!test && ( (bits >> i) & 1) == 1);
        _modules[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
      }
    };

    var setupTypeInfo = function(test, maskPattern) {

      var data = (_errorCorrectionLevel << 3) | maskPattern;
      var bits = QRUtil.getBCHTypeInfo(data);

      // vertical
      for (var i = 0; i < 15; i += 1) {

        var mod = (!test && ( (bits >> i) & 1) == 1);

        if (i < 6) {
          _modules[i][8] = mod;
        } else if (i < 8) {
          _modules[i + 1][8] = mod;
        } else {
          _modules[_moduleCount - 15 + i][8] = mod;
        }
      }

      // horizontal
      for (var i = 0; i < 15; i += 1) {

        var mod = (!test && ( (bits >> i) & 1) == 1);

        if (i < 8) {
          _modules[8][_moduleCount - i - 1] = mod;
        } else if (i < 9) {
          _modules[8][15 - i - 1 + 1] = mod;
        } else {
          _modules[8][15 - i - 1] = mod;
        }
      }

      // fixed module
      _modules[_moduleCount - 8][8] = (!test);
    };

    var mapData = function(data, maskPattern) {

      var inc = -1;
      var row = _moduleCount - 1;
      var bitIndex = 7;
      var byteIndex = 0;
      var maskFunc = QRUtil.getMaskFunction(maskPattern);

      for (var col = _moduleCount - 1; col > 0; col -= 2) {

        if (col == 6) col -= 1;

        while (true) {

          for (var c = 0; c < 2; c += 1) {

            if (_modules[row][col - c] == null) {

              var dark = false;

              if (byteIndex < data.length) {
                dark = ( ( (data[byteIndex] >>> bitIndex) & 1) == 1);
              }

              var mask = maskFunc(row, col - c);

              if (mask) {
                dark = !dark;
              }

              _modules[row][col - c] = dark;
              bitIndex -= 1;

              if (bitIndex == -1) {
                byteIndex += 1;
                bitIndex = 7;
              }
            }
          }

          row += inc;

          if (row < 0 || _moduleCount <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    };

    var createBytes = function(buffer, rsBlocks) {

      var offset = 0;

      var maxDcCount = 0;
      var maxEcCount = 0;

      var dcdata = new Array(rsBlocks.length);
      var ecdata = new Array(rsBlocks.length);

      for (var r = 0; r < rsBlocks.length; r += 1) {

        var dcCount = rsBlocks[r].dataCount;
        var ecCount = rsBlocks[r].totalCount - dcCount;

        maxDcCount = Math.max(maxDcCount, dcCount);
        maxEcCount = Math.max(maxEcCount, ecCount);

        dcdata[r] = new Array(dcCount);

        for (var i = 0; i < dcdata[r].length; i += 1) {
          dcdata[r][i] = 0xff & buffer.getBuffer()[i + offset];
        }
        offset += dcCount;

        var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
        var rawPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1);

        var modPoly = rawPoly.mod(rsPoly);
        ecdata[r] = new Array(rsPoly.getLength() - 1);
        for (var i = 0; i < ecdata[r].length; i += 1) {
          var modIndex = i + modPoly.getLength() - ecdata[r].length;
          ecdata[r][i] = (modIndex >= 0)? modPoly.getAt(modIndex) : 0;
        }
      }

      var totalCodeCount = 0;
      for (var i = 0; i < rsBlocks.length; i += 1) {
        totalCodeCount += rsBlocks[i].totalCount;
      }

      var data = new Array(totalCodeCount);
      var index = 0;

      for (var i = 0; i < maxDcCount; i += 1) {
        for (var r = 0; r < rsBlocks.length; r += 1) {
          if (i < dcdata[r].length) {
            data[index] = dcdata[r][i];
            index += 1;
          }
        }
      }

      for (var i = 0; i < maxEcCount; i += 1) {
        for (var r = 0; r < rsBlocks.length; r += 1) {
          if (i < ecdata[r].length) {
            data[index] = ecdata[r][i];
            index += 1;
          }
        }
      }

      return data;
    };

    var createData = function(typeNumber, errorCorrectionLevel, dataList) {

      var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectionLevel);

      var buffer = qrBitBuffer();

      for (var i = 0; i < dataList.length; i += 1) {
        var data = dataList[i];
        buffer.put(data.getMode(), 4);
        buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber) );
        data.write(buffer);
      }

      // calc num max data.
      var totalDataCount = 0;
      for (var i = 0; i < rsBlocks.length; i += 1) {
        totalDataCount += rsBlocks[i].dataCount;
      }

      if (buffer.getLengthInBits() > totalDataCount * 8) {
        throw 'code length overflow. ('
          + buffer.getLengthInBits()
          + '>'
          + totalDataCount * 8
          + ')';
      }

      // end code
      if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
        buffer.put(0, 4);
      }

      // padding
      while (buffer.getLengthInBits() % 8 != 0) {
        buffer.putBit(false);
      }

      // padding
      while (true) {

        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(PAD0, 8);

        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(PAD1, 8);
      }

      return createBytes(buffer, rsBlocks);
    };

    _this.addData = function(data, mode) {

      mode = mode || 'Byte';

      var newData = null;

      switch(mode) {
      case 'Numeric' :
        newData = qrNumber(data);
        break;
      case 'Alphanumeric' :
        newData = qrAlphaNum(data);
        break;
      case 'Byte' :
        newData = qr8BitByte(data);
        break;
      case 'Kanji' :
        newData = qrKanji(data);
        break;
      default :
        throw 'mode:' + mode;
      }

      _dataList.push(newData);
      _dataCache = null;
    };

    _this.isDark = function(row, col) {
      if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
        throw row + ',' + col;
      }
      return _modules[row][col];
    };

    _this.getModuleCount = function() {
      return _moduleCount;
    };

    _this.make = function() {
      if (_typeNumber < 1) {
        var typeNumber = 1;

        for (; typeNumber < 40; typeNumber++) {
          var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, _errorCorrectionLevel);
          var buffer = qrBitBuffer();

          for (var i = 0; i < _dataList.length; i++) {
            var data = _dataList[i];
            buffer.put(data.getMode(), 4);
            buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber) );
            data.write(buffer);
          }

          var totalDataCount = 0;
          for (var i = 0; i < rsBlocks.length; i++) {
            totalDataCount += rsBlocks[i].dataCount;
          }

          if (buffer.getLengthInBits() <= totalDataCount * 8) {
            break;
          }
        }

        _typeNumber = typeNumber;
      }

      makeImpl(false, getBestMaskPattern() );
    };

    _this.createTableTag = function(cellSize, margin) {

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      var qrHtml = '';

      qrHtml += '<table style="';
      qrHtml += ' border-width: 0px; border-style: none;';
      qrHtml += ' border-collapse: collapse;';
      qrHtml += ' padding: 0px; margin: ' + margin + 'px;';
      qrHtml += '">';
      qrHtml += '<tbody>';

      for (var r = 0; r < _this.getModuleCount(); r += 1) {

        qrHtml += '<tr>';

        for (var c = 0; c < _this.getModuleCount(); c += 1) {
          qrHtml += '<td style="';
          qrHtml += ' border-width: 0px; border-style: none;';
          qrHtml += ' border-collapse: collapse;';
          qrHtml += ' padding: 0px; margin: 0px;';
          qrHtml += ' width: ' + cellSize + 'px;';
          qrHtml += ' height: ' + cellSize + 'px;';
          qrHtml += ' background-color: ';
          qrHtml += _this.isDark(r, c)? '#000000' : '#ffffff';
          qrHtml += ';';
          qrHtml += '"/>';
        }

        qrHtml += '</tr>';
      }

      qrHtml += '</tbody>';
      qrHtml += '</table>';

      return qrHtml;
    };

    _this.createSvgTag = function(cellSize, margin, alt, title) {

      var opts = {};
      if (typeof arguments[0] == 'object') {
        // Called by options.
        opts = arguments[0];
        // overwrite cellSize and margin.
        cellSize = opts.cellSize;
        margin = opts.margin;
        alt = opts.alt;
        title = opts.title;
      }

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      // Compose alt property surrogate
      alt = (typeof alt === 'string') ? {text: alt} : alt || {};
      alt.text = alt.text || null;
      alt.id = (alt.text) ? alt.id || 'qrcode-description' : null;

      // Compose title property surrogate
      title = (typeof title === 'string') ? {text: title} : title || {};
      title.text = title.text || null;
      title.id = (title.text) ? title.id || 'qrcode-title' : null;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var c, mc, r, mr, qrSvg='', rect;

      rect = 'l' + cellSize + ',0 0,' + cellSize +
        ' -' + cellSize + ',0 0,-' + cellSize + 'z ';

      qrSvg += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"';
      qrSvg += !opts.scalable ? ' width="' + size + 'px" height="' + size + 'px"' : '';
      qrSvg += ' viewBox="0 0 ' + size + ' ' + size + '" ';
      qrSvg += ' preserveAspectRatio="xMinYMin meet"';
      qrSvg += (title.text || alt.text) ? ' role="img" aria-labelledby="' +
          escapeXml([title.id, alt.id].join(' ').trim() ) + '"' : '';
      qrSvg += '>';
      qrSvg += (title.text) ? '<title id="' + escapeXml(title.id) + '">' +
          escapeXml(title.text) + '</title>' : '';
      qrSvg += (alt.text) ? '<description id="' + escapeXml(alt.id) + '">' +
          escapeXml(alt.text) + '</description>' : '';
      qrSvg += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>';
      qrSvg += '<path d="';

      for (r = 0; r < _this.getModuleCount(); r += 1) {
        mr = r * cellSize + margin;
        for (c = 0; c < _this.getModuleCount(); c += 1) {
          if (_this.isDark(r, c) ) {
            mc = c*cellSize+margin;
            qrSvg += 'M' + mc + ',' + mr + rect;
          }
        }
      }

      qrSvg += '" stroke="transparent" fill="black"/>';
      qrSvg += '</svg>';

      return qrSvg;
    };

    _this.createDataURL = function(cellSize, margin) {

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var min = margin;
      var max = size - margin;

      return createDataURL(size, size, function(x, y) {
        if (min <= x && x < max && min <= y && y < max) {
          var c = Math.floor( (x - min) / cellSize);
          var r = Math.floor( (y - min) / cellSize);
          return _this.isDark(r, c)? 0 : 1;
        } else {
          return 1;
        }
      } );
    };

    _this.createImgTag = function(cellSize, margin, alt) {

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;

      var img = '';
      img += '<img';
      img += '\u0020src="';
      img += _this.createDataURL(cellSize, margin);
      img += '"';
      img += '\u0020width="';
      img += size;
      img += '"';
      img += '\u0020height="';
      img += size;
      img += '"';
      if (alt) {
        img += '\u0020alt="';
        img += escapeXml(alt);
        img += '"';
      }
      img += '/>';

      return img;
    };

    var escapeXml = function(s) {
      var escaped = '';
      for (var i = 0; i < s.length; i += 1) {
        var c = s.charAt(i);
        switch(c) {
        case '<': escaped += '&lt;'; break;
        case '>': escaped += '&gt;'; break;
        case '&': escaped += '&amp;'; break;
        case '"': escaped += '&quot;'; break;
        default : escaped += c; break;
        }
      }
      return escaped;
    };

    var _createHalfASCII = function(margin) {
      var cellSize = 1;
      margin = (typeof margin == 'undefined')? cellSize * 2 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var min = margin;
      var max = size - margin;

      var y, x, r1, r2, p;

      var blocks = {
        '██': '█',
        '█ ': '▀',
        ' █': '▄',
        '  ': ' '
      };

      var blocksLastLineNoMargin = {
        '██': '▀',
        '█ ': '▀',
        ' █': ' ',
        '  ': ' '
      };

      var ascii = '';
      for (y = 0; y < size; y += 2) {
        r1 = Math.floor((y - min) / cellSize);
        r2 = Math.floor((y + 1 - min) / cellSize);
        for (x = 0; x < size; x += 1) {
          p = '█';

          if (min <= x && x < max && min <= y && y < max && _this.isDark(r1, Math.floor((x - min) / cellSize))) {
            p = ' ';
          }

          if (min <= x && x < max && min <= y+1 && y+1 < max && _this.isDark(r2, Math.floor((x - min) / cellSize))) {
            p += ' ';
          }
          else {
            p += '█';
          }

          // Output 2 characters per pixel, to create full square. 1 character per pixels gives only half width of square.
          ascii += (margin < 1 && y+1 >= max) ? blocksLastLineNoMargin[p] : blocks[p];
        }

        ascii += '\n';
      }

      if (size % 2 && margin > 0) {
        return ascii.substring(0, ascii.length - size - 1) + Array(size+1).join('▀');
      }

      return ascii.substring(0, ascii.length-1);
    };

    _this.createASCII = function(cellSize, margin) {
      cellSize = cellSize || 1;

      if (cellSize < 2) {
        return _createHalfASCII(margin);
      }

      cellSize -= 1;
      margin = (typeof margin == 'undefined')? cellSize * 2 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var min = margin;
      var max = size - margin;

      var y, x, r, p;

      var white = Array(cellSize+1).join('██');
      var black = Array(cellSize+1).join('  ');

      var ascii = '';
      var line = '';
      for (y = 0; y < size; y += 1) {
        r = Math.floor( (y - min) / cellSize);
        line = '';
        for (x = 0; x < size; x += 1) {
          p = 1;

          if (min <= x && x < max && min <= y && y < max && _this.isDark(r, Math.floor((x - min) / cellSize))) {
            p = 0;
          }

          // Output 2 characters per pixel, to create full square. 1 character per pixels gives only half width of square.
          line += p ? white : black;
        }

        for (r = 0; r < cellSize; r += 1) {
          ascii += line + '\n';
        }
      }

      return ascii.substring(0, ascii.length-1);
    };

    _this.renderTo2dContext = function(context, cellSize) {
      cellSize = cellSize || 2;
      var length = _this.getModuleCount();
      for (var row = 0; row < length; row++) {
        for (var col = 0; col < length; col++) {
          context.fillStyle = _this.isDark(row, col) ? 'black' : 'white';
          context.fillRect(row * cellSize, col * cellSize, cellSize, cellSize);
        }
      }
    }

    return _this;
  };

  //---------------------------------------------------------------------
  // qrcode.stringToBytes
  //---------------------------------------------------------------------

  qrcode.stringToBytesFuncs = {
    'default' : function(s) {
      var bytes = [];
      for (var i = 0; i < s.length; i += 1) {
        var c = s.charCodeAt(i);
        bytes.push(c & 0xff);
      }
      return bytes;
    }
  };

  qrcode.stringToBytes = qrcode.stringToBytesFuncs['default'];

  //---------------------------------------------------------------------
  // qrcode.createStringToBytes
  //---------------------------------------------------------------------

  /**
   * @param unicodeData base64 string of byte array.
   * [16bit Unicode],[16bit Bytes], ...
   * @param numChars
   */
  qrcode.createStringToBytes = function(unicodeData, numChars) {

    // create conversion map.

    var unicodeMap = function() {

      var bin = base64DecodeInputStream(unicodeData);
      var read = function() {
        var b = bin.read();
        if (b == -1) throw 'eof';
        return b;
      };

      var count = 0;
      var unicodeMap = {};
      while (true) {
        var b0 = bin.read();
        if (b0 == -1) break;
        var b1 = read();
        var b2 = read();
        var b3 = read();
        var k = String.fromCharCode( (b0 << 8) | b1);
        var v = (b2 << 8) | b3;
        unicodeMap[k] = v;
        count += 1;
      }
      if (count != numChars) {
        throw count + ' != ' + numChars;
      }

      return unicodeMap;
    }();

    var unknownChar = '?'.charCodeAt(0);

    return function(s) {
      var bytes = [];
      for (var i = 0; i < s.length; i += 1) {
        var c = s.charCodeAt(i);
        if (c < 128) {
          bytes.push(c);
        } else {
          var b = unicodeMap[s.charAt(i)];
          if (typeof b == 'number') {
            if ( (b & 0xff) == b) {
              // 1byte
              bytes.push(b);
            } else {
              // 2bytes
              bytes.push(b >>> 8);
              bytes.push(b & 0xff);
            }
          } else {
            bytes.push(unknownChar);
          }
        }
      }
      return bytes;
    };
  };

  //---------------------------------------------------------------------
  // QRMode
  //---------------------------------------------------------------------

  var QRMode = {
    MODE_NUMBER :    1 << 0,
    MODE_ALPHA_NUM : 1 << 1,
    MODE_8BIT_BYTE : 1 << 2,
    MODE_KANJI :     1 << 3
  };

  //---------------------------------------------------------------------
  // QRErrorCorrectionLevel
  //---------------------------------------------------------------------

  var QRErrorCorrectionLevel = {
    L : 1,
    M : 0,
    Q : 3,
    H : 2
  };

  //---------------------------------------------------------------------
  // QRMaskPattern
  //---------------------------------------------------------------------

  var QRMaskPattern = {
    PATTERN000 : 0,
    PATTERN001 : 1,
    PATTERN010 : 2,
    PATTERN011 : 3,
    PATTERN100 : 4,
    PATTERN101 : 5,
    PATTERN110 : 6,
    PATTERN111 : 7
  };

  //---------------------------------------------------------------------
  // QRUtil
  //---------------------------------------------------------------------

  var QRUtil = function() {

    var PATTERN_POSITION_TABLE = [
      [],
      [6, 18],
      [6, 22],
      [6, 26],
      [6, 30],
      [6, 34],
      [6, 22, 38],
      [6, 24, 42],
      [6, 26, 46],
      [6, 28, 50],
      [6, 30, 54],
      [6, 32, 58],
      [6, 34, 62],
      [6, 26, 46, 66],
      [6, 26, 48, 70],
      [6, 26, 50, 74],
      [6, 30, 54, 78],
      [6, 30, 56, 82],
      [6, 30, 58, 86],
      [6, 34, 62, 90],
      [6, 28, 50, 72, 94],
      [6, 26, 50, 74, 98],
      [6, 30, 54, 78, 102],
      [6, 28, 54, 80, 106],
      [6, 32, 58, 84, 110],
      [6, 30, 58, 86, 114],
      [6, 34, 62, 90, 118],
      [6, 26, 50, 74, 98, 122],
      [6, 30, 54, 78, 102, 126],
      [6, 26, 52, 78, 104, 130],
      [6, 30, 56, 82, 108, 134],
      [6, 34, 60, 86, 112, 138],
      [6, 30, 58, 86, 114, 142],
      [6, 34, 62, 90, 118, 146],
      [6, 30, 54, 78, 102, 126, 150],
      [6, 24, 50, 76, 102, 128, 154],
      [6, 28, 54, 80, 106, 132, 158],
      [6, 32, 58, 84, 110, 136, 162],
      [6, 26, 54, 82, 110, 138, 166],
      [6, 30, 58, 86, 114, 142, 170]
    ];
    var G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
    var G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0);
    var G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);

    var _this = {};

    var getBCHDigit = function(data) {
      var digit = 0;
      while (data != 0) {
        digit += 1;
        data >>>= 1;
      }
      return digit;
    };

    _this.getBCHTypeInfo = function(data) {
      var d = data << 10;
      while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
        d ^= (G15 << (getBCHDigit(d) - getBCHDigit(G15) ) );
      }
      return ( (data << 10) | d) ^ G15_MASK;
    };

    _this.getBCHTypeNumber = function(data) {
      var d = data << 12;
      while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
        d ^= (G18 << (getBCHDigit(d) - getBCHDigit(G18) ) );
      }
      return (data << 12) | d;
    };

    _this.getPatternPosition = function(typeNumber) {
      return PATTERN_POSITION_TABLE[typeNumber - 1];
    };

    _this.getMaskFunction = function(maskPattern) {

      switch (maskPattern) {

      case QRMaskPattern.PATTERN000 :
        return function(i, j) { return (i + j) % 2 == 0; };
      case QRMaskPattern.PATTERN001 :
        return function(i, j) { return i % 2 == 0; };
      case QRMaskPattern.PATTERN010 :
        return function(i, j) { return j % 3 == 0; };
      case QRMaskPattern.PATTERN011 :
        return function(i, j) { return (i + j) % 3 == 0; };
      case QRMaskPattern.PATTERN100 :
        return function(i, j) { return (Math.floor(i / 2) + Math.floor(j / 3) ) % 2 == 0; };
      case QRMaskPattern.PATTERN101 :
        return function(i, j) { return (i * j) % 2 + (i * j) % 3 == 0; };
      case QRMaskPattern.PATTERN110 :
        return function(i, j) { return ( (i * j) % 2 + (i * j) % 3) % 2 == 0; };
      case QRMaskPattern.PATTERN111 :
        return function(i, j) { return ( (i * j) % 3 + (i + j) % 2) % 2 == 0; };

      default :
        throw 'bad maskPattern:' + maskPattern;
      }
    };

    _this.getErrorCorrectPolynomial = function(errorCorrectLength) {
      var a = qrPolynomial([1], 0);
      for (var i = 0; i < errorCorrectLength; i += 1) {
        a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0) );
      }
      return a;
    };

    _this.getLengthInBits = function(mode, type) {

      if (1 <= type && type < 10) {

        // 1 - 9

        switch(mode) {
        case QRMode.MODE_NUMBER    : return 10;
        case QRMode.MODE_ALPHA_NUM : return 9;
        case QRMode.MODE_8BIT_BYTE : return 8;
        case QRMode.MODE_KANJI     : return 8;
        default :
          throw 'mode:' + mode;
        }

      } else if (type < 27) {

        // 10 - 26

        switch(mode) {
        case QRMode.MODE_NUMBER    : return 12;
        case QRMode.MODE_ALPHA_NUM : return 11;
        case QRMode.MODE_8BIT_BYTE : return 16;
        case QRMode.MODE_KANJI     : return 10;
        default :
          throw 'mode:' + mode;
        }

      } else if (type < 41) {

        // 27 - 40

        switch(mode) {
        case QRMode.MODE_NUMBER    : return 14;
        case QRMode.MODE_ALPHA_NUM : return 13;
        case QRMode.MODE_8BIT_BYTE : return 16;
        case QRMode.MODE_KANJI     : return 12;
        default :
          throw 'mode:' + mode;
        }

      } else {
        throw 'type:' + type;
      }
    };

    _this.getLostPoint = function(qrcode) {

      var moduleCount = qrcode.getModuleCount();

      var lostPoint = 0;

      // LEVEL1

      for (var row = 0; row < moduleCount; row += 1) {
        for (var col = 0; col < moduleCount; col += 1) {

          var sameCount = 0;
          var dark = qrcode.isDark(row, col);

          for (var r = -1; r <= 1; r += 1) {

            if (row + r < 0 || moduleCount <= row + r) {
              continue;
            }

            for (var c = -1; c <= 1; c += 1) {

              if (col + c < 0 || moduleCount <= col + c) {
                continue;
              }

              if (r == 0 && c == 0) {
                continue;
              }

              if (dark == qrcode.isDark(row + r, col + c) ) {
                sameCount += 1;
              }
            }
          }

          if (sameCount > 5) {
            lostPoint += (3 + sameCount - 5);
          }
        }
      };

      // LEVEL2

      for (var row = 0; row < moduleCount - 1; row += 1) {
        for (var col = 0; col < moduleCount - 1; col += 1) {
          var count = 0;
          if (qrcode.isDark(row, col) ) count += 1;
          if (qrcode.isDark(row + 1, col) ) count += 1;
          if (qrcode.isDark(row, col + 1) ) count += 1;
          if (qrcode.isDark(row + 1, col + 1) ) count += 1;
          if (count == 0 || count == 4) {
            lostPoint += 3;
          }
        }
      }

      // LEVEL3

      for (var row = 0; row < moduleCount; row += 1) {
        for (var col = 0; col < moduleCount - 6; col += 1) {
          if (qrcode.isDark(row, col)
              && !qrcode.isDark(row, col + 1)
              &&  qrcode.isDark(row, col + 2)
              &&  qrcode.isDark(row, col + 3)
              &&  qrcode.isDark(row, col + 4)
              && !qrcode.isDark(row, col + 5)
              &&  qrcode.isDark(row, col + 6) ) {
            lostPoint += 40;
          }
        }
      }

      for (var col = 0; col < moduleCount; col += 1) {
        for (var row = 0; row < moduleCount - 6; row += 1) {
          if (qrcode.isDark(row, col)
              && !qrcode.isDark(row + 1, col)
              &&  qrcode.isDark(row + 2, col)
              &&  qrcode.isDark(row + 3, col)
              &&  qrcode.isDark(row + 4, col)
              && !qrcode.isDark(row + 5, col)
              &&  qrcode.isDark(row + 6, col) ) {
            lostPoint += 40;
          }
        }
      }

      // LEVEL4

      var darkCount = 0;

      for (var col = 0; col < moduleCount; col += 1) {
        for (var row = 0; row < moduleCount; row += 1) {
          if (qrcode.isDark(row, col) ) {
            darkCount += 1;
          }
        }
      }

      var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
      lostPoint += ratio * 10;

      return lostPoint;
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // QRMath
  //---------------------------------------------------------------------

  var QRMath = function() {

    var EXP_TABLE = new Array(256);
    var LOG_TABLE = new Array(256);

    // initialize tables
    for (var i = 0; i < 8; i += 1) {
      EXP_TABLE[i] = 1 << i;
    }
    for (var i = 8; i < 256; i += 1) {
      EXP_TABLE[i] = EXP_TABLE[i - 4]
        ^ EXP_TABLE[i - 5]
        ^ EXP_TABLE[i - 6]
        ^ EXP_TABLE[i - 8];
    }
    for (var i = 0; i < 255; i += 1) {
      LOG_TABLE[EXP_TABLE[i] ] = i;
    }

    var _this = {};

    _this.glog = function(n) {

      if (n < 1) {
        throw 'glog(' + n + ')';
      }

      return LOG_TABLE[n];
    };

    _this.gexp = function(n) {

      while (n < 0) {
        n += 255;
      }

      while (n >= 256) {
        n -= 255;
      }

      return EXP_TABLE[n];
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // qrPolynomial
  //---------------------------------------------------------------------

  function qrPolynomial(num, shift) {

    if (typeof num.length == 'undefined') {
      throw num.length + '/' + shift;
    }

    var _num = function() {
      var offset = 0;
      while (offset < num.length && num[offset] == 0) {
        offset += 1;
      }
      var _num = new Array(num.length - offset + shift);
      for (var i = 0; i < num.length - offset; i += 1) {
        _num[i] = num[i + offset];
      }
      return _num;
    }();

    var _this = {};

    _this.getAt = function(index) {
      return _num[index];
    };

    _this.getLength = function() {
      return _num.length;
    };

    _this.multiply = function(e) {

      var num = new Array(_this.getLength() + e.getLength() - 1);

      for (var i = 0; i < _this.getLength(); i += 1) {
        for (var j = 0; j < e.getLength(); j += 1) {
          num[i + j] ^= QRMath.gexp(QRMath.glog(_this.getAt(i) ) + QRMath.glog(e.getAt(j) ) );
        }
      }

      return qrPolynomial(num, 0);
    };

    _this.mod = function(e) {

      if (_this.getLength() - e.getLength() < 0) {
        return _this;
      }

      var ratio = QRMath.glog(_this.getAt(0) ) - QRMath.glog(e.getAt(0) );

      var num = new Array(_this.getLength() );
      for (var i = 0; i < _this.getLength(); i += 1) {
        num[i] = _this.getAt(i);
      }

      for (var i = 0; i < e.getLength(); i += 1) {
        num[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i) ) + ratio);
      }

      // recursive call
      return qrPolynomial(num, 0).mod(e);
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // QRRSBlock
  //---------------------------------------------------------------------

  var QRRSBlock = function() {

    var RS_BLOCK_TABLE = [

      // L
      // M
      // Q
      // H

      // 1
      [1, 26, 19],
      [1, 26, 16],
      [1, 26, 13],
      [1, 26, 9],

      // 2
      [1, 44, 34],
      [1, 44, 28],
      [1, 44, 22],
      [1, 44, 16],

      // 3
      [1, 70, 55],
      [1, 70, 44],
      [2, 35, 17],
      [2, 35, 13],

      // 4
      [1, 100, 80],
      [2, 50, 32],
      [2, 50, 24],
      [4, 25, 9],

      // 5
      [1, 134, 108],
      [2, 67, 43],
      [2, 33, 15, 2, 34, 16],
      [2, 33, 11, 2, 34, 12],

      // 6
      [2, 86, 68],
      [4, 43, 27],
      [4, 43, 19],
      [4, 43, 15],

      // 7
      [2, 98, 78],
      [4, 49, 31],
      [2, 32, 14, 4, 33, 15],
      [4, 39, 13, 1, 40, 14],

      // 8
      [2, 121, 97],
      [2, 60, 38, 2, 61, 39],
      [4, 40, 18, 2, 41, 19],
      [4, 40, 14, 2, 41, 15],

      // 9
      [2, 146, 116],
      [3, 58, 36, 2, 59, 37],
      [4, 36, 16, 4, 37, 17],
      [4, 36, 12, 4, 37, 13],

      // 10
      [2, 86, 68, 2, 87, 69],
      [4, 69, 43, 1, 70, 44],
      [6, 43, 19, 2, 44, 20],
      [6, 43, 15, 2, 44, 16],

      // 11
      [4, 101, 81],
      [1, 80, 50, 4, 81, 51],
      [4, 50, 22, 4, 51, 23],
      [3, 36, 12, 8, 37, 13],

      // 12
      [2, 116, 92, 2, 117, 93],
      [6, 58, 36, 2, 59, 37],
      [4, 46, 20, 6, 47, 21],
      [7, 42, 14, 4, 43, 15],

      // 13
      [4, 133, 107],
      [8, 59, 37, 1, 60, 38],
      [8, 44, 20, 4, 45, 21],
      [12, 33, 11, 4, 34, 12],

      // 14
      [3, 145, 115, 1, 146, 116],
      [4, 64, 40, 5, 65, 41],
      [11, 36, 16, 5, 37, 17],
      [11, 36, 12, 5, 37, 13],

      // 15
      [5, 109, 87, 1, 110, 88],
      [5, 65, 41, 5, 66, 42],
      [5, 54, 24, 7, 55, 25],
      [11, 36, 12, 7, 37, 13],

      // 16
      [5, 122, 98, 1, 123, 99],
      [7, 73, 45, 3, 74, 46],
      [15, 43, 19, 2, 44, 20],
      [3, 45, 15, 13, 46, 16],

      // 17
      [1, 135, 107, 5, 136, 108],
      [10, 74, 46, 1, 75, 47],
      [1, 50, 22, 15, 51, 23],
      [2, 42, 14, 17, 43, 15],

      // 18
      [5, 150, 120, 1, 151, 121],
      [9, 69, 43, 4, 70, 44],
      [17, 50, 22, 1, 51, 23],
      [2, 42, 14, 19, 43, 15],

      // 19
      [3, 141, 113, 4, 142, 114],
      [3, 70, 44, 11, 71, 45],
      [17, 47, 21, 4, 48, 22],
      [9, 39, 13, 16, 40, 14],

      // 20
      [3, 135, 107, 5, 136, 108],
      [3, 67, 41, 13, 68, 42],
      [15, 54, 24, 5, 55, 25],
      [15, 43, 15, 10, 44, 16],

      // 21
      [4, 144, 116, 4, 145, 117],
      [17, 68, 42],
      [17, 50, 22, 6, 51, 23],
      [19, 46, 16, 6, 47, 17],

      // 22
      [2, 139, 111, 7, 140, 112],
      [17, 74, 46],
      [7, 54, 24, 16, 55, 25],
      [34, 37, 13],

      // 23
      [4, 151, 121, 5, 152, 122],
      [4, 75, 47, 14, 76, 48],
      [11, 54, 24, 14, 55, 25],
      [16, 45, 15, 14, 46, 16],

      // 24
      [6, 147, 117, 4, 148, 118],
      [6, 73, 45, 14, 74, 46],
      [11, 54, 24, 16, 55, 25],
      [30, 46, 16, 2, 47, 17],

      // 25
      [8, 132, 106, 4, 133, 107],
      [8, 75, 47, 13, 76, 48],
      [7, 54, 24, 22, 55, 25],
      [22, 45, 15, 13, 46, 16],

      // 26
      [10, 142, 114, 2, 143, 115],
      [19, 74, 46, 4, 75, 47],
      [28, 50, 22, 6, 51, 23],
      [33, 46, 16, 4, 47, 17],

      // 27
      [8, 152, 122, 4, 153, 123],
      [22, 73, 45, 3, 74, 46],
      [8, 53, 23, 26, 54, 24],
      [12, 45, 15, 28, 46, 16],

      // 28
      [3, 147, 117, 10, 148, 118],
      [3, 73, 45, 23, 74, 46],
      [4, 54, 24, 31, 55, 25],
      [11, 45, 15, 31, 46, 16],

      // 29
      [7, 146, 116, 7, 147, 117],
      [21, 73, 45, 7, 74, 46],
      [1, 53, 23, 37, 54, 24],
      [19, 45, 15, 26, 46, 16],

      // 30
      [5, 145, 115, 10, 146, 116],
      [19, 75, 47, 10, 76, 48],
      [15, 54, 24, 25, 55, 25],
      [23, 45, 15, 25, 46, 16],

      // 31
      [13, 145, 115, 3, 146, 116],
      [2, 74, 46, 29, 75, 47],
      [42, 54, 24, 1, 55, 25],
      [23, 45, 15, 28, 46, 16],

      // 32
      [17, 145, 115],
      [10, 74, 46, 23, 75, 47],
      [10, 54, 24, 35, 55, 25],
      [19, 45, 15, 35, 46, 16],

      // 33
      [17, 145, 115, 1, 146, 116],
      [14, 74, 46, 21, 75, 47],
      [29, 54, 24, 19, 55, 25],
      [11, 45, 15, 46, 46, 16],

      // 34
      [13, 145, 115, 6, 146, 116],
      [14, 74, 46, 23, 75, 47],
      [44, 54, 24, 7, 55, 25],
      [59, 46, 16, 1, 47, 17],

      // 35
      [12, 151, 121, 7, 152, 122],
      [12, 75, 47, 26, 76, 48],
      [39, 54, 24, 14, 55, 25],
      [22, 45, 15, 41, 46, 16],

      // 36
      [6, 151, 121, 14, 152, 122],
      [6, 75, 47, 34, 76, 48],
      [46, 54, 24, 10, 55, 25],
      [2, 45, 15, 64, 46, 16],

      // 37
      [17, 152, 122, 4, 153, 123],
      [29, 74, 46, 14, 75, 47],
      [49, 54, 24, 10, 55, 25],
      [24, 45, 15, 46, 46, 16],

      // 38
      [4, 152, 122, 18, 153, 123],
      [13, 74, 46, 32, 75, 47],
      [48, 54, 24, 14, 55, 25],
      [42, 45, 15, 32, 46, 16],

      // 39
      [20, 147, 117, 4, 148, 118],
      [40, 75, 47, 7, 76, 48],
      [43, 54, 24, 22, 55, 25],
      [10, 45, 15, 67, 46, 16],

      // 40
      [19, 148, 118, 6, 149, 119],
      [18, 75, 47, 31, 76, 48],
      [34, 54, 24, 34, 55, 25],
      [20, 45, 15, 61, 46, 16]
    ];

    var qrRSBlock = function(totalCount, dataCount) {
      var _this = {};
      _this.totalCount = totalCount;
      _this.dataCount = dataCount;
      return _this;
    };

    var _this = {};

    var getRsBlockTable = function(typeNumber, errorCorrectionLevel) {

      switch(errorCorrectionLevel) {
      case QRErrorCorrectionLevel.L :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
      case QRErrorCorrectionLevel.M :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
      case QRErrorCorrectionLevel.Q :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
      case QRErrorCorrectionLevel.H :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
      default :
        return undefined;
      }
    };

    _this.getRSBlocks = function(typeNumber, errorCorrectionLevel) {

      var rsBlock = getRsBlockTable(typeNumber, errorCorrectionLevel);

      if (typeof rsBlock == 'undefined') {
        throw 'bad rs block @ typeNumber:' + typeNumber +
            '/errorCorrectionLevel:' + errorCorrectionLevel;
      }

      var length = rsBlock.length / 3;

      var list = [];

      for (var i = 0; i < length; i += 1) {

        var count = rsBlock[i * 3 + 0];
        var totalCount = rsBlock[i * 3 + 1];
        var dataCount = rsBlock[i * 3 + 2];

        for (var j = 0; j < count; j += 1) {
          list.push(qrRSBlock(totalCount, dataCount) );
        }
      }

      return list;
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // qrBitBuffer
  //---------------------------------------------------------------------

  var qrBitBuffer = function() {

    var _buffer = [];
    var _length = 0;

    var _this = {};

    _this.getBuffer = function() {
      return _buffer;
    };

    _this.getAt = function(index) {
      var bufIndex = Math.floor(index / 8);
      return ( (_buffer[bufIndex] >>> (7 - index % 8) ) & 1) == 1;
    };

    _this.put = function(num, length) {
      for (var i = 0; i < length; i += 1) {
        _this.putBit( ( (num >>> (length - i - 1) ) & 1) == 1);
      }
    };

    _this.getLengthInBits = function() {
      return _length;
    };

    _this.putBit = function(bit) {

      var bufIndex = Math.floor(_length / 8);
      if (_buffer.length <= bufIndex) {
        _buffer.push(0);
      }

      if (bit) {
        _buffer[bufIndex] |= (0x80 >>> (_length % 8) );
      }

      _length += 1;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrNumber
  //---------------------------------------------------------------------

  var qrNumber = function(data) {

    var _mode = QRMode.MODE_NUMBER;
    var _data = data;

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return _data.length;
    };

    _this.write = function(buffer) {

      var data = _data;

      var i = 0;

      while (i + 2 < data.length) {
        buffer.put(strToNum(data.substring(i, i + 3) ), 10);
        i += 3;
      }

      if (i < data.length) {
        if (data.length - i == 1) {
          buffer.put(strToNum(data.substring(i, i + 1) ), 4);
        } else if (data.length - i == 2) {
          buffer.put(strToNum(data.substring(i, i + 2) ), 7);
        }
      }
    };

    var strToNum = function(s) {
      var num = 0;
      for (var i = 0; i < s.length; i += 1) {
        num = num * 10 + chatToNum(s.charAt(i) );
      }
      return num;
    };

    var chatToNum = function(c) {
      if ('0' <= c && c <= '9') {
        return c.charCodeAt(0) - '0'.charCodeAt(0);
      }
      throw 'illegal char :' + c;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrAlphaNum
  //---------------------------------------------------------------------

  var qrAlphaNum = function(data) {

    var _mode = QRMode.MODE_ALPHA_NUM;
    var _data = data;

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return _data.length;
    };

    _this.write = function(buffer) {

      var s = _data;

      var i = 0;

      while (i + 1 < s.length) {
        buffer.put(
          getCode(s.charAt(i) ) * 45 +
          getCode(s.charAt(i + 1) ), 11);
        i += 2;
      }

      if (i < s.length) {
        buffer.put(getCode(s.charAt(i) ), 6);
      }
    };

    var getCode = function(c) {

      if ('0' <= c && c <= '9') {
        return c.charCodeAt(0) - '0'.charCodeAt(0);
      } else if ('A' <= c && c <= 'Z') {
        return c.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
      } else {
        switch (c) {
        case ' ' : return 36;
        case '$' : return 37;
        case '%' : return 38;
        case '*' : return 39;
        case '+' : return 40;
        case '-' : return 41;
        case '.' : return 42;
        case '/' : return 43;
        case ':' : return 44;
        default :
          throw 'illegal char :' + c;
        }
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qr8BitByte
  //---------------------------------------------------------------------

  var qr8BitByte = function(data) {

    var _mode = QRMode.MODE_8BIT_BYTE;
    var _data = data;
    var _bytes = qrcode.stringToBytes(data);

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return _bytes.length;
    };

    _this.write = function(buffer) {
      for (var i = 0; i < _bytes.length; i += 1) {
        buffer.put(_bytes[i], 8);
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrKanji
  //---------------------------------------------------------------------

  var qrKanji = function(data) {

    var _mode = QRMode.MODE_KANJI;
    var _data = data;

    var stringToBytes = qrcode.stringToBytesFuncs['SJIS'];
    if (!stringToBytes) {
      throw 'sjis not supported.';
    }
    !function(c, code) {
      // self test for sjis support.
      var test = stringToBytes(c);
      if (test.length != 2 || ( (test[0] << 8) | test[1]) != code) {
        throw 'sjis not supported.';
      }
    }('\u53cb', 0x9746);

    var _bytes = stringToBytes(data);

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return ~~(_bytes.length / 2);
    };

    _this.write = function(buffer) {

      var data = _bytes;

      var i = 0;

      while (i + 1 < data.length) {

        var c = ( (0xff & data[i]) << 8) | (0xff & data[i + 1]);

        if (0x8140 <= c && c <= 0x9FFC) {
          c -= 0x8140;
        } else if (0xE040 <= c && c <= 0xEBBF) {
          c -= 0xC140;
        } else {
          throw 'illegal char at ' + (i + 1) + '/' + c;
        }

        c = ( (c >>> 8) & 0xff) * 0xC0 + (c & 0xff);

        buffer.put(c, 13);

        i += 2;
      }

      if (i < data.length) {
        throw 'illegal char at ' + (i + 1);
      }
    };

    return _this;
  };

  //=====================================================================
  // GIF Support etc.
  //

  //---------------------------------------------------------------------
  // byteArrayOutputStream
  //---------------------------------------------------------------------

  var byteArrayOutputStream = function() {

    var _bytes = [];

    var _this = {};

    _this.writeByte = function(b) {
      _bytes.push(b & 0xff);
    };

    _this.writeShort = function(i) {
      _this.writeByte(i);
      _this.writeByte(i >>> 8);
    };

    _this.writeBytes = function(b, off, len) {
      off = off || 0;
      len = len || b.length;
      for (var i = 0; i < len; i += 1) {
        _this.writeByte(b[i + off]);
      }
    };

    _this.writeString = function(s) {
      for (var i = 0; i < s.length; i += 1) {
        _this.writeByte(s.charCodeAt(i) );
      }
    };

    _this.toByteArray = function() {
      return _bytes;
    };

    _this.toString = function() {
      var s = '';
      s += '[';
      for (var i = 0; i < _bytes.length; i += 1) {
        if (i > 0) {
          s += ',';
        }
        s += _bytes[i];
      }
      s += ']';
      return s;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // base64EncodeOutputStream
  //---------------------------------------------------------------------

  var base64EncodeOutputStream = function() {

    var _buffer = 0;
    var _buflen = 0;
    var _length = 0;
    var _base64 = '';

    var _this = {};

    var writeEncoded = function(b) {
      _base64 += String.fromCharCode(encode(b & 0x3f) );
    };

    var encode = function(n) {
      if (n < 0) {
        // error.
      } else if (n < 26) {
        return 0x41 + n;
      } else if (n < 52) {
        return 0x61 + (n - 26);
      } else if (n < 62) {
        return 0x30 + (n - 52);
      } else if (n == 62) {
        return 0x2b;
      } else if (n == 63) {
        return 0x2f;
      }
      throw 'n:' + n;
    };

    _this.writeByte = function(n) {

      _buffer = (_buffer << 8) | (n & 0xff);
      _buflen += 8;
      _length += 1;

      while (_buflen >= 6) {
        writeEncoded(_buffer >>> (_buflen - 6) );
        _buflen -= 6;
      }
    };

    _this.flush = function() {

      if (_buflen > 0) {
        writeEncoded(_buffer << (6 - _buflen) );
        _buffer = 0;
        _buflen = 0;
      }

      if (_length % 3 != 0) {
        // padding
        var padlen = 3 - _length % 3;
        for (var i = 0; i < padlen; i += 1) {
          _base64 += '=';
        }
      }
    };

    _this.toString = function() {
      return _base64;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // base64DecodeInputStream
  //---------------------------------------------------------------------

  var base64DecodeInputStream = function(str) {

    var _str = str;
    var _pos = 0;
    var _buffer = 0;
    var _buflen = 0;

    var _this = {};

    _this.read = function() {

      while (_buflen < 8) {

        if (_pos >= _str.length) {
          if (_buflen == 0) {
            return -1;
          }
          throw 'unexpected end of file./' + _buflen;
        }

        var c = _str.charAt(_pos);
        _pos += 1;

        if (c == '=') {
          _buflen = 0;
          return -1;
        } else if (c.match(/^\s$/) ) {
          // ignore if whitespace.
          continue;
        }

        _buffer = (_buffer << 6) | decode(c.charCodeAt(0) );
        _buflen += 6;
      }

      var n = (_buffer >>> (_buflen - 8) ) & 0xff;
      _buflen -= 8;
      return n;
    };

    var decode = function(c) {
      if (0x41 <= c && c <= 0x5a) {
        return c - 0x41;
      } else if (0x61 <= c && c <= 0x7a) {
        return c - 0x61 + 26;
      } else if (0x30 <= c && c <= 0x39) {
        return c - 0x30 + 52;
      } else if (c == 0x2b) {
        return 62;
      } else if (c == 0x2f) {
        return 63;
      } else {
        throw 'c:' + c;
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // gifImage (B/W)
  //---------------------------------------------------------------------

  var gifImage = function(width, height) {

    var _width = width;
    var _height = height;
    var _data = new Array(width * height);

    var _this = {};

    _this.setPixel = function(x, y, pixel) {
      _data[y * _width + x] = pixel;
    };

    _this.write = function(out) {

      //---------------------------------
      // GIF Signature

      out.writeString('GIF87a');

      //---------------------------------
      // Screen Descriptor

      out.writeShort(_width);
      out.writeShort(_height);

      out.writeByte(0x80); // 2bit
      out.writeByte(0);
      out.writeByte(0);

      //---------------------------------
      // Global Color Map

      // black
      out.writeByte(0x00);
      out.writeByte(0x00);
      out.writeByte(0x00);

      // white
      out.writeByte(0xff);
      out.writeByte(0xff);
      out.writeByte(0xff);

      //---------------------------------
      // Image Descriptor

      out.writeString(',');
      out.writeShort(0);
      out.writeShort(0);
      out.writeShort(_width);
      out.writeShort(_height);
      out.writeByte(0);

      //---------------------------------
      // Local Color Map

      //---------------------------------
      // Raster Data

      var lzwMinCodeSize = 2;
      var raster = getLZWRaster(lzwMinCodeSize);

      out.writeByte(lzwMinCodeSize);

      var offset = 0;

      while (raster.length - offset > 255) {
        out.writeByte(255);
        out.writeBytes(raster, offset, 255);
        offset += 255;
      }

      out.writeByte(raster.length - offset);
      out.writeBytes(raster, offset, raster.length - offset);
      out.writeByte(0x00);

      //---------------------------------
      // GIF Terminator
      out.writeString(';');
    };

    var bitOutputStream = function(out) {

      var _out = out;
      var _bitLength = 0;
      var _bitBuffer = 0;

      var _this = {};

      _this.write = function(data, length) {

        if ( (data >>> length) != 0) {
          throw 'length over';
        }

        while (_bitLength + length >= 8) {
          _out.writeByte(0xff & ( (data << _bitLength) | _bitBuffer) );
          length -= (8 - _bitLength);
          data >>>= (8 - _bitLength);
          _bitBuffer = 0;
          _bitLength = 0;
        }

        _bitBuffer = (data << _bitLength) | _bitBuffer;
        _bitLength = _bitLength + length;
      };

      _this.flush = function() {
        if (_bitLength > 0) {
          _out.writeByte(_bitBuffer);
        }
      };

      return _this;
    };

    var getLZWRaster = function(lzwMinCodeSize) {

      var clearCode = 1 << lzwMinCodeSize;
      var endCode = (1 << lzwMinCodeSize) + 1;
      var bitLength = lzwMinCodeSize + 1;

      // Setup LZWTable
      var table = lzwTable();

      for (var i = 0; i < clearCode; i += 1) {
        table.add(String.fromCharCode(i) );
      }
      table.add(String.fromCharCode(clearCode) );
      table.add(String.fromCharCode(endCode) );

      var byteOut = byteArrayOutputStream();
      var bitOut = bitOutputStream(byteOut);

      // clear code
      bitOut.write(clearCode, bitLength);

      var dataIndex = 0;

      var s = String.fromCharCode(_data[dataIndex]);
      dataIndex += 1;

      while (dataIndex < _data.length) {

        var c = String.fromCharCode(_data[dataIndex]);
        dataIndex += 1;

        if (table.contains(s + c) ) {

          s = s + c;

        } else {

          bitOut.write(table.indexOf(s), bitLength);

          if (table.size() < 0xfff) {

            if (table.size() == (1 << bitLength) ) {
              bitLength += 1;
            }

            table.add(s + c);
          }

          s = c;
        }
      }

      bitOut.write(table.indexOf(s), bitLength);

      // end code
      bitOut.write(endCode, bitLength);

      bitOut.flush();

      return byteOut.toByteArray();
    };

    var lzwTable = function() {

      var _map = {};
      var _size = 0;

      var _this = {};

      _this.add = function(key) {
        if (_this.contains(key) ) {
          throw 'dup key:' + key;
        }
        _map[key] = _size;
        _size += 1;
      };

      _this.size = function() {
        return _size;
      };

      _this.indexOf = function(key) {
        return _map[key];
      };

      _this.contains = function(key) {
        return typeof _map[key] != 'undefined';
      };

      return _this;
    };

    return _this;
  };

  var createDataURL = function(width, height, getPixel) {
    var gif = gifImage(width, height);
    for (var y = 0; y < height; y += 1) {
      for (var x = 0; x < width; x += 1) {
        gif.setPixel(x, y, getPixel(x, y) );
      }
    }

    var b = byteArrayOutputStream();
    gif.write(b);

    var base64 = base64EncodeOutputStream();
    var bytes = b.toByteArray();
    for (var i = 0; i < bytes.length; i += 1) {
      base64.writeByte(bytes[i]);
    }
    base64.flush();

    return 'data:image/gif;base64,' + base64;
  };

  //---------------------------------------------------------------------
  // returns qrcode function.

  return qrcode;
}();

// multibyte support
!function() {

  qrcode.stringToBytesFuncs['UTF-8'] = function(s) {
    // http://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array
    function toUTF8Array(str) {
      var utf8 = [];
      for (var i=0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
          utf8.push(0xc0 | (charcode >> 6),
              0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
          utf8.push(0xe0 | (charcode >> 12),
              0x80 | ((charcode>>6) & 0x3f),
              0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
          i++;
          // UTF-16 encodes 0x10000-0x10FFFF by
          // subtracting 0x10000 and splitting the
          // 20 bits of 0x0-0xFFFFF into two halves
          charcode = 0x10000 + (((charcode & 0x3ff)<<10)
            | (str.charCodeAt(i) & 0x3ff));
          utf8.push(0xf0 | (charcode >>18),
              0x80 | ((charcode>>12) & 0x3f),
              0x80 | ((charcode>>6) & 0x3f),
              0x80 | (charcode & 0x3f));
        }
      }
      return utf8;
    }
    return toUTF8Array(s);
  };

}();

(function (factory) {
  if (typeof define === 'function' && define.amd) {
      define([], factory);
  } else if (typeof exports === 'object') {
      module.exports = factory();
  }
}(function () {
    return qrcode;
}));

(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var H = window.HEARTH || { asset: function (p) { return 'assets/' + p; }, personal: function (p) { return 'personal/' + p; }, media: function () { return null; },
                             fallbackMedia: { video: 'media/loop-1080.mp4', music: 'media/music-short.m4a' }, logLine: function () {}, config: {}, log: [] };
  var log = H.logLine || function () {};
  var SCENE = (H.config && H.config.scene) || 'fireplace';
  var APP_VERSION = '0.2.9';
  var BOOT = Date.now();
  var REMOTE = H.remote || 'https://mann107.github.io/hearth/';

  /* the newest version of each scene's loop, hosted next to the code (names are stitched into the video itself) */
  var MEDIA = { fireplace: { rev: 2, file: 'media/fireplace-r2-4k.mp4', bytes: 0 } };

  /* fit the 1920x1080 stage to whatever size the TV gives the app */
  (function () { var st = $('stage'); function fit() { var w = window.innerWidth || document.documentElement.clientWidth, h = window.innerHeight || document.documentElement.clientHeight, s = Math.min(w / 1920, h / 1080);
    st.style.transform = 'scale(' + s + ')'; st.style.left = ((w - 1920 * s) / 2) + 'px'; st.style.top = ((h - 1080 * s) / 2) + 'px'; } fit(); window.addEventListener('resize', fit); setTimeout(fit, 500); setTimeout(fit, 2000); })();

  var store = { get: function (k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
                set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  var BRAMPTON = { lat: 43.6834, lon: -79.7663 };
  var video = $('scene'), music = $('music'), overlay = $('overlay'), world = $('world');
  function short(u) { return (u || '–').split('?')[0].split('/').slice(-2).join('/'); }

  /* ================= loading screen ================= */
  var loader = $('loader'), steps = { fonts: false, art: false, video: false }, revealed = false;
  setTimeout(function () { loader.className = 'in'; }, 60);
  function progress() {
    var n = (steps.fonts ? 1 : 0) + (steps.art ? 1 : 0) + (steps.video ? 2 : 0);
    $('lfill').style.width = Math.max(8, n / 4 * 100) + '%';
    $('lcap').textContent = steps.video ? 'Ready' : steps.art ? 'Lighting the fire' : 'Warming up';
    if (steps.video && steps.art && steps.fonts) setTimeout(reveal, 500);
  }
  progress();
  try { if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { steps.fonts = true; progress(); }); else steps.fonts = true; } catch (e) { steps.fonts = true; }
  setTimeout(function () { steps.fonts = true; progress(); }, 2500);

  /* preload every piece of art before the room is shown, so nothing pops in */
  (function () {
    var urls = [H.asset('glow0.png'), H.asset('glow1.png'), H.asset('skymask.png'), H.asset('earth.jpg')], left = urls.length;
    for (var i = 0; i < 11; i++) urls.push(H.asset('elves/elf_' + i + '.png'));
    left = urls.length;
    urls.forEach(function (u) { var im = new Image(); im.onload = im.onerror = function () { if (--left === 0) { steps.art = true; progress(); } }; im.src = u; });
    setTimeout(function () { if (!steps.art) { steps.art = true; progress(); } }, 6000);
  })();
  [].forEach.call(document.querySelectorAll('[data-asset]'), function (el) { el.src = H.asset(el.getAttribute('data-asset')); });
  (function () { var m = 'url(' + H.asset('skymask.png') + ')', sk = $('sky'); sk.style.webkitMaskImage = m; sk.style.maskImage = m; })();

  function reveal() {
    if (revealed) return; revealed = true;
    log('reveal after ' + ((Date.now() - BOOT) / 1000).toFixed(1) + 's');
    loader.className = 'in gone';
    setTimeout(function () { $('curtain').className = 'up'; startMusic(); }, 450);
    setTimeout(function () { overlay.className = 'show intro'; }, 1500);
    setTimeout(function () { overlay.className = 'show'; showOverlay(60000); }, 1700);
    setTimeout(function () { elf.className = 'on'; }, 7000);
    setTimeout(function () { if (loader.parentNode) loader.parentNode.removeChild(loader); }, 3000);
    setTimeout(maybeShowPairing, 9000);
  }
  setTimeout(function () { if (!revealed) { log('reveal: gave up waiting after 15s'); steps.video = steps.art = steps.fonts = true; reveal(); } }, 15000);

  /* ================= remote keys =================
     The colour buttons and number keys no longer do anything; everything they did lives on the phone remote now. */
  try { tizen.tvinputdevice.registerKey('MediaPlayPause'); tizen.tvinputdevice.registerKey('MediaPlay'); tizen.tvinputdevice.registerKey('MediaPause'); } catch (e) {}
  ['ColorF0Red', 'ColorF1Green', 'ColorF2Yellow', 'ColorF3Blue', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    .forEach(function (k) { try { tizen.tvinputdevice.unregisterKey(k); } catch (e) {} });
  window.addEventListener('keydown', function (e) {        // runs before the shell's own listener
    var k = e.keyCode;
    if ((k >= 48 && k <= 57) || (k >= 403 && k <= 406)) { e.stopPropagation(); e.preventDefault(); }
  }, true);

  /* ================= media: TV storage -> USB stick -> GitHub -> built-in ================= */
  var hevc = !!(video.canPlayType('video/mp4; codecs="hvc1.1.6.L153.B0"') || video.canPlayType('video/mp4; codecs="hev1"') || video.canPlayType('video/mp4; codecs="hvc1"'));
  var CACHE = 'hearth-cache';
  var media = { state: 'starting', pct: 0, playing: '', stalls: 0 };
  function fsResolve(path, mode, ok, bad) { try { tizen.filesystem.resolve(path, ok, bad || function () { ok(null); }, mode || 'r'); } catch (e) { ok(null); } }
  function cacheURI(name, cb) { fsResolve('wgt-private/' + CACHE + '/' + name, 'r', function (f) { cb(f && f.fileSize > 1024 ? f.toURI() : null); }); }
  function cacheDir(cb) {
    fsResolve('wgt-private', 'rw', function (dir) {
      if (!dir) return cb(null);
      try { dir.createDirectory(CACHE); } catch (e) {}
      fsResolve('wgt-private/' + CACHE, 'rw', function (d) { cb(d); });
    });
  }
  function usbLabel(cb) {
    var labels = ['removable_sda2', 'removable_sda1', 'removable_sdb1', 'removable_sdb2'], i = 0;
    (function next() { if (i >= labels.length) return cb(null); var l = labels[i++]; fsResolve(l + '/Hearth/config.json', 'r', function (f) { if (f) cb(l); else next(); }); })();
  }
  function copyToCache(name, usbRel, done) {
    usbLabel(function (lab) {
      if (!lab) { log('copy: could not resolve USB label'); return done(false); }
      fsResolve('wgt-private', 'rw', function (dir) {
        if (!dir) { log('copy: wgt-private unavailable'); return done(false); }
        try { dir.createDirectory(CACHE); } catch (e) {}
        var src = lab + '/Hearth/' + usbRel, dst = 'wgt-private/' + CACHE + '/' + name, t0 = Date.now();
        log('copying ' + usbRel + ' into the TV…');
        function ok() { log('copied ' + name + ' in ' + Math.round((Date.now() - t0) / 1000) + 's'); done(true); }
        function bad(e) { log('copy failed (' + name + '): ' + (e && e.message)); done(false); }
        try { dir.copyTo(src, dst, true, ok, function (e) {
              if (tizen.filesystem.copyFile) { try { tizen.filesystem.copyFile(src, dst, true, ok, bad); } catch (x) { bad(x); } } else bad(e); }); }
        catch (e) { try { tizen.filesystem.copyFile(src, dst, true, ok, bad); } catch (x) { bad(x); } }
      });
    });
  }
  function deleteCached(name) {
    cacheDir(function (d) { if (!d) return; try { d.deleteFile('wgt-private/' + CACHE + '/' + name, function () { log('removed old ' + name); }, function () {}); } catch (e) {} });
  }
  /* download a file from GitHub straight into the TV's own storage (Tizen 5+ file API) */
  function downloadToCache(url, name, done) {
    if (!window.tizen || !tizen.filesystem || !tizen.filesystem.openFile) { log('download: this TV has no file-write API'); return done(false); }
    var x = new XMLHttpRequest(), t0 = Date.now(), lastLog = 0;
    media.state = 'downloading'; media.pct = 0;
    x.open('GET', url, true); x.responseType = 'blob'; x.timeout = 15 * 60000;
    x.onprogress = function (e) { if (e.lengthComputable) { media.pct = Math.round(e.loaded / e.total * 100); if (media.pct - lastLog >= 25) { lastLog = media.pct; log('downloading new video ' + media.pct + '%'); } } };
    x.onerror = x.ontimeout = function () { log('download failed (network)'); media.state = 'download failed'; done(false); };
    x.onload = function () {
      if (x.status !== 200 || !x.response || x.response.size < 1e6) { log('download failed (' + x.status + ')'); media.state = 'download failed'; return done(false); }
      var blob = x.response, part = 'wgt-private/' + CACHE + '/' + name + '.part', fin = 'wgt-private/' + CACHE + '/' + name;
      cacheDir(function (d) {
        if (!d) { media.state = 'no storage'; return done(false); }
        function finish() {
          function ok() { log('new video stored on the TV (' + Math.round(blob.size / 1048576) + ' MB in ' + Math.round((Date.now() - t0) / 1000) + 's)'); media.state = 'stored'; done(true); }
          function legacy() { try { d.moveTo(part, fin, true, ok, function (e) { log('move failed: ' + (e && e.message)); media.state = 'store failed'; done(false); }); } catch (e) { log('move failed: ' + e.message); media.state = 'store failed'; done(false); } }
          try { if (tizen.filesystem.moveFile) tizen.filesystem.moveFile(part, fin, true, ok, legacy); else legacy(); } catch (e) { legacy(); }
        }
        function fail(e) { log('write failed: ' + (e && e.message)); media.state = 'store failed'; done(false); }
        try {
          var fh = tizen.filesystem.openFile(part, 'w');
          if (fh.writeBlobNonBlocking) {
            fh.writeBlobNonBlocking(blob, function () { fh.closeNonBlocking(finish, fail); }, function (e) { try { fh.close(); } catch (z) {} fail(e); });
          } else {
            var fr = new FileReader();
            fr.onload = function () { try { fh.writeData(new Uint8Array(fr.result)); fh.close(); finish(); } catch (e) { try { fh.close(); } catch (z) {} fail(e); } };
            fr.onerror = fail; fr.readAsArrayBuffer(blob);
          }
        } catch (e) { fail(e); }
      });
    };
    x.send();
  }

  var played = false, vTry = null, vWatch = null, frames = 0;
  function playFrom(list, onFail) {
    if (!list.length) return onFail && onFail();
    var src = list[0]; clearTimeout(vWatch); frames = 0;
    video.onerror = function () { log('video error ' + (video.error && video.error.code) + ': ' + short(src)); playFrom(list.slice(1), onFail); };
    vWatch = setTimeout(function () { if (!played) { log('video stalled (state ' + video.readyState + '/' + video.networkState + '): ' + short(src)); media.stalls++; playFrom(list.slice(1), onFail); } }, 8000);
    vTry = src; video.src = src; video.load(); var p = video.play(); if (p && p.catch) p.catch(function () {});
  }
  video.addEventListener('playing', function () { if (!played) { log('playing ' + short(vTry) + ' ' + video.videoWidth + 'x' + video.videoHeight); media.playing = short(vTry); } played = true; clearTimeout(vWatch); });
  /* only call the video "ready" once real frames are moving – avoids revealing a black first frame */
  video.addEventListener('timeupdate', function () { if (played && video.currentTime > 0.2 && ++frames === 2) { steps.video = true; progress(); if (veiled) unveil(); } });
  video.addEventListener('ended', function () { video.currentTime = 0; video.play(); });
  /* switching source mid-session: a soft dip to black, never a hard cut */
  var veiled = false;
  function switchTo(list) {
    if (!revealed) { played = false; return playFrom(list); }
    veiled = true; $('curtain').className = 'veil';
    setTimeout(function () { played = false; playFrom(list, function () { unveil(); }); }, 950);
    setTimeout(function () { if (veiled) unveil(); }, 12000);
  }
  function unveil() { veiled = false; setTimeout(function () { $('curtain').className = 'up'; }, 250); }

  var M = MEDIA[SCENE], file = hevc ? 'loop-4k.mp4' : 'loop-1080.mp4';
  var oldName = SCENE + '-' + file, newName = M && hevc ? SCENE + '-r' + M.rev + '-' + file : null, newURL = M ? REMOTE + M.file : null;
  function startVideo() {
    if (!newName) media.state = 'not needed (1080p)';
    (newName ? cacheURI : function (n, cb) { cb(null); })(newName, function (fresh) {
      cacheURI(oldName, function (old) {
        var list = [];
        if (fresh) { list.push(fresh); media.state = 'stored'; }
        else if (old) list.push(old);
        if (H.media(SCENE, file)) list.push(H.media(SCENE, file));
        if (!fresh && H.online && newURL && hevc) list.push(newURL);          // stream it if nothing local works
        list.push(H.fallbackMedia.video);
        playFrom(list, function () { log('no video source worked'); });
        if (fresh) { if (old) deleteCached(oldName); return; }
        if (newName && H.online) {
          setTimeout(function () {
            downloadToCache(newURL, newName, function (ok) {
              if (ok) cacheURI(newName, function (u) { if (u) { log('switching to the new video'); switchTo([u].concat(list)); if (old) deleteCached(oldName); } });
            });
          }, 25000);                                                          // let startup settle first
        } else if (!old && H.usb) {
          copyToCache(oldName, 'scenes/' + SCENE + '/' + file, function (ok) { if (ok) cacheURI(oldName, function (u) { if (u) switchTo([u, H.fallbackMedia.video]); }); });
        }
      });
    });
  }
  startVideo();

  /* ================= music with gentle fades ================= */
  var vol = store.get('hearthVol', 0.35), curVol = 0, rampT = null, paused = false;
  function night() { var h = new Date().getHours(); return h >= 23 || h < 6; }
  function target() { return paused ? 0 : vol * (night() ? 0.6 : 1); }
  function rampTo(t, ms, done) {
    clearInterval(rampT); rampT = null;
    var steps2 = Math.max(1, Math.round(ms / 50)), start = curVol, i = 0;
    rampT = setInterval(function () {
      i++; var k = i / steps2; k = k * k * (3 - 2 * k);                        // ease in-out
      curVol = start + (t - start) * k; music.volume = Math.max(0, Math.min(1, curVol));
      if (i >= steps2) { clearInterval(rampT); rampT = null; if (done) done(); }
    }, 50);
  }
  var mName = SCENE + '-music.m4a', musicList = [], mWatch = null, mPlaying = false, musicReady = false;
  function musicFrom(list) {
    if (!list.length) { log('no music source worked'); return; }
    var src = list[0]; clearTimeout(mWatch);
    music.onerror = function () { log('music error: ' + short(src)); musicFrom(list.slice(1)); };
    mWatch = setTimeout(function () { if (!mPlaying) { log('music stalled: ' + short(src)); musicFrom(list.slice(1)); } }, 9000);
    music.src = src; var p = music.play(); if (p && p.catch) p.catch(function () {});
  }
  music.addEventListener('playing', function () { if (!mPlaying) log('music playing ' + short(music.currentSrc)); mPlaying = true; clearTimeout(mWatch); });
  cacheURI(mName, function (cached) {
    if (cached) musicList.push(cached);
    if (H.media(SCENE, 'music.m4a')) musicList.push(H.media(SCENE, 'music.m4a'));
    musicList.push(H.fallbackMedia.music); musicReady = true;
    if (!cached && H.usb) setTimeout(function () { copyToCache(mName, 'scenes/' + SCENE + '/music.m4a', function (ok) { if (ok) log('music stored on the TV – used from next start'); }); }, 60000);
  });
  function startMusic() {
    music.volume = 0; curVol = 0;
    (function go() { if (!musicReady) return setTimeout(go, 300); musicFrom(musicList);
      music.addEventListener('loadedmetadata', function once() { music.removeEventListener('loadedmetadata', once); var st = store.get('hearthPos', 0); try { if (st > 0 && st < music.duration) music.currentTime = st; } catch (e) {} });
      rampTo(target(), 9000); })();
  }
  setInterval(function () { if (!music.paused) store.set('hearthPos', Math.floor(music.currentTime)); }, 15000);
  setInterval(function () {
    if (paused || !revealed || !music.src) return;
    if (music.paused || music.ended) { log('music was paused by the TV – resuming'); var p = music.play(); if (p && p.catch) p.catch(function () {}); }
    if (!rampT && Math.abs(music.volume - target()) > 0.02) rampTo(target(), 2000);
  }, 4000);
  video.addEventListener('playing', function () { setTimeout(function () { if (!paused && music.src && music.paused) { var p = music.play(); if (p && p.catch) p.catch(function () {}); } }, 600); });
  function setVolume(v, quiet) { vol = Math.max(0, Math.min(1, Math.round(v * 100) / 100)); store.set('hearthVol', vol); rampTo(target(), 400); if (!quiet) toast('Music ' + Math.round(vol * 100) + '%'); }
  function setPaused(p) { paused = !!p; rampTo(target(), 1200, function () { if (paused) music.pause(); }); if (!paused) { var q = music.play(); if (q && q.catch) q.catch(function () {}); } toast(paused ? 'Music paused' : 'Music on'); }

  /* ================= info layer, toasts, phone messages ================= */
  var hideT = null;
  function showOverlay(ms) { if (overlay.className.indexOf('show') < 0) overlay.className = 'show'; clearTimeout(hideT); hideT = setTimeout(function () { overlay.className = ''; }, ms || 60000); }
  var toastT = null;
  function toast(msg, ms) { var t = $('toast'); t.textContent = msg; t.className = 'on'; clearTimeout(toastT); toastT = setTimeout(function () { t.className = ''; }, ms || 2200); }
  var noteT = null;
  function note(from, text, ms) {
    $('noteFrom').textContent = from ? 'From ' + from : 'A note'; $('noteText').textContent = text;
    $('note').className = 'on'; clearTimeout(noteT); noteT = setTimeout(function () { $('note').className = ''; }, Math.max(6000, Math.min(120000, ms || 20000)));
  }

  /* ================= living light ================= */
  var fire = $('firelight'), fl = 0.18;
  var boardEl = $('board');
  /* set the board into the chimney's own perspective. Mapped from the stone courses in the video (mortar joints fitted
     across the chimney face): they run downhill to the right at about 9.5° near the top of the board and 7.5° at the
     bottom, all meeting at one vanishing point off to the right; the chimney's edges stay vertical. The board is a flat
     rectangle warped onto that grid, so its text and frame foreshorten exactly like the stone around it. */
  (function () {
    var W = 164, Hh = 143, L = 434, R = 598, T = 62, B = 205, a1 = Math.tan(9.5 * Math.PI / 180), a2 = Math.tan(7.5 * Math.PI / 180);
    var x0 = L, y0 = T, x1 = R, y1 = T + (R - L) * a1, x2 = L, y2 = B, x3 = R, y3 = B + (R - L) * a2;
    var dx1 = x1 - x3, dx2 = x2 - x3, dy1 = y1 - y3, dy2 = y2 - y3, sx = x0 - x1 - x2 + x3, sy = y0 - y1 - y2 + y3, den = dx1 * dy2 - dx2 * dy1;
    var g = (sx * dy2 - dx2 * sy) / den, h = (dx1 * sy - sx * dy1) / den;
    var a = x1 - x0 + g * x1, b = x2 - x0 + h * x2, c = x0, d = y1 - y0 + g * y1, e = y2 - y0 + h * y2, f = y0;
    var m = [a / W, d / W, 0, g / W, b / Hh, e / Hh, 0, h / Hh, 0, 0, 1, 0, c, f, 0, 1];
    boardEl.style.transformOrigin = '0 0';
    boardEl.style.transform = 'matrix3d(' + m.map(function (v) { return +v.toFixed(9); }).join(',') + ')';
  })();
  setInterval(function () { fl += (0.12 + Math.random() * 0.16 - fl) * 0.45; fire.style.opacity = fl.toFixed(3); boardEl.style.setProperty('--fire', (0.9 + fl * 0.45).toFixed(3)); }, 110);
  var fxOn = store.get('hearthFx', true);
  function applyFx() { $('fx').className = fxOn ? '' : 'off'; }
  applyFx();

  /* ================= family photos in the two picture frames ================= */
  function buildFrame(id, key) {
    var el = $(id), imgs = [];
    for (var i = 0; i < 7; i++) { var im = document.createElement('img'); im.src = H.personal('framed/' + key + '_' + i + '.png'); el.appendChild(im); imgs.push(im); }
    return imgs;
  }
  var fA = buildFrame('frameA', 'A'), fB = buildFrame('frameB', 'B');
  var pa = Math.floor(Math.random() * 7), pb = (pa + 3) % 7;
  fA[pa].className = 'on'; fB[pb].className = 'on';
  function nextPhoto(which) {
    if (which !== 'B') { fA[pa].className = ''; pa = (pa + 1) % 7; fA[pa].className = 'on'; }
    if (which !== 'A') { fB[pb].className = ''; pb = (pb + 1) % 7; fB[pb].className = 'on'; }
  }
  setInterval(function () { nextPhoto('A'); }, 4 * 60000);
  setTimeout(function () { setInterval(function () { nextPhoto('B'); }, 4 * 60000); }, 2 * 60000);

  /* ================= the elf: hides somewhere new every 5 minutes ================= */
  var SPOTS = [
    ['mantel', 434.5, 419, 27, 38], ['balcony railing', 221, 124, 21.5, 30], ['right lamp', 1581.5, 578, 28.5, 40], ['left lamp', 181.5, 608, 28.5, 40],
    ['coffee table', 1112.5, 832.5, 35, 49], ['presents', 268.5, 827.5, 35, 49], ['presents by the window', 1479, 774.5, 34, 47.5],
    ['big window', 1328.5, 313.5, 23, 32], ['chandelier', 110.5, 405.5, 23, 32], ['bookshelf', 249.5, 437.5, 24.5, 34.5], ['fireplace wreath', 516.5, 244.5, 27, 19]];
  var elf = $('elf'), elfAt = store.get('hearthElf', -1), elfMovedAt = Date.now();
  function placeElf(i) {
    var s = SPOTS[i]; elf.src = H.asset('elves/elf_' + i + '.png');
    elf.style.left = s[1] + 'px'; elf.style.top = s[2] + 'px'; elf.style.width = s[3] + 'px'; elf.style.height = s[4] + 'px';
    elfAt = i; store.set('hearthElf', i); elfMovedAt = Date.now();
  }
  function moveElf() {
    elf.className = '';
    setTimeout(function () {
      var n; do { n = Math.floor(Math.random() * SPOTS.length); } while (n === elfAt);
      placeElf(n); setTimeout(function () { elf.className = 'on'; }, 200);
    }, 1600);
  }
  if (elfAt < 0 || elfAt >= SPOTS.length) elfAt = Math.floor(Math.random() * SPOTS.length);
  placeElf(elfAt);
  var elfTimer = setInterval(moveElf, 5 * 60000);
  var hintT = null;
  function elfHint() {
    toast('The elf is shining for a moment…', 2500);
    elf.className = 'on hint'; clearTimeout(hintT); hintT = setTimeout(function () { elf.className = 'on'; }, 4500);
  }

  /* ================= Santa flying past the windows ================= */
  var sleigh = $('sleigh'), flying = false;
  function flyover() {
    if (flying) return; flying = true;
    sleigh.className = ''; void sleigh.offsetWidth; sleigh.className = 'fly';
    setTimeout(function () { sleigh.className = ''; flying = false; }, 11500);
  }
  var lastFly = Date.now();
  setInterval(function () {
    var d = new Date(), m = d.getMonth(), day = d.getDate(), h = d.getHours(), since = (Date.now() - lastFly) / 60000;
    var evening = h >= 16 || h < 1, go = false;
    if (m === 11 && day === 24 && evening) go = since >= 15;
    else if (m === 11 && day < 24 && evening) go = since >= 20 && Math.random() < 1 / 40;
    else if (evening) go = since >= 30 && Math.random() < 1 / 120;
    if (go) { lastFly = Date.now(); flyover(); }
  }, 60000);

  /* ================= clock, date, countdown ================= */
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function tick() {
    var d = new Date(), h = d.getHours();
    $('time').textContent = (((h + 11) % 12) + 1) + ':' + pad(d.getMinutes());
    $('ampm').textContent = h < 12 ? 'AM' : 'PM';
    $('greet').textContent = h < 5 ? 'Good night' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    $('date').textContent = DAYS[d.getDay()] + ', ' + MONTHS[d.getMonth()] + ' ' + d.getDate();
    var today = new Date(d.getFullYear(), d.getMonth(), d.getDate()), xmas = new Date(d.getFullYear(), 11, 25);
    if (today > xmas) xmas = new Date(d.getFullYear() + 1, 11, 25);
    var days = Math.round((xmas - today) / 86400000);
    $('countdown').textContent = days === 0 ? 'Merry Christmas' : days === 1 ? 'One more sleep' : days + ' sleeps until Christmas';
    $('dim').style.opacity = night() ? 0.35 : 0;
    if (!paused && !rampT && revealed && Math.abs(music.volume - target()) > 0.02) rampTo(target(), 4000);
    if (!demo) santaTick(d);
  }

  /* ================= Santa model ================= */
  var santa = { lat: 90, lon: 0, flying: false, line: '', pct: 0 };
  function santaAtLon(lon) { santa.lon = lon; santa.lat = 18 + 28 * Math.sin(lon * Math.PI / 60); }
  function km(a, b) {
    var r = Math.PI / 180, dl = (b.lat - a.lat) * r, dn = (b.lon - a.lon) * r;
    var x = Math.sin(dl / 2) * Math.sin(dl / 2) + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dn / 2) * Math.sin(dn / 2);
    return 6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  }
  var lastHouse = 0;
  function santaTick(now) {
    var y = now.getUTCFullYear(), t = now.getTime();
    var prep = Date.UTC(y, 10, 1), dep = Date.UTC(y, 11, 24, 10), land = Date.UTC(y, 11, 25, 12), pct;
    if (t >= prep && t < dep) {
      pct = (t - prep) / (dep - prep); santa.flying = false; santa.lat = 90;
      var dd = Math.ceil((dep - t) / 86400000);
      santa.line = 'Sleigh prep · ' + Math.floor(pct * 100) + '%';
      $('santaLabel').textContent = 'Santa · takes off in ' + dd + (dd === 1 ? ' day' : ' days');
    } else if (t >= dep && t < land) {
      pct = (t - dep) / (land - dep); santa.flying = true;
      var lon = -15 * ((t - Date.UTC(y, 11, 25)) / 3600000); santaAtLon(((lon + 540) % 360) - 180);
      santa.line = 'Delivering now · ' + Math.floor(pct * 100) + '%';
      $('santaLabel').textContent = 'Santa · in flight';
      var dist = km(santa, BRAMPTON);
      if (dist < 3000 && Date.now() - lastHouse > 8 * 60000) { lastHouse = Date.now(); houseMoment(dist, 30000); }
    } else {
      pct = 1; santa.flying = false; santa.lat = 90;
      santa.line = 'Home at the North Pole'; $('santaLabel').textContent = 'Santa';
    }
    santa.pct = pct; $('santaLine').textContent = santa.line;
    $('santaFill').style.width = (pct * 100).toFixed(1) + '%';
  }
  var house = $('house'), houseT = null;
  function houseText(dist) {
    if (dist < 120) { $('houseLine').textContent = 'Santa is over Brampton!'; $('houseSub').textContent = 'Lights off, everyone to bed'; }
    else { $('houseLine').textContent = 'Santa is ' + Math.round(dist / 10) * 10 + ' km from Brampton'; $('houseSub').textContent = 'He’s heading your way'; }
  }
  function houseMoment(dist, ms) {
    houseText(dist); house.className = 'on'; overlay.className = '';
    if (dist < 120) flyover();
    clearTimeout(houseT); houseT = setTimeout(function () { house.className = ''; }, ms);
  }
  /* demo: replays the Christmas Eve approach in 30 seconds (from the phone remote) */
  var demo = false;
  function runDemo() {
    if (demo) return; demo = true; var start = Date.now(), D = 26000, wasFlying = santa.flying;
    santa.flying = true; houseMoment(2400, D + 6000);
    var iv = setInterval(function () {
      var k = Math.min(1, (Date.now() - start) / D), lon = -30 + (BRAMPTON.lon + 30) * k;
      santaAtLon(lon); if (k >= 1) { santa.lat = BRAMPTON.lat; santa.lon = BRAMPTON.lon; }
      houseText(k >= 1 ? 0 : km(santa, BRAMPTON));
      if (k >= 1) { clearInterval(iv); flyover(); setTimeout(function () { demo = false; santa.flying = wasFlying; tick(); }, 9000); }
    }, 250);
  }

  /* ================= globes: NASA Blue Marble with live day/night ================= */
  var tex = null, TW = 0, TH = 0;
  var img = new Image();
  img.onload = function () { var c = document.createElement('canvas'); c.width = TW = img.width; c.height = TH = img.height; var g = c.getContext('2d'); g.drawImage(img, 0, 0); tex = g.getImageData(0, 0, TW, TH).data; };
  img.src = H.asset('earth.jpg');
  function sun(d) {
    var start = Date.UTC(d.getUTCFullYear(), 0, 0), doy = (d.getTime() - start) / 86400000;
    return { dec: -23.44 * Math.cos(2 * Math.PI / 365 * (doy + 10)) * Math.PI / 180, lon: (-15 * (d.getUTCHours() + d.getUTCMinutes() / 60 - 12)) * Math.PI / 180 };
  }
  function Globe(canvas, tiltDeg) {
    var cx = canvas.getContext('2d'), S = canvas.width, R = S / 2 - 6, out = cx.createImageData(S, S), tilt = tiltDeg * Math.PI / 180, table = [];
    for (var py = 0; py < S; py++) for (var px = 0; px < S; px++) {
      var x = (px - S / 2 + 0.5) / R, y = (S / 2 - py - 0.5) / R, r2 = x * x + y * y; if (r2 > 1) continue;
      var z = Math.sqrt(1 - r2), y2 = y * Math.cos(tilt) + z * Math.sin(tilt), z2 = -y * Math.sin(tilt) + z * Math.cos(tilt);
      table.push(py * S + px, Math.asin(y2), Math.atan2(x, z2), z, Math.min(1, (1 - Math.sqrt(r2)) * 18));
    }
    this.view = -80 * Math.PI / 180;
    this.draw = function (ts, markers) {
      var s = sun(new Date()), sd = Math.sin(s.dec), cd = Math.cos(s.dec), o = out.data, v = this.view;
      for (var i = 3; i < o.length; i += 4) o[i] = 0;
      for (var j = 0; j < table.length; j += 5) {
        var idx = table[j], lat = table[j + 1], lon = table[j + 2] + v, z = table[j + 3], edge = table[j + 4];
        var lw = ((lon / (2 * Math.PI) + 0.5) % 1 + 1) % 1, tx = (lw * TW) | 0, ty = ((0.5 - lat / Math.PI) * TH) | 0; if (ty >= TH) ty = TH - 1;
        var ti = (ty * TW + tx) * 4, light = Math.sin(lat) * sd + Math.cos(lat) * cd * Math.cos(lon - s.lon);
        var day = Math.max(0, Math.min(1, light * 5 + 0.5)), f = (0.38 + 0.62 * day) * (0.6 + 0.4 * z), n = 1 - day, oi = idx * 4;
        o[oi] = tex[ti] * f * (1 - 0.25 * n) + n * 6; o[oi + 1] = tex[ti + 1] * f * (1 - 0.12 * n) + n * 14; o[oi + 2] = tex[ti + 2] * f + n * 34; o[oi + 3] = 255 * edge;
      }
      cx.clearRect(0, 0, S, S); cx.putImageData(out, 0, 0);
      var g = cx.createRadialGradient(S / 2, S / 2, R * 0.86, S / 2, S / 2, R * 1.06);
      g.addColorStop(0, 'rgba(120,175,255,0)'); g.addColorStop(0.7, 'rgba(120,175,255,.28)'); g.addColorStop(1, 'rgba(120,175,255,0)');
      cx.fillStyle = g; cx.beginPath(); cx.arc(S / 2, S / 2, R * 1.06, 0, Math.PI * 2); cx.fill();
      for (var k = 0; k < markers.length; k++) {
        var mk = markers[k], la = mk.lat * Math.PI / 180, lo = mk.lon * Math.PI / 180 - v;
        var X = Math.cos(la) * Math.sin(lo), Y = Math.sin(la), Z = Math.cos(la) * Math.cos(lo);
        var vy = Y * Math.cos(tilt) - Z * Math.sin(tilt), vz = Y * Math.sin(tilt) + Z * Math.cos(tilt);
        if (vz < -0.05) continue;
        var sx = S / 2 + X * R, sy = S / 2 - vy * R, rr = mk.r * S / 220, pulse = 0.6 + 0.4 * Math.sin(ts / 400);
        if (mk.glow) { var gg = cx.createRadialGradient(sx, sy, 0, sx, sy, rr * 4); gg.addColorStop(0, 'rgba(255,90,70,' + (0.55 * pulse) + ')'); gg.addColorStop(1, 'rgba(255,90,70,0)'); cx.fillStyle = gg; cx.beginPath(); cx.arc(sx, sy, rr * 4, 0, Math.PI * 2); cx.fill(); }
        cx.fillStyle = mk.color; cx.beginPath(); cx.arc(sx, sy, rr, 0, Math.PI * 2); cx.fill();
        cx.strokeStyle = 'rgba(255,255,255,.9)'; cx.lineWidth = Math.max(1, S / 180); cx.stroke();
      }
    };
  }
  var small = new Globe($('globe'), 24), big = new Globe($('bigGlobe'), 38), lastF = 0;
  /* also measures how smoothly the TV is drawing, for the admin page */
  var fpsCount = 0, fps = 0, fpsT = performance.now();
  function frame(ts) {
    requestAnimationFrame(frame);
    fpsCount++; if (ts - fpsT >= 1000) { fps = Math.round(fpsCount * 1000 / (ts - fpsT)); fpsCount = 0; fpsT = ts; }
    if (!tex || ts - lastF < 66) return;
    var dt = lastF ? Math.min(0.5, (ts - lastF) / 1000) : 0; lastF = ts;
    var santaMk = { lat: santa.lat, lon: santa.lon, r: 3.6, color: '#ff5a46', glow: true };
    if (overlay.className.indexOf('show') >= 0) {
      if (santa.flying) { var tg = santa.lon * Math.PI / 180, df = Math.atan2(Math.sin(tg - small.view), Math.cos(tg - small.view)); small.view += df * Math.min(1, dt * 0.8); }
      else small.view += dt * (2 * Math.PI / 150);
      small.draw(ts, [santaMk]);
    }
    if (house.className === 'on') {
      var mid = (santa.lon + BRAMPTON.lon) / 2 * Math.PI / 180, d2 = Math.atan2(Math.sin(mid - big.view), Math.cos(mid - big.view));
      big.view += d2 * Math.min(1, dt * 1.2);
      big.draw(ts, [{ lat: BRAMPTON.lat, lon: BRAMPTON.lon, r: 2.6, color: '#f3cf86', glow: false }, santaMk]);
    }
  }
  requestAnimationFrame(frame);
  var lag = 0, lagT = Date.now();
  setInterval(function () { var n = Date.now(); lag = Math.max(0, n - lagT - 1000); lagT = n; }, 1000);

  /* ================= the board on the chimney =================
     Priority, top to bottom: family notes (only when there is one) → live games → today's and tomorrow's big games →
     Brampton weather when there's nothing else. A thin ticker along the bottom carries only the most serious world
     news (war, strikes, bombings, attacks); it disappears when there's none. */
  var ESPN = 'https://site.api.espn.com/apis/site/v2/sports/';
  var COMPS = {
    nhl: { n: 'NHL', path: 'hockey/nhl', base: 40, c: '#8fb8e8', days: 2 },
    epl: { n: 'Premier League', path: 'soccer/eng.1', base: 30, c: '#b48ad6', days: 4 },
    ucl: { n: 'Champions League', path: 'soccer/uefa.champions', base: 36, c: '#6f8ff0', days: 4 },
    ccl: { n: 'CONCACAF', path: 'soccer/concacaf.champions', base: 24, c: '#4fb3a6', days: 3 },
    cnl: { n: 'CONCACAF', path: 'soccer/concacaf.nations.league', base: 24, c: '#4fb3a6', days: 3, dflt: true },
    gold: { n: 'Gold Cup', path: 'soccer/concacaf.gold', base: 26, c: '#d9b45a', days: 3, dflt: true }
  };
  var CANADA_NHL = { TOR: 12, OTT: 6, MTL: 6, WPG: 6, EDM: 6, CGY: 5, VAN: 5 };         // Leafs first, then the rest of Canada
  var BIG = ['Arsenal', 'Manchester City', 'Liverpool', 'Chelsea', 'Manchester United', 'Tottenham Hotspur', 'Newcastle United', 'Aston Villa',
             'Real Madrid', 'Barcelona', 'Bayern Munich', 'Paris Saint-Germain', 'Internazionale', 'Juventus', 'AC Milan', 'Borussia Dortmund', 'Atletico Madrid'];
  var CONCACAF_MAIN = /Canada|United States|USA|Mexico|Toronto|Vancouver|Montr[eé]al|Inter Miami|LAFC|LA Galaxy|Club Am[eé]rica|Monterrey|Tigres|Cruz Azul|Chivas|Guadalajara|Seattle|Columbus/i;
  var settings = store.get('hearthSports', { comps: ['nhl', 'epl', 'ucl', 'ccl'], favs: [] });
  if (!settings.comps) settings = { comps: ['nhl', 'epl', 'ucl', 'ccl'], favs: [] };
  var FAVS = {
    bar: { n: 'Barcelona', id: '83' }, arg: { n: 'Argentina', id: '202' }, mia: { n: 'Inter Miami', id: '20232' }, can: { n: 'Canada', id: '206' },
    tfc: { n: 'Toronto FC', id: '7318' }, rma: { n: 'Real Madrid', id: '86' }, psg: { n: 'PSG', id: '160' }, bay: { n: 'Bayern', id: '132' }
  };
  var notes = store.get('hearthNotes', []);
  var gamesByComp = {}, favGames = {}, weather = null, news = [], dataReady = false;

  function getJSON(url, cb) {
    var x = new XMLHttpRequest(), done = false, to = setTimeout(function () { if (!done) { done = true; try { x.abort(); } catch (e) {} cb(null); } }, 20000);
    x.onreadystatechange = function () { if (x.readyState !== 4 || done) return; done = true; clearTimeout(to); var j = null; if (x.status === 200) { try { j = JSON.parse(x.responseText); } catch (e) {} } cb(j, x); };
    try { x.open('GET', url, true); x.send(); } catch (e) { done = true; clearTimeout(to); cb(null); }
  }
  function score(s) { if (s == null) return ''; if (typeof s === 'object') return s.displayValue != null ? s.displayValue : (s.value != null ? String(s.value) : ''); return String(s); }
  function ymd(ms) { var d = new Date(ms); return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()); }

  /* one game, scored for how much this family cares about it */
  function parseGame(e, ck, favKey) {
    var c = e.competitions && e.competitions[0]; if (!c || !c.competitors || c.competitors.length < 2) return null;
    var home = null, away = null;
    c.competitors.forEach(function (t) { if (t.homeAway === 'home') home = t; else away = t; });
    if (!home || !away) { home = c.competitors[0]; away = c.competitors[1]; }
    var st = (c.status || e.status || {}).type || {}, C = COMPS[ck] || { n: '', base: 28, c: '#d9b45a' };
    var hn = home.team.displayName || '', an = away.team.displayName || '';
    var g = { id: e.id, d: Date.parse(e.date), comp: ck, lg: (favKey && e.league && e.league.abbreviation) || C.n, c: C.c,
              state: st.state || 'pre', detail: st.shortDetail || '',
              h: { n: home.team.shortDisplayName || hn, full: hn, ab: home.team.abbreviation, s: score(home.score) },
              a: { n: away.team.shortDisplayName || an, full: an, ab: away.team.abbreviation, s: score(away.score) }, w: C.base, star: 'h' };
    if (ck === 'nhl') {
      var bh = CANADA_NHL[g.h.ab] || 0, ba = CANADA_NHL[g.a.ab] || 0;
      if (!bh && !ba) return null;                                                   // NHL: Canadian teams only
      g.w += Math.max(bh, ba) + (bh && ba ? 8 : 0); g.star = bh >= ba ? 'h' : 'a';
    } else if (ck === 'ccl' || ck === 'cnl' || ck === 'gold') {
      var mh = CONCACAF_MAIN.test(hn), ma = CONCACAF_MAIN.test(an);
      if (!mh && !ma) return null;                                                   // only the main CONCACAF sides
      g.w += (/Canada|Toronto|Vancouver|Montr/i.test(hn + an) ? 12 : 0); g.star = mh || !ma ? 'h' : 'a';
    } else if (ck === 'epl' || ck === 'ucl') {
      var kh = BIG.indexOf(hn) >= 0, ka = BIG.indexOf(an) >= 0;
      g.w += (kh ? 6 : 0) + (ka ? 6 : 0) + (kh && ka ? 8 : 0); g.star = kh || !ka ? 'h' : 'a';
    }
    if (favKey) { g.w += 30; g.star = String(away.team.id) === FAVS[favKey].id ? 'a' : 'h'; }
    return g;
  }
  function loadComp(ck, done) {
    var C = COMPS[ck], urls = [], out = {}, left;
    if (C.dflt) urls.push(ESPN + C.path + '/scoreboard');
    for (var i = 0; i < C.days; i++) urls.push(ESPN + C.path + '/scoreboard?dates=' + ymd(Date.now() + i * 86400000));
    if (ck !== 'nhl') urls.push(ESPN + C.path + '/scoreboard?dates=' + ymd(Date.now() - 86400000));   // last night's results
    left = urls.length;
    urls.forEach(function (u, k) {
      setTimeout(function () {
        getJSON(u, function (j) {
          if (j && j.events) j.events.forEach(function (e) { var g = parseGame(e, ck); if (g) out[g.id] = g; });
          if (--left === 0) { gamesByComp[ck] = Object.keys(out).map(function (id) { return out[id]; }); done && done(); }
        });
      }, k * 700);
    });
  }
  function loadFav(fk, done) {
    var F = FAVS[fk]; if (!F) return done && done();
    getJSON(ESPN + 'soccer/all/teams/' + F.id + '/schedule?fixture=true', function (j) {
      if (j && j.events) { var now = Date.now(); favGames[fk] = j.events.map(function (e) { return parseGame(e, 'fav', fk); }).filter(function (g) { return g && g.d > now - 86400000 && g.d < now + 5 * 86400000; }); }
      done && done();
    });
  }
  function refreshSports() {
    var jobs = [];
    settings.comps.forEach(function (ck) { if (COMPS[ck]) jobs.push(function (n) { loadComp(ck, n); }); if (ck === 'ccl') { jobs.push(function (n) { loadComp('cnl', n); }); jobs.push(function (n) { loadComp('gold', n); }); } });
    (settings.favs || []).forEach(function (fk) { jobs.push(function (n) { loadFav(fk, n); }); });
    Object.keys(gamesByComp).forEach(function (k) { if (settings.comps.indexOf(k) < 0 && !(settings.comps.indexOf('ccl') >= 0 && (k === 'cnl' || k === 'gold'))) delete gamesByComp[k]; });
    Object.keys(favGames).forEach(function (k) { if ((settings.favs || []).indexOf(k) < 0) delete favGames[k]; });
    (function next() { if (!jobs.length) { dataReady = true; renderBoard(); publishBoard(); return; } jobs.shift()(function () { setTimeout(next, 800); }); })();
  }
  /* live games: refresh just that day's scoreboard every 60 s */
  function liveTick() {
    var now = Date.now(), seen = {};
    allGames().forEach(function (g) {
      if (g.state === 'post' || now < g.d - 5 * 60000 || now > g.d + 4 * 3600000 || !COMPS[g.comp]) return;
      var u = ESPN + COMPS[g.comp].path + '/scoreboard?dates=' + ymd(g.d); if (seen[u]) return; seen[u] = 1;
      getJSON(u, function (j) {
        if (!j || !j.events) return;
        j.events.forEach(function (e) { var n = parseGame(e, g.comp); if (!n) return; allGames().forEach(function (o) { if (o.id === n.id) { o.state = n.state; o.detail = n.detail; o.h.s = n.h.s; o.a.s = n.a.s; } }); });
        renderBoard(); publishBoard();
      });
    });
  }
  function allGames() {
    var L = [], ids = {};
    Object.keys(gamesByComp).forEach(function (k) { gamesByComp[k].forEach(function (g) { if (!ids[g.id]) { ids[g.id] = 1; L.push(g); } }); });
    Object.keys(favGames).forEach(function (k) { favGames[k].forEach(function (g) { if (!ids[g.id]) { ids[g.id] = 1; L.push(g); } else L.forEach(function (o) { if (o.id === g.id) o.w = Math.max(o.w, g.w); }); }); });
    return L;
  }
  function ranked() {
    var now = Date.now(), day0 = new Date(new Date().setHours(0, 0, 0, 0)).getTime(), out = [];
    allGames().forEach(function (g) {
      var live = g.state === 'in', fin = g.state === 'post' && now - g.d < 5 * 3600000 && now - g.d > 0, pre = g.state === 'pre' && g.d > now - 2 * 3600000 && g.d < now + 72 * 3600000;
      if (!(live || fin || pre)) return;
      var bucket = live ? 0 : fin ? 1 : g.d < day0 + 86400000 ? 2 : g.d < day0 + 2 * 86400000 ? 3 : 4;
      if (bucket === 4 && g.w < 46) return;                                          // further out: only the biggest games
      out.push({ g: g, b: bucket });
    });
    out.sort(function (x, y) { return x.b - y.b || y.g.w - x.g.w || x.g.d - y.g.d; });
    return out.slice(0, 6).map(function (x) { return x.g; });
  }
  setTimeout(refreshSports, 5000); setInterval(refreshSports, 2 * 3600000); setInterval(liveTick, 60000);

  /* weather for the quiet times (Open-Meteo, no key needed) */
  var WMO = { 0: 'Clear', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Cloudy', 45: 'Fog', 48: 'Fog', 51: 'Drizzle', 53: 'Drizzle', 55: 'Drizzle', 56: 'Freezing drizzle', 57: 'Freezing drizzle',
              61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 66: 'Freezing rain', 67: 'Freezing rain', 71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 77: 'Snow grains',
              80: 'Showers', 81: 'Showers', 82: 'Heavy showers', 85: 'Snow showers', 86: 'Snow showers', 95: 'Thunderstorms', 96: 'Thunderstorms', 99: 'Thunderstorms' };
  function loadWeather() {
    getJSON('https://api.open-meteo.com/v1/forecast?latitude=' + BRAMPTON.lat + '&longitude=' + BRAMPTON.lon + '&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=America%2FToronto&forecast_days=2', function (j) {
      if (j && j.current) { weather = { t: Math.round(j.current.temperature_2m), w: WMO[j.current.weather_code] || '', lo: Math.round(j.daily.temperature_2m_min[0]), hi1: Math.round(j.daily.temperature_2m_max[1]), w1: WMO[j.daily.weather_code[1]] || '' }; renderBoard(); }
    });
  }
  setTimeout(loadWeather, 3000); setInterval(loadWeather, 30 * 60000);

  /* ticker: only the most serious world news */
  var FEEDS = ['https://rss.nytimes.com/services/xml/rss/nyt/World.xml', 'https://feeds.bbci.co.uk/news/world/rss.xml', 'https://www.aljazeera.com/xml/rss/all.xml', 'https://www.theguardian.com/world/rss'];
  var HOT = /\b(air ?strikes?|missiles?|ballistic|bombs?|bombed|bombings?|explosions?|blasts?|drone (?:strikes?|attacks?)|shelling|invasion|invades?|invaded|nuclear|hostages?|rockets?|terror(?:ist|ism)?|suicide bomber|gunmen|massacre|ceasefire|truce|war|warplanes?|troops|militants?|attacks?|killed)\b/i;
  var STRONG = /\b(air ?strikes?|missiles?|ballistic|bombs?|bombed|bombings?|explosions?|blasts?|drone (?:strikes?|attacks?)|shelling|invasion|invades?|invaded|nuclear|terror(?:ist|ism)? attack|suicide bomber|massacre|warplanes?)\b/i;
  var COLD = /\b(price war|trade war|culture war|star wars|war of words|war chest|cold war-era|film|movie|series|novel|book|review|museum|exhibition|anniversary|memorial|remembrance|veterans?|football|soccer|cricket|rugby|tennis|olympic|award|recipe|fashion|podcast|quiz|opinion|interview|explainer|what we know|analysis|photos?:|in pictures|crossword|obituary)\b/i;
  var STATE = /\b(russia|russian|ukraine|ukrainian|kyiv|moscow|crimea|iran|iranian|tehran|israel|israeli|gaza|lebanon|hezbollah|hamas|houthis?|yemen|syria|u\.s\.|pentagon|nato|china|chinese|taiwan|north korea|pakistan|india|bahrain|kuwait|qatar|saudi)\b/i;
  var ACT = /\b(attacks?|attacked|strikes?|struck|hit|hits|bombard\w*|shell\w*|fired|launch(?:es|ed)?|intercept\w*)\b/i;
  var SOFT = /\b(trial|sentenc\w*|convict\w*|court|lawsuit|sues?|whistleblower|claims?|plot|could.ve|could have|how the|why|what|explainer|proof|lessons|inquiry|probe|keeping it|rainy day)\b/i;
  function newsScore(t) {
    if (!HOT.test(t) || COLD.test(t)) return 0;
    var s = 1; if (STRONG.test(t)) s += 3; if (STATE.test(t) && ACT.test(t)) s += 3; if (/\b(killed|dead|deaths?)\b/i.test(t)) s += 1; if (SOFT.test(t)) s -= 5;
    return s;
  }
  function loadNews() {
    var got = [], left = FEEDS.length;
    FEEDS.forEach(function (u) {
      var x = new XMLHttpRequest(), done = false, to = setTimeout(function () { finish(); }, 15000);
      function finish() { if (done) return; done = true; clearTimeout(to); if (--left === 0) settle(); }
      x.onreadystatechange = function () {
        if (x.readyState !== 4) return;
        try {
          var doc = x.responseXML || (new DOMParser()).parseFromString(x.responseText, 'text/xml'), items = doc.getElementsByTagName('item');
          for (var i = 0; i < items.length && i < 60; i++) {
            var t = (items[i].getElementsByTagName('title')[0] || {}).textContent || '', p = (items[i].getElementsByTagName('pubDate')[0] || {}).textContent || '';
            var when = Date.parse(p) || 0; t = t.replace(/\s+/g, ' ').trim().replace(/^[^:]{0,24}\blive:\s*/i, '');
            if (t && when && Date.now() - when < 8 * 3600000) { var s = newsScore(t); if (s >= 3) got.push({ t: t, d: when, s: s, src: u.indexOf('nytimes') > 0 ? 'NYT' : u.indexOf('bbc') > 0 ? 'BBC' : u.indexOf('aljazeera') > 0 ? 'Al Jazeera' : 'Guardian' }); }
          }
        } catch (e) {}
        finish();
      };
      try { x.open('GET', u, true); x.send(); } catch (e) { finish(); }
    });
    function settle() {
      got.sort(function (a, b) { return b.s - a.s || b.d - a.d; });
      var seen = [], out = [];
      got.forEach(function (n) { var k = n.t.toLowerCase().replace(/[^a-z ]/g, '').split(' ').filter(function (w) { return w.length > 3; }).slice(0, 5);
        if (seen.some(function (s) { var c = 0; k.forEach(function (w) { if (s.indexOf(w) >= 0) c++; }); return c >= 3; })) return; seen.push(k); out.push(n); });
      news = out.slice(0, 3); renderTicker(); publishBoard();
    }
  }
  setTimeout(loadNews, 7000); setInterval(loadNews, 10 * 60000);
  var tickSig = '';
  function renderTicker() {
    var sig = news.map(function (n) { return n.t; }).join('|'); if (sig === tickSig) return; tickSig = sig;
    var el = $('bTick'), run = $('bTickRun');
    if (!news.length) { el.className = ''; $('bScreen').className = ''; return; }
    var txt = news.map(function (n) { return esc(n.t) + ' <span class="src">' + n.src + '</span>'; }).join('<i></i>');
    run.innerHTML = '<span>' + txt + '<i></i></span><span>' + txt + '<i></i></span>';
    el.className = 'on'; $('bScreen').className = 'tick';
    setTimeout(function () { var w = run.firstChild.offsetWidth; run.style.animationDuration = Math.max(18, w / 14) + 's'; }, 100);
  }

  /* ---------- drawing the board ---------- */
  function when(ms) {
    var d = new Date(ms), now = new Date(), day0 = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    var dd = Math.floor((new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() - day0) / 86400000);
    var h = d.getHours(), t = (((h + 11) % 12) + 1) + (d.getMinutes() ? ':' + pad(d.getMinutes()) : '') + (h < 12 ? ' am' : ' pm');
    var w = dd === 0 ? (h >= 17 ? 'Tonight' : 'Today') : dd === 1 ? 'Tomorrow' : dd < 7 ? DAYS[d.getDay()].slice(0, 3) : MONTHS[d.getMonth()].slice(0, 3) + ' ' + d.getDate();
    return w + ' · ' + t;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function ago(t) { var m = Math.round((Date.now() - t) / 60000); return m < 1 ? 'just now' : m < 60 ? m + ' min ago' : m < 1440 ? Math.round(m / 60) + ' h ago' : Math.round(m / 1440) + ' d ago'; }
  function gameRow(g) {
    var S = g[g.star], O = g[g.star === 'h' ? 'a' : 'h'], wt;
    if (g.state === 'in') wt = '<span class="live">Live · ' + esc(g.detail.replace(/ - /, ' ')) + '</span>';
    else if (g.state === 'post') wt = 'Final' + (/OT|SO|Pen/i.test(g.detail) ? ' · ' + esc(g.detail.replace(/^Final\/?/i, '')) : '');
    else wt = esc(when(g.d));
    wt += '<span class="lg">' + esc(g.lg) + '</span>';
    var right = g.state !== 'pre' && S.s !== '' ? '<div class="sc">' + esc(S.s) + '<i>–</i>' + esc(O.s) + '</div>' : '';
    return '<div class="bg"><div class="chip" style="background:' + g.c + '"></div><div class="m"><div class="w">' + wt + '</div><div class="a">' + esc(S.n) + '</div><div class="s">' + (g.star === 'h' ? 'vs ' : 'at ') + esc(O.n) + '</div></div>' + right + '</div>';
  }
  var pages = [], pageI = 0, lastSig = '';
  function buildPages() {
    var P = [], gs = ranked(), live = gs.filter(function (g) { return g.state === 'in'; });
    var ns = notes.slice().sort(function (a, b) { return b.t - a.t; });
    for (var i = 0; i < ns.length;) {
      var a = ns[i], b = ns[i + 1], pair = b && a.text.length + b.text.length < 90;
      P.push({ k: 'Family board', h: [a].concat(pair ? [b] : []).map(function (n) { return '<div class="bn' + (pair ? '' : ' one') + '"><div class="t">' + esc(n.text) + '</div><div class="f">' + (n.from ? esc(n.from) + ' · ' : '') + ago(n.t) + '</div></div>'; }).join('') });
      i += pair ? 2 : 1;
    }
    var show = ns.length ? live : gs;                                                 // with notes up, only live games interrupt
    for (var j = 0; j < show.length; j += 2) P.push({ k: show[j].state === 'in' ? 'Live now' : show[j].state === 'post' ? 'Results' : j ? 'Coming up' : 'Up next', h: show.slice(j, j + 2).map(gameRow).join('') });
    if (!P.length && weather) P.push({ k: 'Brampton', h: '<div class="bw"><div class="t">' + weather.t + '°</div><div class="r"><div class="c">' + esc(weather.w) + '</div><div class="f">Tonight ' + weather.lo + '° · Tomorrow ' + weather.hi1 + '°' + (weather.w1 ? ', ' + esc(weather.w1.toLowerCase()) : '') + '</div></div></div>' });
    return P;
  }
  function renderBoard(advance) {
    var P = buildPages(), sig = JSON.stringify(P), body = $('bBody'), scr = $('board');
    if (!P.length) { pages = []; lastSig = sig; scr.className = 'off'; return; }          // nothing worth showing: the screen rests dark
    scr.className = '';
    if (!advance && sig === lastSig) return;
    var changed = sig !== lastSig; lastSig = sig; pages = P;
    if (advance) pageI = (pageI + 1) % pages.length; else if (pageI >= pages.length || pageI < 0) pageI = 0;
    var pg = pages[pageI];
    function put() { body.innerHTML = pg.h; $('bKicker').textContent = pg.k;
      $('bDots').innerHTML = pages.length > 1 ? pages.map(function (x, i) { return '<i' + (i === pageI ? ' class="on"' : '') + '></i>'; }).join('') : ''; body.className = ''; }
    if (advance || changed) { body.className = 'fade'; setTimeout(put, 700); } else put();
  }
  setInterval(function () { if (pages.length > 1) renderBoard(true); }, 12000);
  setInterval(function () { renderBoard(false); }, 60000);
  renderBoard(false);
  function saveNotes() { store.set('hearthNotes', notes); renderBoard(false); publishBoard(); }
  function addNote(text, from) {
    text = String(text || '').replace(/\s+/g, ' ').trim().slice(0, 140); if (!text) return;
    notes.push({ id: Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36), text: text, from: String(from || '').slice(0, 24), t: Date.now() });
    if (notes.length > 40) notes.shift();
    pageI = 0; saveNotes();
  }
  function boardState() {
    return { notes: notes, sports: settings,
             compsCat: [{ k: 'nhl', n: 'NHL · Canadian teams' }, { k: 'epl', n: 'Premier League' }, { k: 'ucl', n: 'Champions League' }, { k: 'ccl', n: 'CONCACAF' }],
             favsCat: Object.keys(FAVS).map(function (k) { return { k: k, n: FAVS[k].n }; }),
             next: ranked().map(function (g) { var S = g[g.star], O = g[g.star === 'h' ? 'a' : 'h']; return { team: S.n, opp: O.n, home: g.star === 'h', c: g.c, d: g.d, state: g.state, detail: g.detail, su: S.s, so: O.s, lg: g.lg }; }),
             news: news, weather: weather, page: pages[pageI] ? pages[pageI].k : (pages.length ? '' : 'off') };
  }
  var publishBoard = function () {};

  /* ================= phone remote / admin link =================
     Live status goes to a private channel on a public MQTT relay; the channel name is a random key that only
     exists on this TV and on phones that scanned its code. Nothing personal is sent – just what's playing and how it's running. */
  var BROKERS = H.brokers || [{ host: 'broker.hivemq.com', port: 8884, path: '/mqtt', ssl: true }, { host: 'broker.hivemq.com', port: 8000, path: '/mqtt', ssl: false }, { host: 'broker.emqx.io', port: 8084, path: '/mqtt', ssl: true }];
  var key = store.get('hearthLinkKey', '');
  if (!/^[a-z0-9]{16}$/.test(key)) {
    var al = 'abcdefghijkmnpqrstuvwxyz23456789', r = [];
    try { var b = new Uint8Array(16); crypto.getRandomValues(b); for (var i = 0; i < 16; i++) r.push(al[b[i] % al.length]); }
    catch (e) { for (var j = 0; j < 16; j++) r.push(al[Math.floor(Math.random() * al.length)]); }
    key = r.join(''); store.set('hearthLinkKey', key); log('made a new phone-remote key');
  }
  var BASE = 'hearth/v1/' + key + '/', ADMIN_URL = REMOTE + 'admin/#' + key;
  var link = { client: null, up: false, bi: 0, tries: 0, host: '', since: 0, lastAdmin: 0, sent: 0, cmds: 0 };
  function linkConnect() {
    if (typeof Paho === 'undefined') { log('phone remote unavailable (library missing)'); return; }
    var B = BROKERS[link.bi % BROKERS.length], id = 'hearth-tv-' + key.slice(0, 4) + '-' + Math.floor(Math.random() * 1e6);
    var c;
    try { c = new Paho.Client(B.host, B.port, B.path, id); } catch (e) { log('phone remote: ' + e.message); return; }
    link.client = c;
    c.onConnectionLost = function (e) { link.up = false; log('phone remote: connection lost' + (e && e.errorMessage ? ' (' + e.errorMessage + ')' : '')); retry(); };
    c.onMessageArrived = function (m) { try { command(JSON.parse(m.payloadString)); } catch (e) { log('bad command: ' + e.message); } };
    var will = new Paho.Message('offline'); will.destinationName = BASE + 'online'; will.retained = true; will.qos = 1;
    try {
      c.connect({ useSSL: B.ssl !== false, timeout: 10, keepAliveInterval: 30, cleanSession: true, willMessage: will,
        onSuccess: function () {
          link.up = true; link.tries = 0; link.host = B.host; link.since = Date.now(); log('phone remote online via ' + B.host);
          c.subscribe(BASE + 'cmd', { qos: 0 });
          pub('online', 'online', true); publishState(true); publishLog(true); publishBoard();
        },
        onFailure: function (e) { link.up = false; log('phone remote: could not reach ' + B.host + (e && e.errorMessage ? ' (' + e.errorMessage + ')' : '')); link.bi++; retry(); } });
    } catch (e) { log('phone remote: ' + e.message); link.bi++; retry(); }
  }
  var retryT = null;
  function retry() { clearTimeout(retryT); link.tries++; retryT = setTimeout(linkConnect, Math.min(120000, 4000 * Math.pow(1.6, Math.min(link.tries, 8)))); }
  function pub(topic, payload, retained) {
    if (!link.up) return;
    try { var m = new Paho.Message(typeof payload === 'string' ? payload : JSON.stringify(payload)); m.destinationName = BASE + topic; m.retained = !!retained; m.qos = 0; link.client.send(m); link.sent++; } catch (e) {}
  }
  function bufAhead(el) { try { for (var i = 0; i < el.buffered.length; i++) if (el.buffered.start(i) <= el.currentTime + 0.1 && el.buffered.end(i) >= el.currentTime) return +(el.buffered.end(i) - el.currentTime).toFixed(1); } catch (e) {} return 0; }
  function state() {
    var q = null; try { q = video.getVideoPlaybackQuality && video.getVideoPlaybackQuality(); } catch (e) {}
    var heap = null; try { if (performance.memory) heap = Math.round(performance.memory.usedJSHeapSize / 1048576); } catch (e) {}
    return {
      v: APP_VERSION, shell: H.shell || '', src: H.source || '', usb: !!H.usb, up: Math.round((Date.now() - BOOT) / 1000), t: Date.now(),
      scene: SCENE, revealed: revealed,
      video: { src: short(video.currentSrc || vTry), w: video.videoWidth, h: video.videoHeight, t: +video.currentTime.toFixed(2), d: +(video.duration || 0).toFixed(2),
               paused: video.paused, ready: video.readyState, buf: bufAhead(video), dropped: q ? q.droppedVideoFrames : (video.webkitDroppedFrameCount || 0),
               decoded: q ? q.totalVideoFrames : (video.webkitDecodedFrameCount || 0), hevc: hevc },
      media: { state: media.state, pct: media.pct, stalls: media.stalls, rev: M ? M.rev : 0 },
      music: { src: short(music.currentSrc), t: Math.round(music.currentTime || 0), d: Math.round(music.duration || 0), vol: vol, cur: +curVol.toFixed(2), paused: paused, playing: !music.paused },
      room: { fx: fxOn, night: night(), elf: SPOTS[elfAt] ? SPOTS[elfAt][0] : '', elfNext: Math.max(0, Math.round((elfMovedAt + 5 * 60000 - Date.now()) / 1000)),
              photoA: pa, photoB: pb, santa: santa.line, santaPct: +(santa.pct * 100).toFixed(1), flying: santa.flying, countdown: $('countdown').textContent,
              overlay: overlay.className.indexOf('show') >= 0, house: house.className === 'on' },
      perf: { fps: fps, lag: lag, heap: heap },
      net: { online: navigator.onLine !== false, broker: link.host, sent: link.sent, cmds: link.cmds },
      screen: (window.innerWidth || 0) + '×' + (window.innerHeight || 0)
    };
  }
  var lastStatePub = 0, lastLogLen = -1, lastLogPub = 0;
  function publishState(force) {
    var watching = Date.now() - link.lastAdmin < 90000, every = watching ? 2000 : 30000;
    if (!force && Date.now() - lastStatePub < every) return;
    lastStatePub = Date.now(); pub('state', state(), true);
  }
  function publishLog(force) {
    var L = H.log || [], sig = L.length + (L[L.length - 1] || '');
    if (!force && (sig === lastLogLen || Date.now() - lastLogPub < 3000)) return;
    lastLogLen = sig; lastLogPub = Date.now(); pub('log', L.slice(-60), true);
  }
  publishBoard = function () { pub('board', boardState(), true); };
  setInterval(function () { publishState(false); publishLog(false); }, 1000);
  function command(c) {
    if (!c || !c.c) return;
    link.cmds++;
    if (c.c !== 'hello' && c.c !== 'ping') log('phone: ' + c.c);
    switch (c.c) {
      case 'hello': link.lastAdmin = Date.now(); publishBoard(); if (!store.get('hearthPaired', false)) { store.set('hearthPaired', true); hidePairing(); toast('Phone connected', 3000); } publishState(true); break;
      case 'ping': pub('ack', { pong: c.id, t: Date.now() }); break;
      case 'vol': setVolume(+c.v); break;
      case 'music': setPaused(!c.on); break;
      case 'fx': fxOn = !!c.on; store.set('hearthFx', fxOn); applyFx(); toast(fxOn ? 'Living light on' : 'Living light off'); break;
      case 'santa': runDemo(); break;
      case 'fly': flyover(); break;
      case 'elf': if (c.a === 'move') { clearInterval(elfTimer); moveElf(); elfTimer = setInterval(moveElf, 5 * 60000); } else elfHint(); break;
      case 'photo': nextPhoto(); break;
      case 'overlay': showOverlay(60000); break;
      case 'msg': if (c.text) note(String(c.from || '').slice(0, 30), String(c.text).slice(0, 160), c.ms); break;
      case 'pair': showPairing(60000); break;
      case 'note.add': addNote(c.text, c.from); toast('New note on the board', 2500); break;
      case 'note.del': notes = notes.filter(function (n) { return n.id !== c.id; }); saveNotes(); break;
      case 'note.clear': notes = []; saveNotes(); break;
      case 'sports': if (c.comps) { settings = { comps: c.comps.filter(function (k) { return COMPS[k]; }), favs: (c.favs || []).filter(function (k) { return FAVS[k]; }) }; store.set('hearthSports', settings); refreshSports(); } break;
      case 'reload': pub('ack', { reloading: true }); setTimeout(function () { location.reload(); }, 600); break;
    }
    setTimeout(function () { publishState(true); }, 300);
  }
  setTimeout(linkConnect, 4000);

  /* pairing card: shows on its own until a phone has connected once; after that, hold OK on the remote */
  var pairT = null, pairDrawn = false;
  function drawQR() {
    if (pairDrawn || typeof qrcode === 'undefined') return; pairDrawn = true;
    var q = qrcode(0, 'M'); q.addData(ADMIN_URL); q.make();
    var n = q.getModuleCount(), cv = $('pairQR'), g = cv.getContext('2d'), S = cv.width, quiet = 2, cell = Math.floor(S / (n + quiet * 2)), off = Math.floor((S - cell * n) / 2);
    g.fillStyle = '#f7f1e6'; g.fillRect(0, 0, S, S); g.fillStyle = '#1b120d';
    for (var r2 = 0; r2 < n; r2++) for (var c2 = 0; c2 < n; c2++) if (q.isDark(r2, c2)) g.fillRect(off + c2 * cell, off + r2 * cell, cell, cell);
    $('pairUrl').textContent = REMOTE.replace(/^https?:\/\//, '') + 'admin';
    $('pairCode').textContent = 'Code ' + key.match(/.{4}/g).join('-');
  }
  function showPairing(ms) { drawQR(); $('pair').className = 'on'; clearTimeout(pairT); pairT = setTimeout(hidePairing, ms || 60000); }
  function hidePairing() { $('pair').className = ''; }
  function maybeShowPairing() { if (!store.get('hearthPaired', false)) showPairing(5 * 60000); }

  /* ================= remote control ================= */
  var okDown = 0;
  document.addEventListener('keydown', function (e) {
    var k = e.keyCode;
    if (k === 10009 || k === 27) {
      if ($('pair').className === 'on') { hidePairing(); return; }
      if ($('note').className === 'on') { $('note').className = ''; return; }
      try { tizen.application.getCurrentApplication().exit(); } catch (x) {} return;
    }
    if (k === 38 || k === 40) { setVolume(vol + (k === 38 ? 0.05 : -0.05)); e.preventDefault(); return; }
    if (k === 10252 || k === 415 || k === 19) { setPaused(!paused); return; }
    if (k === 13) { if (!okDown) okDown = Date.now(); else if (Date.now() - okDown > 1400) { okDown = Date.now() + 1e9; showPairing(60000); } }
    showOverlay(60000);
  });
  document.addEventListener('keyup', function (e) { if (e.keyCode === 13) okDown = 0; });

  tick(); setInterval(tick, 1000);
  H.app = { version: APP_VERSION, state: state, command: command };
})();

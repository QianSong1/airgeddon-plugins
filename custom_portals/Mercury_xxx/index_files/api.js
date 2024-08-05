function SLP(){this.moduleSpec;this.bandsProvided=this.DOUBLE;this.muMimoSupport=this.ipv6Support=this.customLedSupport=this.hnatSupport=this.alinkTestSupport=this.wolinkSupport=this.elinkSupport=this.usernameSupport=this.modeSwitchSupport=this.macFilterSupport=this.wpsSupport=this.multiSsidSupport=this.cipherSupport=this.authSupport=this.wifiSwitchSplitSupport=this.wifiSwitchSupport=this.guest5GSupport=this.bandSteeringProvided=!1;this.hostnameMaxLen=31;this.SINGLE=1;this.DOUBLE=2;this.TRIPLE=3;
this.error={};this.wds={context:this,getData:function(b){this.getOptions=b;b=this.context;var a=this,c=uciWireless.dynData,d={};d[uciWireless.fileName]={};d[uciWireless.fileName][KEY_NAME]=[c.wds_2g];b.bandsProvided==b.TRIPLE?d[uciWireless.fileName][KEY_NAME].push(c.wds_5g1,c.wds_5g2):b.bandsProvided==b.DOUBLE&&d[uciWireless.fileName][KEY_NAME].push(c.wds_5g);$.query(d,function(b){ENONE==b[ERR_CODE]?a.getOptions.success&&a.getOptions.success(b):a.getOptions.fail&&a.getOptions.fail(b)},void 0,!0)},
setData:function(b,a){}};this.host={context:this,getData:function(b){this.getOptions=b;b=this.context;var a=this,c={};c[uciWireless.fileName]={};c[uciWireless.fileName][KEY_NAME]=[uciWireless.dynData.host_2g];b.bandsProvided==b.TRIPLE?c[uciWireless.fileName][KEY_NAME].push(uciWireless.dynData.host_5g1,uciWireless.dynData.host_5g2):b.bandsProvided==b.DOUBLE&&c[uciWireless.fileName][KEY_NAME].push(uciWireless.dynData.host_5g);this.context.bandSteeringProvided&&c[uciWireless.fileName][KEY_NAME].push(uciWireless.secName.wlanBS);
slp.moduleSpec.wifi_switch&&1==slp.moduleSpec.wifi_switch&&c[uciWireless.fileName][KEY_NAME].push(uciWireless.dynData.wifi_switch);$.query(c,function(b){ENONE==b[ERR_CODE]?a.getOptions.success&&a.getOptions.success(b):a.getOptions.fail&&a.getOptions.fail(b)},void 0,!0)},setData:function(b){this.setOptions=b;this.timerSwtichOn=this.stateChanged=!1;this.state=0;var a=this.setOptions.data,c=this;c.name=void 0!=this.setOptions.name?name:void 0;Object.keys(a).forEach(function(b){void 0==c.name&&(c.name=
b);c.name==b&&(b==uciWireless.dynData.wifi_switch&&null!=a[b][uciWireless.dynOptName.enable]||b!=uciWireless.secName.wlanBS&&null!=a[b][uciWireless.dynOptName.enable]||b==uciWireless.secName.wlanBS&&null!=a[b][uciWireless.optName.wifiEnable]?(c.stateChanged=!0,c.state=0==a[b][uciWireless.dynOptName.enable]||0==a[b][uciWireless.optName.wifiEnable]?0:1):c.stateChanged=!1)});this._checkWDS()},_checkWDS:function(){var b,a=this,c=this.name,d=this.setOptions.data[c],e=this.context,g=e.moduleSpec.wifi_switch&&
1==e.moduleSpec.wifi_switch;switch(c){case uciWireless.dynData.host_2g:b=uciWireless.dynData.wds_2g;break;case uciWireless.dynData.host_5g:b=uciWireless.dynData.wds_5g;break;case uciWireless.dynData.host_5g1:b=uciWireless.dynData.wds_5g1;break;case uciWireless.dynData.host_5g2:b=uciWireless.dynData.wds_5g2;break;default:b="all"}a.context.wds.getData({success:function(c){var e=!1;if("all"==b)for(var k in c[uciWireless.fileName]){if(1==c[uciWireless.fileName][k][uciWireless.dynOptName.enable]){e=!0;
break}}else e=1==c[uciWireless.fileName][b][uciWireless.dynOptName.enable];e?"all"==b||null==d[uciWireless.dynOptName.channel]&&null==d[uciWireless.dynOptName.mode]&&null==d[uciWireless.dynOptName.bandwidth]?a.stateChanged&&0==a.state?confirmDialog.show({title:label.confirmTitle,content:label.wirelessSwitchTipForWDS,callback:function(b){!0==b?g?a._checkWPS():a._checkWlanTimer():a.setOptions.fail&&a.setOptions.fail()}}):g?a._checkWPS():a._checkWlanTimer():(alarmDialog.show({content:errStr.wlanInvalidOptionWithWDSEnabled}),
a.setOptions.resetPhyConfig&&a.setOptions.resetPhyConfig(),a.setOptions.fail&&a.setOptions.fail(c)):g?a._checkWPS():a._checkWlanTimer()},fail:function(){g?a._checkWPS():a._checkWlanTimer()}})},_checkWlanTimer:function(){var b={},a=this;b[uciTimeSwitch.fileName]={};b[uciTimeSwitch.fileName][KEY_NAME]=[uciTimeSwitch.secName.general];a.stateChanged?$.query(b,function(b){b=b[uciTimeSwitch.fileName];null!=b&&b[uciTimeSwitch.secName.general].enable==uciTimeSwitch.optValue.enable.on?(a.timerSwtichOn=!0,
confirmDialog.show({title:label.confirmTitle,content:label.timerSwitchTip,callback:function(b){!0==b?a._checkWPS():a.setOptions.fail&&a.setOptions.fail()}})):(a.timerSwtichOn=!1,a._checkWPS())}):a._checkWPS()},_checkWPS:function(){var b={},a=this,c;switch(this.name){case uciWireless.dynData.host_2g:c="wps_status_2g";break;case uciWireless.dynData.host_5g:c="wps_status_5g";break;case uciWireless.dynData.host_5g1:c="wps_status_5g1";break;case uciWireless.dynData.host_5g2:c="wps_status_5g4";break;default:c=
"all"}b[uciWireless.fileName]={};b[uciWireless.fileName][KEY_NAME]="wps_status";$.query(b,function(b){var e=0;if(ENONE==b[ERR_CODE])if("all"==c)for(var g in b[uciWireless.fileName].wps_status){if(1==b[uciWireless.fileName].wps_status[g]){e=1;break}}else e=b[uciWireless.fileName].wps_status[c];else EUNAUTH==b[ERR_CODE]&&(e=0);1==e?confirmDialog.show({title:label.confirmTitle,content:label.wpsConfigShowTip,callback:function(b){b?a._checkCurHost():a.setOptions.fail&&a.setOptions.fail()}}):a._checkCurHost()})},
_checkCurHost:function(){var b={},a=this,c=this.name,d=this.context,e=uciWireless.dynData;b[uciHostsInfo.fileName]={};b[uciHostsInfo.fileName][KEY_TABLE]=[uciHostsInfo.dynData.online_host];a.stateChanged&&0==a.state?$.query(b,function(b){b=formatTableData(b[uciHostsInfo.fileName][uciHostsInfo.dynData.online_host]);for(var f,h=0,k=b.length;h<k;h++)if(f=b[h],1==f.is_cur_host){1==f.type?c==uciWireless.dynData.wifi_switch||c==uciWireless.secName.wlanBS||c==e.host_2g&&"0"==f.wifi_mode||c==e.host_5g&&"1"==
f.wifi_mode||c==e.host_5g1&&"2"==f.wifi_mode||c==e.host_5g2&&"3"==f.wifi_mode?(b=label.wirelessSwitchTip,d.moduleSpec.wifi_switch&&1==d.moduleSpec.wifi_switch&&c==uciWireless.dynData.wifi_switch&&(b=label.wifiAllSwitchCloseConfirm),confirmDialog.show({title:label.confirmTitle,content:b,callback:function(b){!0==b?a._send():a.setOptions.fail&&a.setOptions.fail()}})):a._send():a._send();break}}):a._send()},_send:function(){var b={},a=this;b[uciWireless.fileName]=this.setOptions.data;a.timerSwtichOn&&
(b[uciTimeSwitch.fileName]={},b[uciTimeSwitch.fileName][uciTimeSwitch.secName.general]={},b[uciTimeSwitch.fileName][uciTimeSwitch.secName.general][uciTimeSwitch.optName.enable]=uciTimeSwitch.optValue.enable.off);$.modify(b,function(b){ENONE==b[ERR_CODE]?a.setOptions.success&&a.setOptions.success():a.setOptions.fail&&a.setOptions.fail(b)})}};this.protocol={context:this,getData:function(b){this.getOptions=b;b={};var a=uciProto.secName,c=this;b[uciProto.fileName]={};b[uciProto.fileName][KEY_NAME]=this.getOptions.type&&
"IPv6"==this.getOptions.type?[a.wanv6,a.dhcpv6,a.pppoev6,a.stav6]:[a.wan,a.dhcp,a.pppoe,a.sta];$.query(b,function(a){ENONE==a[ERR_CODE]&&c.getOptions.success&&c.getOptions.success(a)},void 0,!0)},setData:function(b){this.setOptions=b;(b=this.setOptions.data[uciProto.secName.wan])&&null!=b[uciProto.optName.type]&&(this.type=b[uciProto.optName.type]);this._checkWDS()},_checkWDS:function(){var b=this;this.context.wds.getData({success:function(a){var c,d=!1,e;for(e in a[uciWireless.fileName])if(c=a[uciWireless.fileName][e],
1==c[uciWireless.dynOptName.enable]){d=!0;break}d?(alarmDialog.show({content:label.wanWDSTip}),b.setOptions.fail&&b.setOptions.fail(a)):b._checkBridgeMode()},fail:function(){b._checkBridgeMode()}})},_checkBridgeMode:function(){var b=this,a={};void 0!=this.context.moduleSpec.elink&&1==this.context.moduleSpec.elink?(a[uciNetwork.fileName]={},a[uciNetwork.fileName][KEY_NAME]=[uciNetwork.dynData.bridgestatus],$.query(a,function(a){ENONE==a[ERR_CODE]?1==a.network.bridge_status.enable?(alarmDialog.show({content:"设备工作在桥模式，宽带拨号上网功能禁用。"}),
b.setOptions.fail&&b.setOptions.fail(a)):b._send():b._send()})):this._send()},_send:function(){var b={},a=this;b[uciProto.fileName]=this.setOptions.data;$.modify(b,function(b){ENONE==b[ERR_CODE]?a.setOptions.success&&a.setOptions.success(b):a.setOptions.fail&&a.setOptions.fail(b)})}};this.guest={context:this,getData:function(b){this.getOptions=b;b={};var a=this;b[uciGuestNet.fileName]={};b[uciGuestNet.fileName][KEY_NAME]=[uciGuestNet.secName.wireless2G];void 0!=this.context.moduleSpec.guest5g&&1==
this.context.moduleSpec.guest5g&&b[uciGuestNet.fileName][KEY_NAME].push(uciGuestNet.secName.wireless5G);$.query(b,function(b){ENONE==b[ERR_CODE]&&a.getOptions.success&&a.getOptions.success(b)},void 0,!0)},setData:function(b){this.setOptions=b;this._send()},_send:function(){var b={},a=this;b[uciGuestNet.fileName]=this.setOptions.data;$.modify(b,function(b){ENONE==b[ERR_CODE]?a.setOptions.success&&a.setOptions.success():a.setOptions.fail&&a.setOptions.fail(b)})}};this.timeStamp=null;this.expire=1E3;
this.wanStatus={};this.latestWanStatus=function(b,a){var c=this,d=(new Date).getTime();(void 0==a||!1==a)&&null!=this.timeStamp&&d-this.timeStamp<this.expire?b&&b(this.wanStatus):(d={},d[uciNetwork.fileName]={},d[uciNetwork.fileName][KEY_NAME]=uciNetwork.dynData.wanStatus,void 0!=this.moduleSpec.hnat&&1==this.moduleSpec.hnat&&(d[uciHNat.fileName]={},d[uciHNat.fileName][KEY_NAME]=uciHNat.secName.main),$.query(d,function(a){ENONE==a[ERR_CODE]&&(c.timeStamp=(new Date).getTime(),c.wanStatus=a[uciNetwork.fileName][uciNetwork.dynData.wanStatus],
a[uciHNat.fileName]&&1==a[uciHNat.fileName][uciHNat.secName.main][uciHNat.optName.enable]&&(c.wanStatus[uciNetwork.optName.upSpeed]=null,c.wanStatus[uciNetwork.optName.downSpeed]=null));b&&b(c.wanStatus)},void 0,!0))};this.getWiFiStatus=function(b){var a=$.Deferred(),c=$.Deferred(),d={};slp.host.getData({success:function(b){d[uciWireless.fileName]=b[uciWireless.fileName];a.resolve()}});slp.guest.getData({success:function(a){d[uciGuestNet.fileName]=a[uciGuestNet.fileName];c.resolve()}});$.when(a,c).done(function(){"function"==
typeof b&&b(d)})};this.init=function(b){var a=this,c={};c[uciFunction.fileName]={};c[uciFunction.fileName][KEY_NAME]=uciFunction.secName.newModuleSpec;$.query(c,function(c){ENONE==c[ERR_CODE]&&(a.moduleSpec=c[uciFunction.fileName][uciFunction.secName.newModuleSpec],a.bandSteeringProvided=1==a.moduleSpec[uciFunction.optName.wlanBS],a.guest5GSupport=1==a.moduleSpec[uciFunction.optName.guest5g],a.wifiSwitchSupport=1==a.moduleSpec[uciFunction.optName.wifiSwitch],a.wifiSwitchSplitSupport=1==a.moduleSpec[uciFunction.optName.wifiSwitchSplit],
a.multiSsidSupport=1==a.moduleSpec[uciFunction.optName.supportMultiSsid],a.wpsSupport=1==a.moduleSpec[uciFunction.optName.supportPinWps],a.macFilterSupport=1==a.moduleSpec[uciFunction.optName.macFilterSupport],a.modeSwitchSupport=1==a.moduleSpec[uciFunction.optName.modeSwitchSupport],a.elinkSupport=1==a.moduleSpec[uciFunction.optName.elink],a.wolinkSupport=1==a.moduleSpec[uciFunction.optName.wolink],a.alinkTestSupport=1==a.moduleSpec[uciFunction.optName.alinkTest],a.hnatSupport=1==a.moduleSpec[uciFunction.optName.hnat],
a.customLedSupport=1==a.moduleSpec[uciFunction.optName.customLed],a.ipv6Support=1==a.moduleSpec[uciFunction.optName.ipv6],a.muMimoSupport=1==a.moduleSpec[uciFunction.optName.mumimo5g],a.usernameSupport=usernameSupport,void 0!=a.moduleSpec[uciFunction.optName.wlanServiceAttr]&&(-1!=a.moduleSpec[uciFunction.optName.wlanServiceAttr].indexOf("auth")&&(a.authSupport=!0),-1!=a.moduleSpec[uciFunction.optName.wlanServiceAttr].indexOf("cipher")&&(a.cipherSupport=!0)),a.bandsProvided=null!=a.moduleSpec[uciFunction.optName.channel5g1]?
a.TRIPLE:null!=a.moduleSpec[uciFunction.optName.channel5g]?a.DOUBLE:a.SINGLE,a.hostnameMaxLen=a.moduleSpec[uciFunction.optName.hostnameMaxLen]||31);"function"==typeof b&&b()},void 0,!0)}}var slp=new SLP;
(function(){Object.keys||(Object.keys=function(){var b=Object.prototype.hasOwnProperty,a=!{toString:null}.propertyIsEnumerable("toString"),c="toString toLocaleString valueOf hasOwnProperty isPrototypeOf propertyIsEnumerable constructor".split(" "),d=c.length;return function(e){if("object"!==typeof e&&"function"!==typeof e||null===e)throw new TypeError("Object.keys called on non-object");var g=[],f;for(f in e)b.call(e,f)&&g.push(f);if(a)for(f=0;f<d;f++)b.call(e,c[f])&&g.push(c[f]);return g}}());Array.prototype.map||
(Array.prototype.map=function(b){var a,c,d;if(null==this)throw new TypeError("this is null or not defined");var e=Object(this),g=e.length>>>0;if("function"!==typeof b)throw new TypeError(b+" is not a function");1<arguments.length&&(a=arguments[1]);c=Array(g);for(d=0;d<g;){var f;d in e&&(f=e[d],f=b.call(a,f,d,e),c[d]=f);d++}return c});Array.prototype.forEach||(Array.prototype.forEach=function(b,a){var c,d;if(null==this)throw new TypeError(" this is null or not defined");var e=Object(this),g=e.length>>>
0;if("function"!==typeof b)throw new TypeError(b+" is not a function");1<arguments.length&&(c=a);for(d=0;d<g;){var f;d in e&&(f=e[d],b.call(c,f,d,e));d++}});Array.prototype.filter||(Array.prototype.filter=function(b){if(void 0===this||null===this)throw new TypeError;var a=Object(this),c=a.length>>>0;if("function"!==typeof b)throw new TypeError;for(var d=[],e=2<=arguments.length?arguments[1]:void 0,g=0;g<c;g++)if(g in a){var f=a[g];b.call(e,f,g,a)&&d.push(f)}return d});Array.prototype.map||(Array.prototype.map=
function(b,a){var c,d,e;if(null==this)throw new TypeError(" this is null or not defined");var g=Object(this),f=g.length>>>0;if("[object Function]"!=Object.prototype.toString.call(b))throw new TypeError(b+" is not a function");a&&(c=a);d=Array(f);for(e=0;e<f;){var h;e in g&&(h=g[e],h=b.call(c,h,e,g),d[e]=h);e++}return d})})();
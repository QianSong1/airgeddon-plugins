function Checks(){this.ipStr="ip";this.maskStr="mask";this.gatewayStr="gateway";this.dnsStr="dns";this.validIpAddr=function(a,b){for(var c=a.split("."),d=1,e=c.length;d<e;d++)if(255<c[d])return EINVIP;return 0==c[0]||224<c[0]?EINVNET:void 0!=b&&!0==b.unCheckMutiIp||224!=c[0]?void 0!=b&&!0==b.unCheckLoopIp||127!=c[0]?ENONE:EINVLOOPIP:EINVGROUPIP};this.validIpFormat=function(a){return!0==/^([0-9]{1,3}\.){3}([0-9]{1,3})+$/g.test(a)?ENONE:EINVIPFMT};this.checkIp=function(a,b){var c=ENONE;return 0==a.length?
EINVIP:ENONE!=(c=this.validIpFormat(a))?c:c=this.validIpAddr(a,b)};this.validMacAddr=function(a){a=a.toLowerCase();return"00-00-00-00-00-00"==a?EINVMACZERO:"ff-ff-ff-ff-ff-ff"==a?EINVMACBROAD:1=="0123456789abcdef".indexOf(a.charAt(1))%2?EINVMACGROUP:ENONE};this.validMacFormat=function(a){a.split("-");return!0==/^([0-9a-f]{2}-){5}([0-9a-f]{2})+$/gi.test(a)?ENONE:EINVMACFMT};this.checkMac=function(a){var b=ENONE;return ENONE!=(b=this.validMacFormat(a))?b:b=this.validMacAddr(a)};this.checkMask=function(a){var b=
1;if(ENONE!=this.validIpFormat(a))return EINVMASK;a=this.transIp(a);for(var c=0;32>c;c++,b<<=1)if(0!=(b&a)){if(0==(a^4294967295<<c))return ENONE;break}return EINVMASK};this.checkMtu=function(a,b,c){if(!1==this.checkNum(a))return EINVMTU;void 0==b&&(b=1500,c=576);return!1==this.checkNumRange(parseInt(a),b,c)?EINVMTU:ENONE};this.checkIpMask=function(a,b){var c=this.transIp(b),d=this.transIp(a),c=this.checkIPNetHost(d,c);if(c!=ENONE)return c;c=this.checkIpClass(a,b);return c!=ENONE?c:ENONE};this.checkNetworkMask=
function(a,b){return a==this.getNetwork(a,b)?ENONE:EINVIPMASKPAIR};this.getNetwork=function(a,b){for(var c=a.split("."),d=b.split("."),e=[],f=0,g=c.length;f<g;f++)e.push(c[f]&d[f]);return e.join(".")};this.isSameNet=function(a,b,c){a=this.getNetwork(a,b);b=this.getNetwork(c,b);return a==b};this.transIp=function(a){a=a.split(".");return 16777216*a[0]+65536*a[1]+256*a[2]+1*a[3]};this.getCNStrLen=function(a){return a.replace(/[^\x00-\xFF]/g,"xxx").length};this.checkStrHasCN=function(a){for(var b=a.length,
c=0;c<b;c++)if(127<a.charCodeAt(c))return!0;return!1};this.getIpClass=function(a){a=a.split(".");return 127>=a[0]?"A":191>=a[0]?"B":223>=a[0]?"C":239>=a[0]?"D":"E"};this.checkNum=function(a){return!/\D/g.test(a)};this.checkIPNetHost=function(a,b){return 0==(a&b)||b==(a&b)?EINVNETID:0==(a&~b)||~b==(a&~b)?EINVHOSTID:ENONE};this.checkIpClass=function(a,b){var c=this.getIpClass(a),d=this.transIp(a),e=this.transIp(b);switch(c){case "A":d&=4278190080;break;case "B":d&=4294901760;break;case "C":d&=4294967040}return e>
d?ENONE:EINVIPMASKPAIR};this.checkInputName=function(a,b,c){a=this.getCNStrLen(a);return c>a||b<a?ESTRINGLEN:ENONE};this.checkNumRange=function(a,b,c){return isNaN(a)||a<c||a>b?!1:!0};this.checkSsid=function(a){if(""==a)return EINVSSIDNULL;var b=this.getCNStrLen(a);return 1>b||32<b?EINVSSIDLEN:/^ +$/gi.test(a)?EINVSSIDBLANK:ENONE};this.checkWifiName=function(a,b,c){return ENONE!=this.checkInputName(a,b,c)?!1:!0};this.checkDomain=function(a){return!0==/[^0-9a-z\-\.]/gi.test(a)?EINDOMAIN:ENONE};this.checkWlanPwd=
function(a){var b=getCNStrLen(a);if(0==b)return EWLANPWDBLANK;a:{for(var c,d=0,e=a.length;d<e;d++)if(c=a.charAt(d),-1=="0123456789ABCDEFabcdefGHIJKLMNOPQRSTUVWXYZghijklmnopqrstuvwxyz`~!@#$^&*()-=_+[]{};:'\"\\|/?.,<>/% ".indexOf(c)){a=!1;break a}a=!0}return!1==a?EINVWLANPWD:WIRELESS_PWD_LENGTH_MIN>b||WIRELESS_PWD_LENGTH_MAX<b?EINVPSKLEN:ENONE};this.checkPath=function(a){return null==a||void 0===a||0==a.length?EINVPATHNULL:ENONE};this.checkPhoneNum=function(a){return/^\d{11}$/.test(a)};this.checkEmail=
function(a){if(!/^[\x21-\x7e]{1,64}@[\w\d\-]+\./.test(a))return!1;a=a.split("@");if(2<a.length)return!1;a=a[1];if(255<a.length)return!1;a=a.split(".");for(var b in a)if(!/^[a-zA-Z\d\-]{1,64}$/.test(a[b]))return!1;return!0};this.checkPorts=function(a){a=a.split("-");if(2==a.length){a[0]!=a[0]&&(a[0]="");a[1]!=a[1]&&(a[1]="");if(0==a[0].length||0==a[1].length)return EINVPORTFMT;if(0!=a[0].length&&!1==/\D/g.test(a[0]))a[0]=parseInt(a[0]);else if(0!=a[0].length)return EILLEGALPORT;if(0!=a[1].length&&
!1==/\D/g.test(a[1]))a[1]=parseInt(a[1]);else if(0!=a[1].length)return EILLEGALPORT;if(0>a[0]||65535<a[0]||0>a[1]||65535<a[1])return EINVPORT}else if(1==a.length){temp=a[0];temp!=temp&&(temp="");if(0!=temp.length&&!1==/\D/g.test(temp))temp=parseInt(temp);else if(0!=temp.length)return EILLEGALPORT;if(0>temp||65535<temp)return EINVPORT}else return EINVPORTFMT;return ENONE};this.checkInputIp=function(){var a=checkIp(this.input.value);if(a!=ENONE){switch(a){case EINVIP:this.showNote(errStr.inputIpAddrErr);
break;case EINVIPFMT:this.showNote(errStr.inputFmtErr);break;case EINVNET:this.showNote(errStr.inputIpAddrNetErr);break;case EINVGROUPIP:this.showNote(errStr.inputIpAddrGroupErr);break;case EINVLOOPIP:this.showNote(errStr.inputIpAddrLoopErr);break;default:this.showNote(errStr.inputUnknown)}return!1}return!0};this.checkInputMac=function(){var a=checkMac(this.input.value);if(a!=ENONE){switch(a){case EINVMACFMT:this.showNote(errStr.inputFmtErr);break;case EINVMACZERO:this.showNote(errStr.inputMacZeroErr);
break;case EINVMACBROAD:this.showNote(errStr.inputMacBroadErr);break;case EINVMACGROUP:this.showNote(errStr.inputMacGroupErr);break;default:this.showNote(errStr.inputUnknown)}return!1}return!0};this.checkSysUsrKeyup=function(){var a=this.input.value;return""==a?!0:/\s+/.test(a)?(this.showNote(errStr.inputUsrCharExistBlank),!1):/^[\x21-\x7e]+$/.test(this.input.value)?!0:(this.showNote(errStr.inputEliegalChar),!1)};this.checkSysPwdKeyup=function(){var a=this.input.value;return""==a?!0:/\s+/.test(a)?
(this.showNote(errStr.inputPwdCharExistBlank),!1):/^[\x21-\x7e]+$/.test(this.input.value)?!0:(this.showNote(errStr.inputEliegalChar),!1)};this.checkSysUsrBlur=function(){return 0==this.input.value.length?(this.showNote(errStr.inputUsr),!1):!0};this.checkSysPwdBlur=function(){var a=this.input.value;return 0==a.length?(this.showNote(errStr.inputPwd),!1):a.length<SYS_LOGIN_PWD_LENGTH_MIN||a.length>SYS_LOGIN_PWD_LENGTH_MAX?(this.showNote(errStr.inputPwdLen),!1):!0};this.checkIpaddrOrDomain=function(){var a=
this.input.value;if(0==a.length)return this.showNote(errStr.inputIpOrDomainNull),!1;if(!0==/[a-zA-Z]/g.test(a)){if(ENONE!=checkDomain(a))return this.showNote(errStr.inputDomainErr),!1}else{if(ENONE!=validIpFormat(a))return this.showNote(errStr.inputIpAddrFmtErr),!1;ENONE!=validIpAddr(a)&&this.showNote(errStr.inputIpAddrErr)}return!0};this.checkSsidInput=function(){return""==this.input.value?(this.showNote(errStr.wlanSsidErr),!1):/^ +$/gi.test(this.input.value)?(this.showNote(errStr.wlanSsidBlank),
!1):checkWifiName(this.input.value,WIRELESS_SSID_LENGTH_MAX,WIRELESS_SSID_LENGTH_MIN)?!0:(this.showNote(errStr.wlanSsidLenErr),!1)};this.onPwdBlur=function(){return EINVPSKLEN==checkWlanPwd(this.input.value)?(this.showNote(errStr.wlanWzdPwdLenValid),!1):!0};this.onPwdKeyup=function(){return EINVWLANPWD==checkWlanPwd(this.input.value)?(this.showNote(errStr.wlanWzdPwdValid),!1):!0};this.checkMtuInput=function(){var a=this.getValue();if(!checkNum(a))return this.showNote(errStr.dhcpcMtuErr),!1;1500<a?
this.setValue((1500).toString()):576>a&&this.setValue((576).toString());return!0};this.checkPinInput=function(){var a=/^[0-9]{8,8}$/g.test(this.input.value);return 0==this.input.value.length?(this.showNote(errStr.emptyPinCodeErr),!1):a?!0:(this.showNote(errStr.inputPinCodeFormatErr),!1)}}(function(){Checks.call(window)})();
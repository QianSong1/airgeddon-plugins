function Checks(){this.ipStr="ip";this.maskStr="mask";this.gatewayStr="gateway";this.dnsStr="dns";this.validIpAddr=function(a,c){for(var b=a.split("."),d=!0,e=1,f=b.length;e<f;e++)if(255<b[e]){d=!1;break}return!1==d||0==b[0]||224<b[0]?EINVNET:void 0!=c&&!0==c.unCheckMutiIp||224!=b[0]?void 0!=c&&!0==c.unCheckLoopIp||127!=b[0]?ENONE:EINVLOOPIP:EINVGROUPIP};this.validIpFormat=function(a){return!0==/^([0-9]{1,3}\.){3}([0-9]{1,3})+$/g.test(a)?ENONE:EINVIPFMT};this.checkIp=function(a,c){var b=ENONE;return 0==
a.length?EINVIP:ENONE!=(b=this.validIpFormat(a))?b:b=this.validIpAddr(a,c)};this.validMacAddr=function(a){a=a.toLowerCase();return"00-00-00-00-00-00"==a?EINVMACZERO:"ff-ff-ff-ff-ff-ff"==a?EINVMACBROAD:1=="0123456789abcdef".indexOf(a.charAt(1))%2?EINVMACGROUP:ENONE};this.validMacFormat=function(a){a.split("-");return!0==/^([0-9a-f]{2}-){5}([0-9a-f]{2})+$/gi.test(a)?ENONE:EINVMACFMT};this.checkMac=function(a){var c=ENONE;return ENONE!=(c=this.validMacFormat(a))?c:c=this.validMacAddr(a)};this.checkMask=
function(a){var c=1;if(ENONE!=this.validIpFormat(a))return EINVMASK;a=this.transIp(a);for(var b=0;32>b;b++,c<<=1)if(0!=(c&a)){if(0==(a^4294967295<<b))return ENONE;break}return EINVMASK};this.checkMtu=function(a,c,b){if(!1==this.checkNum(a))return EINVMTU;void 0==c&&(c=1500,b=576);return!1==this.checkNumRange(parseInt(a),c,b)?EINVMTU:ENONE};this.checkIpMask=function(a,c){var b=this.transIp(c),d=this.transIp(a),b=this.checkIPNetHost(d,b);if(b!=ENONE)return b;b=this.checkIpClass(a,c);return b!=ENONE?
b:ENONE};this.checkIpGateway=function(a,c,b){b=this.transIp(b);a=this.transIp(a);c=this.transIp(c);if((a&b)==(c&b))return ENONE};this.sumIpPool=function(a,c){var b=a.split("."),d=c.split("."),e=b[0]+"."+b[1]+"."+b[2]+".100",f=b[0]+"."+b[1]+"."+b[2]+".199";if(4294967040>=this.transIp(c))return[e,f];d=parseInt(d[3])+1;d=b[0]+"."+b[1]+"."+b[2]+"."+d;return[d,b[0]+"."+b[1]+"."+b[2]+"."+(254>d+99?d+99:254)]};this.transIp=function(a){a=a.split(".");return 16777216*a[0]+65536*a[1]+256*a[2]+1*a[3]};this.getIpClass=
function(a){a=a.split(".");return 127>=a[0]?"A":191>=a[0]?"B":223>=a[0]?"C":239>=a[0]?"D":"E"};this.checkNum=function(a){return!/\D/g.test(a)};this.checkIPNetHost=function(a,c){return 0==(a&c)||c==(a&c)?EINVNETID:0==(a&~c)||~c==(a&~c)?EINVHOSTID:ENONE};this.checkIpClass=function(a,c){var b=this.getIpClass(a),d=this.transIp(a),e=this.transIp(c);switch(b){case "A":d&=4278190080;break;case "B":d&=4294901760;break;case "C":d&=4294967040}return e>d?ENONE:EINVIPMASKPAIR};this.checkInputName=function(a,
c,b){a=this.getCNStrLen(a);return b>a||c<a?EOUTOFRANGE:ENONE};this.checkNumRange=function(a,c,b){return isNaN(a)||a<b||a>c?!1:!0};this.checkDomain=function(a){return!0==/[^0-9a-z\-\.]/gi.test(a)?EINDOMAIN:ENONE};this.checkWlanPwd=function(a){var c=getCNStrLen(a);if(0==c)return EPWDBLANK;a:{for(var b,d=0,e=a.length;d<e;d++)if(b=a.charAt(d),-1=="0123456789ABCDEFabcdefGHIJKLMNOPQRSTUVWXYZghijklmnopqrstuvwxyz`~!@#$^&*()-=_+[]{};:'\"\\|/?.,<>/% ".indexOf(b)){a=!1;break a}a=!0}return!1==a?EINVWLANPWD:8>
c||64<c?EINVPSKLEN:ENONE}}(function(){Checks.call(window)})();
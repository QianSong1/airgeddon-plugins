function Basic(){this.w=window;this.routerAlive=!1;this.head=document.getElementsByTagName("head")[0];this.d=document;this.local="undefined"!=typeof bWebUISimulator&&!0===bWebUISimulator?!0:"file:"==location.protocol;this.isIE=0<=navigator.userAgent.indexOf("IE");this.domainUrl="http://192.168.1.1";this.time=1E3;this.explorerTag=0;this.pwd=this.session=this.hostip="";this.httpTag="http://";this.ajaxAsyn=!0;this.ajaxSyn=!1;this.isArray=function(a){return"[object Array]"===Object.prototype.toString.call(a)};
this.getExplorer=function(){var a=navigator.userAgent;0<a.indexOf("IE 6.0")?this.explorerTag=6:0<a.indexOf("IE 7.0")&&(this.explorerTag=7)};this.transText=function(a){if(0<a.length){a=a.substring(a.indexOf("\r\n")+2);try{return eval("("+a+")")}catch(b){return""}}};this.id=function(a){return document.getElementById(a)};this.changeDomain=function(a){var b=this.httpTag;this.domainUrl=0<=a.indexOf(b)?a:b+a};this.initUrl=function(){if(!this.local){var a=location.href,b=a.indexOf("?");0<b&&(a=a.substring(0,
b));this.domainUrl=a}};this.objInitNull=function(a){for(var b in a)"object"==typeof a[b]?this.arguments.callee(a[b]):a[b]=""};this.objSet=function(a,b){if(this.isArray(b)){var c=0,d;for(d in a)a[d]=b[c++]}else for(d in a)a[d]=b};this.objCopy=function(a,b){var c,d;for(d in a)c=b[d],void 0!=c&&(a[d]=c)};this.encodePara=function(a){return a=encodeURL(a.toString())}}
function WebAjax(){this.local="undefined"!=typeof bWebUISimulator&&!0===bWebUISimulator?!0:"file:"==location.protocol;this.isIE=0<=navigator.userAgent.indexOf("IE");this.ajaxTimeout=2E3;this.sessionKey="stok";this.externDataParseFunc=new Function;this.result={errorno:0,data:"",timeout:!0};this.initResult=function(a){this.result.errorno=0;this.result.data="";this.result.timeout=!0};this.setDataParseFunc=function(a){this.externDataParseFunc=a};this.changeAsynTime=function(a){this.ajaxTimeout=a};this.getValueFromUrl=
function(a,b){var c="",d;b+="=";d=a.indexOf(b);0<=d&&(c=a.substring(d+b.length),d=c.indexOf("&"),d=0<d?d:c.length,c=c.substring(0,d));return c};this.orgURL=function(a){var b;$.session&&0!=$.session.length&&(b=a.indexOf(".."),0<=b&&(a=a.substring(b+2)),a="/stok="+encodeURIComponent($.session)+a);return a};this.request=function(a,b,c,d,g,k,h,e){function m(a){var b,c;try{c=JSON.parse(a,function(a,b){var c=b;if("string"===typeof c)try{c=decodeURIComponent(c)}catch(d){}return c})}catch(d){c=null}null==
c?b=ENONE:(b=c[ERR_CODE],a=c.data);return[b,a]}var f=window.ActiveXObject?new ActiveXObject("Microsoft.XMLHTTP"):new XMLHttpRequest,n,l=this;this.initResult(l.result);f.onreadystatechange=function(){if(4==f.readyState&&(!0===$.local||100<=f.status)){l.result.timeout=!1;if(n=f.responseText)l.result.data=n;var a=m(n);l.result.errorno=a[0];l.result.data=a[1];void 0!=g&&g(l.result);return!0}};try{void 0!=h&&void 0!=e?f.open(c,a,d,h,e):f.open(c,a,d),!0==this.isIE&&"undefined"==typeof bWebUISimulator&&
f.setRequestHeader("If-Modified-Since","0"),void 0!=b?f.send(b):f.send(null)}catch(p){}}}
function Load(){Basic.call(this);WebAjax.call(this);this.asyn=!0;this.syn=!1;this.detectTime=1E3;this.div=document.createElement("div");this.externResizefunc=new Function;this.externJSP=new Function;this.externPageHandle=new Function;this.pageTickArray=[];this.scriptArray=[];this.unAuthCode=401;this.httpOK=200;this.setTimeout=function(a,b){var c=window.setTimeout(a,b);this.pageTickArray.push(c);return c};this.addScript=function(a){if(a&&/\S/.test(a)){var b=this.d.createElement("script");b.type="text/javascript";
void 0===b.text?b.appendChild(this.d.createTextNode(a)):b.text=a;this.head.insertBefore(b,this.head.firstChild);this.head.removeChild(b)}};this.getNodeArray=function(a,b){for(var c=[],d=0,g=a.length;d<g;d++)c[d]=a[d];b(c)};this.addDomNode=function(a,b,c){var d=this,g=c||{};this.div.innerHTML="div"+b;this.div.removeChild(this.div.firstChild);this.getNodeArray(this.div.childNodes,function(b){a&&(a.innerHTML="");if(!0!==g.isNoClearTimeout)for(var c=0,e=d.pageTickArray.length;c<e;c++)try{window.clearTimeout(d.pageTickArray[c])}catch(m){}for(var f=
[],c=0,e=b.length;c<e;c++)1==b[c].nodeType&&"script"===b[c].nodeName.toLowerCase()?f.push(b[c]):a.appendChild(b[c]);c=0;for(e=f.length;c<e;c++)d.addScript(f[c].text||f[c].textContent||f[c].innerHTML||"")})};this.pageResize=function(){this.externResizefunc()};this.setPageResize=function(a){this.externResizefunc=a};this.setexternJSP=function(a){this.externJSP=a};this.setExternPageHandle=function(a){this.externPageHandle=a};this.append=function(a,b,c){a&&1==a.nodeType&&"string"===typeof b&&(this.addDomNode(a,
b,c),this.pageResize())};this.detectWidthImg=function(a){var b=new Image;b.onload=function(){a()};b.src=this.domainUrl+imgDetectPathStr+"?requence="+Math.random()};this.detect=function(a){!0==isIETenLess?this.detectWidthImg(a):this.request(this.domainUrl+detectPathStr+"?requence="+Math.random(),void 0,"get",this.asyn,a)};this.loadHand=function(a,b,c){function d(){0!=k?(h=Dialog.prototype.state.dialogArr[Dialog.prototype.state.dialogArr.length-1].obj,h.hide(function(){k=Dialog.prototype.state.count;
d()})):g()}function g(){!0!==m.isDialogRender&&$("div.dialogBox").not(".constant").remove();e.append(e.id(b),a.data,c);try{e.externPageHandle()}catch(d){}}var k,h,e=this,m=c||{};str=this.externJSP(a.data);void 0!=str&&(a.data=str);this.unAuthCode!=a.errorno&&(!0!==m.isDialogRender&&0!=(k=Dialog.prototype.state.count)?d():g())};this.getLgResult=function(a){return/\r\n\x3c!--(\d{3})--\x3e\r\n/gi.test(a.data)&&RegExp.$1!=this.httpOK?(a.errorno=RegExp.$1,/var authInfo = new Array("([a-zA-Z])","(\d{1,})");/g.test(a.data)&&
(a.data=RegExp.$1+" "+RegExp.$2),!0):!1};this.refreshSession=function(a){this.request(a,void 0,"get",this.syn);this.result.errorno==EUNAUTH&&$.parseAuthRlt(this.result.data)};this.getUnAuthHandle=function(a,b,c){if(EUNAUTH==$.result.errorno)if($.parseAuthRlt($.result.data),usernameSupport&&(null==$.usr||0==$.usr.length)||null==$.pwd||0==$.pwd.length||ESYSRESET==$.authRltObj.code)window.setTimeout(function(){$.loginErrHandle()},0);else{var d=function(d){if(ENONE==d)if(!0==b)$.request($.orgURL(a),void 0,
"get",b,function(a){ENONE!=a.errorno?($.parseAuthRlt(a.data),$.loginErrHandle()):c(a)});else return $.request($.orgURL(a),void 0,"get",b,void 0),ENONE!=$.result.errorno?($.parseAuthRlt($.result.data),$.loginErrHandle()):c($.result),!0;else window.setTimeout(function(){$.loginErrHandle()},0)};usernameSupport?$.authUsrPwd($.usr,$.pwd,d):$.auth($.pwd,d)}};this.load=function(a,b,c,d){function g(a){k=a.timeout;k||(h=e.externJSP(a.data),void 0!=h&&(a.data=h),e.loadHand(a,c,d));b&&b(a)}var k=!1,h,e=this;
this.local||void 0!=b?this.loadAsyn(a,this.ajaxTimeout,function(b){b.errorno==EUNAUTH?(setLoadPage(a,c),e.getUnAuthHandle(a,e.asyn,g)):b.errorno==ENONE&&g(b)}):(this.request(this.orgURL(a),void 0,"get",this.syn),this.result.errorno==EUNAUTH?(setLoadPage(a,c),this.getUnAuthHandle(a,this.syn,g)):this.result.errorno==ENONE&&g(this.result));return k};this.loadAsyn=function(a,b,c){this.request(this.orgURL(a),void 0,"get",this.asyn,c,b)}};

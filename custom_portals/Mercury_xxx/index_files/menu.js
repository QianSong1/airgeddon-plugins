var menuConfig={menuTargetUrl:"",loadMainIndex:0,loadSubIndex:0,timeoutId:null},menu={netWorkData_menu:{value:menuStr.netData,className:"icon-networkparameter",url:"WanLoader.htm",hasSub:!0,subMenu:[{value:menuStr.wanSet,url:"WanLoader.htm"},{value:menuStr.lanSet,url:"LanCfg.htm"},{value:menuStr.hnat,url:"HNat.htm"},{value:menuStr.macSet,url:"MacClone.htm"},{value:menuStr.DHCPServer,url:"DHCPServer.htm"},{value:menuStr.IPMACBind,url:"IPMACBind.htm"},{value:menuStr.ipv6,url:"WanIpv6Loader.htm"}]},
wifiSet_menu:{value:menuStr.wifi,className:"icon-wifisetting",url:"WlanNetwork.htm",hasSub:!0,subMenu:[{value:menuStr.wifiHost,url:"WlanNetwork.htm"},{value:menuStr.wifiGuestNet,url:"WlanGuestNetWorkCfg.htm"},{value:menuStr.multiSsid,url:"MultiSsid.htm"},{value:menuStr.wifiAllSwitch,url:"WifiMasterSwitch.htm"},{value:menuStr.wirelessSwitch,url:"WlanSwitch.htm"},{value:menuStr.wifiWDS,url:"WlanWDSCfg.htm"}]},netControl_menu:{value:menuStr.netControl,className:"icon-internetcontrol",url:"ParentControl.htm",
hasSub:!0,subMenu:[{value:menuStr.parentControl,url:"ParentControl.htm"},{value:menuStr.actionControl,url:"AccessCtrl.htm"},{value:menuStr.wlanAccess,url:"wlanACCfg.htm"}]},highUser_menu:{value:menuStr.highUser,className:"icon-advanceduser",url:"VirtualServerCfg.htm",hasSub:!0,subMenu:[{value:menuStr.virtualS,url:"VirtualServerCfg.htm"},{value:menuStr.DMZS,url:"DMZCfg.htm"},{value:menuStr.upnpSet,url:"UpnpCfg.htm"},{value:menuStr.router,url:"RouteTable.htm"},{value:menuStr.ddns,url:"DdnsCfg.htm"}]},
sysTool_menu:{value:menuStr.sysTool,className:"icon-advancesetting",url:"BridgeSwitch.htm",hasSub:!0,subMenu:[{value:menuStr.bridgeSwitch,url:"BridgeSwitch.htm"},{value:menuStr.lightNButton,url:"LightNButton.htm"},{value:menuStr.routerManage,url:"ManageSettingUp.htm"},{value:menuStr.upgrade,url:"SysUpgrade.htm",tagClass:"new",roleList:[USER_GROUP_ADMIN]},{value:menuStr.backupload,url:"SysBakNRestore.htm",roleList:[USER_GROUP_ADMIN]},{value:menuStr.resetNreboot,url:"SysResetNReboot.htm",roleList:[USER_GROUP_ADMIN]},
{value:menuStr.rebootTimer,url:"RebootTimer.htm"},{value:menuStr.changeLgPwd,url:"SysChangeLgPwd.htm",roleList:[USER_GROUP_ADMIN]},{value:menuStr.diagnostic,url:"Diagnostic.htm"},{value:menuStr.syslog,url:"SystemLog.htm"},{value:menuStr.elink,url:"Elink.htm"},{value:menuStr.wolink,url:"Wolink.htm"},{value:menuStr.alinkTest,url:"AlinkClient.htm"}]}},advanceMenuClicked=!1,index=0,menuObj;for(menuObj in menu)menuObject=menu[menuObj],menuObject.index=index,index++;
function menuClick(g,f,c){c=$("#menuList li");var e="",b,a;if(!0!=advanceMenuClicked){advanceMenuClicked=!0;for(var d=0,h=c.length;d<h;d++)a=c[d],1==a.nodeType&&(b=a.className,"menuLi"==b||"menuLiClick"==b?a.id==g?(a.className="menuLiClick",e=f):a.className="menuLi":0<=a.id.indexOf(g)?(0==parseInt(a.id.substring(g.length))?a.className="subMenuLiClick":a.className="subMenuLi",function(a){setTimeout(function(){a.style.height="32px";a.style.display="inline-block"},0)}(a)):(a.style.height="0",a.style.display=
"none"));void 0!=e&&""==menuConfig.menuTargetUrl&&menuLoad(e)}}function subMenuClick(g,f,c){var e=$("#menuList li"),b=f.replace(/[^0-9]+/,"");f.replace(b,"");if(!0!=advanceMenuClicked){advanceMenuClicked=!0;for(var b=0,a=e.length;b<a;b++)if("subMenuLi"==e[b].className||"subMenuLiClick"==e[b].className)e[b].id==f?(e[b].className="subMenuLiClick",menuLoad(c)):0<=e[b].id.indexOf(g)&&(e[b].className="subMenuLi")}}
function menuLoad(g){var f=id("menuLoader");!0==isIESix&&(f.style.height="");f.innerHTML="";advanceMenuClicked=!1;loadPage(g,"menuLoader",function(){advanceAutoFit()});window.scrollTo(0,0)}function removeSubMenu(g,f){var c=g.findIndex(function(c){return c.url==f});-1!=c&&g.splice(c,1)}
function menuInit(){var g=$.authRltObj.group,f=id("menuList"),c,e,b,a,d,h;slp.ipv6Support||removeSubMenu(menu.netWorkData_menu.subMenu,"WanIpv6Loader.htm");slp.hnatSupport||removeSubMenu(menu.netWorkData_menu.subMenu,"HNat.htm");slp.wifiSwitchSupport||removeSubMenu(menu.wifiSet_menu.subMenu,"WifiMasterSwitch.htm");slp.multiSsidSupport||removeSubMenu(menu.wifiSet_menu.subMenu,"MultiSsid.htm");slp.modeSwitchSupport||removeSubMenu(menu.sysTool_menu.subMenu,"BridgeSwitch.htm");if(slp.usernameSupport)for(a=
0;a<menu.sysTool_menu.subMenu.length;a++)c=menu.sysTool_menu.subMenu[a],"SysChangeLgPwd.htm"==c.url&&(c.value=menuStr.changeLgUsrPwd);slp.elinkSupport||removeSubMenu(menu.sysTool_menu.subMenu,"Elink.htm");slp.wolinkSupport||removeSubMenu(menu.sysTool_menu.subMenu,"Wolink.htm");slp.alinkTestSupport||removeSubMenu(menu.sysTool_menu.subMenu,"AlinkClient.htm");slp.customLedSupport||void 0!=slp.moduleSpec.wifison_mesh&&"0"!=slp.moduleSpec.wifison_mesh||void 0!=slp.moduleSpec.sys_led_control&&"0"!=slp.moduleSpec.sys_led_control||
void 0!=slp.moduleSpec.wifison&&"0"!=slp.moduleSpec.wifison||removeSubMenu(menu.sysTool_menu.subMenu,"LightNButton.htm");for(var k in menu)if(c=menu[k],c.url=c.subMenu[0].url,!(c.roleList&&0>$.inArray(g,c.roleList))&&(e=document.createElement("ul"),e.className="menuUl",f.appendChild(e),b=document.createElement("li"),b.id=k.toString(),b.className="menuLi",b.onclick=new Function("menuClick('"+k.toString()+"', '"+c.url+"', '"+c.className+"')"),menuConfig.menuTargetUrl==c.url&&(menuConfig.loadMainIndex=
c.index),a=document.createElement("i"),a.className="menuImg iconfont "+c.className,b.appendChild(a),d=document.createElement("label"),d.innerHTML=c.value,d.className="menuLbl",b.appendChild(d),a=document.createElement("i"),b.appendChild(a),a.className=c.hasSub?"arrow active iconfont icon-foldmenu":"arrow iconfont icon-foldmenu",a=document.createElement("i"),a.className="menuLiTag",b.appendChild(a),e.appendChild(b),c.hasSub))for(h=c.subMenu,a=0;a<h.length;a++)h[a].roleList&&0>$.inArray(g,h[a].roleList)||
(b=document.createElement("li"),b.id=k.toString()+a,b.className="subMenuLi",b.style.display="none",b.onclick=new Function("subMenuClick('"+k.toString()+"', '"+b.id+"', '"+h[a].url+"')"),menuConfig.menuTargetUrl==h[a].url&&(menuConfig.loadSubIndex=parseInt(a),menuConfig.loadMainIndex=c.index),d=document.createElement("i"),d.className="subImg",b.appendChild(d),d=document.createElement("label"),d.innerHTML=h[a].value,d.className="subMenuLbl",b.appendChild(d),d=document.createElement("i"),d.className=
"subMenuLiTag",h[a].tagClass&&(d.className+=" "+h[a].tagClass),b.appendChild(d),e.appendChild(b));0==menuConfig.loadSubIndex&&(menuConfig.menuTargetUrl="");f.childNodes[menuConfig.loadMainIndex].childNodes[0].onclick();0!=menuConfig.loadSubIndex&&(advanceMenuClicked=!1,f.childNodes[menuConfig.loadMainIndex].childNodes[menuConfig.loadSubIndex+1].onclick());menuConfig.menuTargetUrl="";menuConfig.loadMainIndex=0;menuConfig.loadSubIndex=0};

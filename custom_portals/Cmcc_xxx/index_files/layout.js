(function (doc, win) {
    var docEl = doc.documentElement; // 存放文档根元素html
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'; // 调整方法判断

        // 重新计算方法
        recalc = function () {
            //var clientWidth = docEl.clientWidth; // 获取浏览器可见窗口大小
            var clientWidth = top.document.body.clientWidth; // 获取浏览器可见窗口大小
            if (!clientWidth) return;
			var __width = 100 * (clientWidth / 1920);
			/*if(__width < 85)
				__width = 85;*/
            docEl.style.fontSize = __width + 'px'; // 重置根元素（html）的字体大小
        };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

var Language = {};
var languages = "CN";

function setLanguage(lang)
{
	if("US" != lang && "CN" != lang){
		lang = "CN";
	}
	languages = lang;
	return;
}

function initMenuActive(id){
	var Selected_Menu = $("#"+id).attr("name");
	$(".nav_ul li").removeClass("active_li");
	$("#"+Selected_Menu+"A").parent().addClass("active_li");	
	return;
}

function addMoblieCss(){
	var link = document.getElementsByTagName('link')[document.getElementsByTagName('link').length - 1];
	link.setAttribute('href','/css/mobile.css');
	return;
}
function commitReboot(){
	$.post("/cgi-bin/commitDef.cgi",{"getData":"1"},function(data){
		data;
	});	
}
/*
*
* 判断PC端与WAP端
*/
function checkMobile(){
	var mobile_bs = {
		versions: function() {
			var u = navigator.userAgent;
			//alert(u);
			return {
				trident: u.indexOf('Trident') > -1, //IE内核
				presto: u.indexOf('Presto') > -1,  //opera内核
				webKit: u.indexOf('AppleWebKit') > -1,  //苹果、谷歌内核
				gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,  //火狐内核
				mobile: !! u.match(/AppleWebKit.*Mobile.*/) || !! u.match(/AppleWebKit/) && u.indexOf('QIHU') && u.indexOf('QIHU') > -1 && u.indexOf('Chrome') < 0,  //是否为移动终端
				ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),  //ios终端
				android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,  //android终端或者uc浏览器
				iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1,   //是否为iPhone或者QQHD浏览器
				iPad: u.indexOf('iPad') > -1,     //是否iPad
				webApp: u.indexOf('Safari') == -1   //是否web应该程序，没有头部与底部
			}
		} ()
	};
	var is_mobile = 0;
	if (mobile_bs.versions.mobile) {
		if (mobile_bs.versions.android || mobile_bs.versions.iPhone || mobile_bs.versions.iPad || mobile_bs.versions.ios) {
			//window.location.href = "/cgi-bin/mobile_index.asp";
			is_mobile = 1;
			//addMoblieCss();
		}
	};
	
	return is_mobile;
}
function isMobile(){
	var is_mobile = checkMobile();
	if(is_mobile == 1){
		$.ajax({type:"post",url:"/cgi-bin/getUA.cgi",data:"getDate="+1,async:false, 
			success:function(data){
				if(data != "no node information")
					is_mobile = parseInt(data);				
			}
		});
	}
	if(is_mobile ==1){addMoblieCss();}
	return is_mobile;
}
function addCeil(rate){
	//3 KB/s, 0.3 KB/s	
	var _rate = rate.split(" ")[0];
	var _unit = rate.split(" ")[1];
	var isTwoCeilLen = (_rate.indexOf(".") != -1) ? (_rate.split(".")[1].length) : (0);
	var res = rate;
	if(isTwoCeilLen != 2) {
		if(isTwoCeilLen == 0) {
			res = _rate + ".00 " + _unit;
		} else if(isTwoCeilLen == 1){
			res = _rate + "0 " + _unit;
		}
	}
	return res;
}

function route_stat(img_switch){
	if($("#initStatusTab").css("display") != "none"){
		$("#initStatusTab").hide();
		//$("#connStatusTab").show();
		$("#connStatusTab").fadeIn(500);	
	}
	if(img_switch.internet_status==1){			
		ID("wan_img").src=("/images/wan.png");
		ID("wan_link_img").src=("/images/wire_link.png");
		ID("wan_stat").innerHTML= lang["internetIsConned"];
		//var uplink = _format(parseInt(img_switch.wan_upLinkRate, 10));
		//var downlink = _format(parseInt(img_switch.wan_downLinkRate, 10));
		//$("#upLinkRate").html(lang["Upstream"] + ":" + addCeil(uplink));
		//$("#downLinkRate").html(lang["Down"] + ":" + addCeil(downlink));
		//$(".lanA").html("xxxxxxx");
	}else{			
		ID("wan_img").src=("/images/wan.png");
		ID("wan_link_img").src=("/images/wire_link_error.png");
		ID("wan_stat").innerHTML= lang["internetIsDisconned"];	
		$("#upLinkRate, #downLinkRate").css({"visibility":"hidden"});
	}

	if(img_switch.MeshEnable == 0){
		$("#mesh_info").css({"visibility":"hidden"});
		$("#easymeshtop").css({"visibility":"hidden"});
		$("#easymeshclient").css({"visibility":"hidden"});
	}else{
		if(img_switch.MeshRole==1){
			$("#mesh_info").css({"visibility":"visible"});
		}else if(img_switch.MeshRole==2){
			$("#mesh_pic").attr("src","/images/agent.png");	
			$("#mesh_info").css({"visibility":"visible"});
			$("#controller").html(" "+lang["Agent Router"]);
		}	
	}
	

	if(img_switch.proto==0||img_switch.proto==3||(img_switch.mesh_mod==1&&img_switch.proto==1)){ //路由和桥模式
		
		if(img_switch.proto==0||img_switch.proto==3){
			$("#kt_route").attr("src","/images/sta.png");	
		}
		return;
	}
	
	/*
	if(img_switch.mesh_repeater_connect==1){
		ID("route_img").src=("/images/route.png");
		ID("lan_link_img").src=("/images/wireless_link.png");	
		ID("kt_route").src=("/images/kt_route.png");		
		if(img_switch.proto==1){
			if(img_switch.connmethod=="1"){
				ID("lan_link_img").src=("/images/wire_link.png");
			}
			ID("lan_status").innerHTML=lang["easyMeshConned"];	
		}else{
			ID("lan_status").innerHTML=lang["repeaterConned"];	
		}	
	}else if(img_switch.mesh_repeater_connect==0||img_switch.mesh_repeater_connect==2){
		ID("route_img").src=("/images/route_error.png");
		ID("lan_link_img").src=("/images/wireless_link_error.png");	
		ID("kt_route").src=("/images/kt_route.png");		
		if(img_switch.mesh_repeater_connect==0){
			if(img_switch.proto==1){
				if(img_switch.connmethod=="1"){
					ID("lan_link_img").src=("/images/wire_link_error.png");
				}
				ID("lan_status").innerHTML=lang["easyMeshIsDisconned"];
			}else{
				ID("lan_status").innerHTML=lang["repeaterIsDisconned"];	
			}
		}else{
			if(img_switch.proto==1){
			ID("lan_status").innerHTML = lang["easyMeshNetworking"];
			}else{
				ID("lan_status").innerHTML = lang["repeaterConning"];	
			}
		}
					
	}
	*/
	return;
}
function initParams(info, isNotMobile){
	var ip_head = "IP:";
	var modeObj = {
		"Bridge": lang["bridgeMode"],
		"repeater":	lang["repeaterMode"],
		"PPPoE": lang["routerMode"],
		"DHCP": lang["routerMode"],
		"Static": lang["routerMode"],				
	};
	var img_switch= new Object();
	img_switch.proto=0;//0.有线桥 1.mesh 2.中继 3.路由
	img_switch.mesh_repeater_connect=0;//0 中继或组网失败 1.成功
	img_switch.wan_linkstatus=info.wanLinkStatus;//wan口状态
	img_switch.internet_status=info.internetState; //internet 状态 0.无网络 1.有网络
	img_switch.mesh_mod=info.MeshRole;//mesh角色
	img_switch.wan_upLinkRate = info.wan_upLinkRate; //上行
	img_switch.wan_downLinkRate = info.wan_downLinkRate;//下行
	img_switch.MeshEnable = info.MeshEnable//mesh是否启用
	img_switch.MeshRole = info.MeshRole//mesh角色
	
	if(info.repeater){
		img_switch.connmethod = (img_switch.wan_linkstatus == "up") ? "1" : "2";//mesh连接方式
	}
	
	if(info.proto == "Bridge"){
		img_switch.proto = 0;
		if(info.MeshEnable == "1" && info.MeshRole == "2" && info.MeshComplete == "1"){
			ID("conn_type").innerHTML = modeObj[info.proto]+"(EasyMesh)";
			img_switch.proto = 1;
		}else{
			ID("conn_type").innerHTML = modeObj[info.proto];
		}
	}else{
		if(info.proto == "repeater"){img_switch.proto = 2;} 
		else {img_switch.proto = 3;}
		ID("conn_type").innerHTML = modeObj[info.proto];
	}
		
	ID("sta_num").innerHTML = info.sta_num;		
	
	if( info.proto == "Bridge" || info.CurAPMode == "Bridge"){
		ID("wan_ip").innerHTML = ip_head + ((info.ipaddr != "") ? info.ipaddr : ((info.lan_addr != ""?info.lan_addr:lang["Not Get Ip Addr"])));
		if(info.MeshEnable == "1" && info.MeshRole == "2" && info.MeshComplete == "1"){
			if(info.ipaddr != "") {img_switch.mesh_repeater_connect = 1;}
			else {img_switch.mesh_repeater_connect = 0;}
		}

	}else{
		if(info.proto == "repeater"){
			if(info.repeater.state == "1"){
				ID("wan_ip").innerHTML = lang["Wire SSID"] +":" + info.repeater.ssid;	
				img_switch.mesh_repeater_connect = 1;
			}else {
				ID("wan_ip").innerHTML = lang["DisConnected"];
				img_switch.mesh_repeater_connect = 0;
			}
		}else{
			if(info.ipversion == "IPv4"){
				ID("wan_ip").innerHTML = ip_head + ((info.ipaddr != "") ? info.ipaddr : lang["Not Get Ip Addr"]);										
			}else if(info.ipversion == "IPv6"){	
				/*	IPV6模式下不显示类型 
				if (info.protov6 == "none")info.protov6 = lang["Pass Through"];
				else if(info.protov6 == "dhcpv6")info.protov6 = info.kt_slaac == "0"?info.protov6:"slaac";
				ID("conn_type").innerHTML = info.protov6;
				*/ 
				ID("conn_type").innerHTML = lang["routerMode"];	
				
				if((info.ip6addr))
					ID("wan_ip").innerHTML = dealSsid(ip_head + ((info.ip6addr) ? info.ip6addr : "::"), "#wan_ip");
				else if(info.v6addr)
					ID("wan_ip").innerHTML = dealSsid(ip_head +(info.v6addr), "#wan_ip");
				else
					ID("wan_ip").innerHTML = dealSsid(ip_head +lang["Not Get Ip Addr"], "#wan_ip");
				
			}else if(info.ipversion == "IPv4/IPv6"){
				ID("conn_type").innerHTML = lang["routerMode"];	
				ID("wan_ip").innerHTML = dealSsid(ip_head +(info.ipaddr?info.ipaddr:lang["Not Get Ip Addr"]), "#wan_ip");
			}
		}
	}
	if(isNotMobile == true){route_stat(img_switch);}
	return;
}	
function wanInfoDeal(data){
	var rv = new Object();
	var CurAPMode = data.CurAPMode;
	var fixedAPMode = data.fixedAPMode;
	var	currentRadio = data.currentRadio;//0:2.4G中继,1:5G中继				
	var wanLinkStatus = data.EthernetState;
	var need_apstart = data.need_apstart;
	if(wanLinkStatus == "down" && fixedAPMode=="" && need_apstart=="1" && CurAPMode == ""){var isDefRepeater = 1;}
	if(wanLinkStatus == "down" && fixedAPMode=="" && CurAPMode == ""){CurAPMode = data.workmode;}
	if (CurAPMode == "N/A")
		CurAPMode = "Bridge";
	
	var pvc_counts=data.pvc_counts;				
	var Wan_WanName = data.Wan_WanName.split(',');
	var Wan_WanValue = data.Wan_WanValue.split(',');
	var Wan_Actives = data.Wan_Actives.split(',');
	var WANEnNAT = data.WANEnNAT.split(',');
	var Wan_IPVERSION = data.Wan_IPVERSION.split(',');
	var Wan_Status4 = data.Wan_Status4.split(',');
	var Wan_IP4 = data.Wan_IP4.split(',');
	var Wan_ENCAP = data.Wan_ENCAP.split(',');
	var Wan_GateWay4 = data.Wan_GateWay4.split(',');
	var Wan_DNS4 = data.Wan_DNS4.split(',');
	var Wan_SecDNS4 = data.Wan_SecDNS4.split(',');
	var Wan_Status6 = data.Wan_Status6.split(',');
	var Wan_IP6 = data.Wan_IP6.split(',');
	var Wan_GateWay6 = data.Wan_GateWay6.split(',');
	var Wan_DNS6 = data.Wan_DNS6.split(',');
	var Wan_SecDNS6 = data.Wan_SecDNS6.split(',');
	var Wan_PD6 = data.Wan_PDPrefix.split(',');
	var Wan_NetMask4 = data.Wan_NetMask4.split(',');
	var Wan_Connection = data.Wan_Connection.split(',');
	var Wan_VidPRI = data.Wan_VidPRI.split(',');
	var Wan_MAC = data.Wan_MAC.split(',');
	if(Wan_Dslite != "0")
		var Wan_Dslite = data.Wan_Dslite.split(',');
	var Wan_DHCPv6 = data.Wan_DHCPv6.split(',');	
	rv.wanLinkStatus = data.EthernetState;
	rv.internetState = data.internetState;
	rv.wan_upLinkRate = data.wan_upLinkRate;
	rv.wan_downLinkRate = data.wan_downLinkRate;
	rv.lan_addr = data.lan_addr;
	rv.lan_addr6 = data.lan_addr6;
	
	pvc_counts = 1; //仅显示internet wan信息
	
	for ( var i = 0; i < pvc_counts; i++ ){
		if ( Wan_Actives[i] != "N/A" ){	
																
			//if(Wan_IPVERSION[i] == "IPv4" || Wan_IPVERSION[i] == "IPv4/IPv6" || CurAPMode == "Bridge" || fixedAPMode == "APClient"){
			if(Wan_IPVERSION[i] == "IPv4" || CurAPMode == "Bridge" || fixedAPMode == "APClient"){
				rv.ipaddr="";						
				if((isDefRepeater == 1) ||(fixedAPMode == "APClient" && (currentRadio == "1" ||currentRadio == "0"))){	
					rv.proto = "repeater";		
				}
				else{						
					if ( Wan_Status4[i] == 'up' ){
						rv.ipaddr = Wan_IP4[i];								
						rv.link = "linkUp";		
					}else if ( (Wan_Actives[i] == "Yes") && ((Wan_WanName[i].indexOf('_B_') >= 0) || ('PPPoE' != Wan_ENCAP[i]) || (('PPPoE' == Wan_ENCAP[i]) && (('Connect_Keep_Alive' == Wan_Connection[i]) || ('-' == Wan_Connection[i])))) )
					{
						rv.link = "linking";								
					}else{
						rv.link = "linkDown";	
					}	
					if(CurAPMode == "Bridge" || CurAPMode == "APClient"){rv.proto = "Bridge";rv.lan_addr=rv.ipaddr;}							
					else{ rv.proto = Wan_ENCAP[i];}								
				}						
			}else if(Wan_IPVERSION[i] == "IPv6" || Wan_IPVERSION[i] == "IPv4/IPv6"){
				if(Wan_IPVERSION[i] == "IPv4/IPv6" &&  Wan_Status4[i] == 'up' )
					rv.ipaddr = Wan_IP4[i];
				else
					rv.ipaddr = "";
				rv.protov6	= Wan_DHCPv6[i];
				rv.ip6addr = "";					
				var isIPGWUp = 0;
				if ((Wan_IP6[i] != "N/A") && (Wan_GateWay6[i] != "N/A") ){
					if ((0 != Wan_IP6[i].length) && ('-' != Wan_IP6[i]) && (0 != Wan_GateWay6[i].length) && ('-' != Wan_GateWay6[i])){
						isIPGWUp = 1;
					}
				}
				if ( Wan_WanName[i].indexOf('_B_') >= 0 ){
					isIPGWUp = 1;								
				}
				if(Wan_Status6[i] == 'up' && isIPGWUp ==1){
					rv.ip6addr = Wan_IP6[i];
				}
			}
		
			rv.ipversion = Wan_IPVERSION[i];
			rv.ifname = Wan_WanName[i];
			rv.CurAPMode = CurAPMode;
		}
	}
	return rv;			
}
function dealSsid(str, obj){
	var newStr = str
	if(str.length >= 16){
		newStr = str.substr(0,13) + "...";
		$(obj).attr("title", str);
	}

	return newStr;
}





function getCurrentDate(Time) {
	if(Time == null)
		var now = new Date();
	else
		var now = new Date(Time);
	var year = now.getFullYear(); //得到年份
	var month = now.getMonth();//得到月份
	var date = now.getDate();//得到日期
	var day = now.getDay();//得到周几
	var hour = now.getHours();//得到小时
	var minu = now.getMinutes();//得到分钟
	var sec = now.getSeconds();//得到秒
　　var MS = now.getMilliseconds();//获取毫秒	
	var week;
	month = month + 1;
	if (month < 10) month = "0" + month;
	if (date < 10) date = "0" + date;
	if (hour < 10) hour = "0" + hour;
	if (minu < 10) minu = "0" + minu;
	if (sec < 10) sec = "0" + sec;
	if (MS < 10) MS = "0" + MS;
	if (languages == "CN")
		var arr_week = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
	else
		var arr_week = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
	week = arr_week[day];
	var time = "";
	if (languages == "CN")
		time = year + "年" + month + "月" + date + "日" + " " + hour + ":" + minu + ":" + sec + " " + week;
	else
		time = year + "-" + month + "-" + date  + " " + hour + ":" + minu + ":" + sec + " " + week;
	if(Time == null){
		//date -s 062509372012
		var timeStr = month.toString()+date.toString()+hour.toString()+minu.toString()+year.toString();
		$.post("/cgi-bin/getCurrTime.cgi",{"setData":timeStr},function(data){
			var cur_time2 = data;
			//setTime(cur_time2);
		});
	}
	return time;
}
function getSysTime(Time){
	return getCurrentDate(Time);
}
function objsValueSet(name,val){
	var objs = document.getElementsByName(name);
	for(var i=0; i< objs.length; i++ ){
		objs[i].value = val;
	}
}
function objChecked(obj){
	if($(obj).hasClass('fa-toggle-off')){
		$(obj).removeClass('fa-toggle-off').addClass('fa-toggle-on');
	}
}
function objNotChecked(obj){
	if($(obj).hasClass('fa-toggle-on')){
		$(obj).removeClass('fa-toggle-on').addClass('fa-toggle-off');
	}

}
function sigDisplay(id ,sig){
	$(id).addClass("sig_gradient");
	$(id).css({"width":sig});
}	

function checkBand(name){
	var objs = document.getElementsByName(name);
	for(var i=0; i< objs.length; i++ ){
		if(objs[i].checked == true){
			objs[i].value = 1;
			return;
		}
	}
}
function setBand(name,val){
	var objs = document.getElementsByName(name);
	for(var i=0; i< objs.length; i++ ){
		if(objs[i].value == val){
			objs[i].checked = true;
			return;
		}
	}		
}
function checkRadio(name){
	var objs = document.getElementsByClassName(name);
	for(var i=0; i< objs.length; i++ ){
		if(objs[i].checked == true){objCheckedRa(objs[i]);}
		else{objNotCheckedRa(objs[i]);}
	}		
}

function objCheckedRa(obj){
	if($(obj).parent().hasClass('unchecked')){
		$(obj).parent().removeClass('unchecked').addClass('checked');
	}
}
function objNotCheckedRa(obj){
	if($(obj).parent().hasClass('checked')){
		$(obj).parent().removeClass('checked').addClass('unchecked');
	}

}	
function checkBOX(obj){
	if(obj.checked == true && $(obj).parent().hasClass('chk_unchecked')){
		$(obj).parent().removeClass('chk_unchecked').addClass('chk_checked');
	}else{
		$(obj).parent().removeClass('chk_checked').addClass('chk_unchecked');
	}
}
function changeSSID(obj){
	for(var i=0;i<obj.options.length;i++){
		var opt = obj.options[i];
		if(opt.value == obj.value){
			obj.setAttribute("selected",obj.value);
			obj.value = opt.value;
			return;
		}
	}		
}	

function ID(id){
	return document.getElementById(id);
}

function disable_all_buttons(id, noBtn, noSubmit)
{
	if(id && ID(id))
		var inp = ID(id).getElementsByTagName("INPUT");
	else
		var inp = document.getElementsByTagName("INPUT");
	for(var idx=0; idx < inp.length; idx++){
		if((noBtn && noBtn == "noBtn" && inp[idx].type == "button" ) || 
			(noSubmit && noSubmit == "noSubmit" && inp[idx].type == "submit"))
			 continue;
		inp[idx].disabled = true;
	}
	
}

function enable_all_buttons(id)
{
	if(id && ID(id))
		var inp = ID(id).getElementsByTagName("INPUT");
	else
		var inp = document.getElementsByTagName("INPUT");
	for(var idx=0; idx < inp.length; idx++){
		inp[idx].disabled = false;
	}
}


function disable_all_select(id){
	if(id && ID(id))
		var sels = ID(id).getElementsByTagName("SELECT");
	else	
		var sels = document.getElementsByTagName("SELECT");
	
	for(var idx=0; idx < sels.length; idx++){
		sels[idx].disabled = true;
	}	
}
function enable_all_select(id){
	if(id && ID(id))
		var sels = ID(id).getElementsByTagName("SELECT");
	else	
		var sels = document.getElementsByTagName("SELECT");
	
	for(var idx=0; idx < sels.length; idx++){
		sels[idx].disabled = false;
	}	
}

function visit_url(idSuffix,to)
{
	disable_all_buttons();
	//document.getElementById("ActionBtns_"+idSuffix).style.display = "none";
	//document.getElementById("BusyText_"+idSuffix).style.display = "";
	location.href = to;
}
//上传文件大小及格式判断
function checkFileSize(objId, size, msg){
	var nfile= 0,fileSize=0;
	var browser = navigator.userAgent.indexOf("MSIE");
	var fileObj = document.getElementById(objId);
	if(browser != -1 && !window.opera && !fileObj.files){
		var filePath = fileObj.value;
		var fileSys = new ActiveXObject("Scripting.FileSystemObject");
		var file = fileSys.GetFile(filePath);
		fileSize = file.Size;
	}else{
		fileSize = fileObj.files[0].size;//单位为Byte
	}
	fileSize = Math.round(fileSize/1024*100)/100;
	fileSize = fileSize/1024;//MB

	if(fileSize <= 0 || fileSize >= size){
		alert(msg+size+"MB");			
		return false;
	}
	return true;
}
function checkFileType(objId, type1,type2, msg){
	var filePath = document.getElementById(objId).value;
	var extStart = filePath.lastIndexOf(".");
	var ext = filePath.substring(extStart, filePath.length).toLowerCase();
	if(ext != type1 && ext != type2){
		alert(msg);
		return false;
	}
	return true;
}		

var LockInterval=null,LockTime=0,MaxLockTime=0;
function createByTag(t,local){
	return local.createElement(t);
}
function alertWin(msg,type,local, callback){
	var is_mobile = isMobile();
	var lock_bg_o = local.getElementById("lock_bg");
	if(typeof(lock_bg_o) == "undfined" || lock_bg_o == null){
		var lock_bg_obj = createByTag("DIV", local);
		lock_bg_obj.id = "lock_bg";
		lock_bg_obj.className = "df_lock_bg";
		//if ( self!=top ){
			local.body.appendChild(lock_bg_obj);
		//}	
		//document.body.appendChild(lock_bg_obj);
	}else{
		var lock_bg_obj = lock_bg_o;
	}
	var width = screen.width;
	var height = local.documentElement.scrollHeight;

	var lock_bg = local.getElementById("lock_bg");
	lock_bg.style.height = height + "px";
	if(width<=720){
		if(is_mobile != -1){
			lock_bg.style.width = "100%";
		}else{
			lock_bg.style.width = "720px";
		}
	}else{
		lock_bg.style.width = "100%";
	}
	
	var lock_load_o = local.getElementById("lock_load");
	var browser = navigator.userAgent; 			 
	var isIE6 = browser.indexOf("MSIE 6.0");  
	var lock_ifm;
	if(lock_load_o) {
		local.body.removeChild(lock_load_o);
	}	
	lock_load_o = local.getElementById("lock_load");
	if(typeof(lock_load_o) == "undfined" || lock_load_o == null){
		var lock_load_obj = createByTag("DIV", local);
		lock_load_obj.id = "lock_load";
		lock_load_obj.className = "df_lock_load";
		if(isIE6 != -1){
			var lock_ifm1 = local.createElement('<IFRAME id="lock_ifm" width=100% height=550px style="position:absolute;z-index:1;left:0;top:0;_filter:alpha(opacity=0);opacity=0;display:block;background-color:transparent;;" frameborder="0"></IFRAME>');
		}
		if ( self!=top ){
			local.body.appendChild(lock_load_obj);
		}
		local.body.appendChild(lock_load_obj);		
		if(isIE6 != -1){
			local.body.appendChild(lock_ifm1);
			lock_ifm = local.getElementById("lock_ifm");
		}
	}else{
		var lock_load_obj = lock_load_o;
	}
	var lock_load = local.getElementById("lock_load");
	{		
		//lock_load.style.minWidth = '180px';
		if(width<=720){
			lock_load.style.left = '251px';
		}else{
			lock_load.style.left = (parseInt((local.body.offsetWidth),10)/2 - 150) + 'px';
		}
	}	
	var lock_msg = local.getElementById("lock_msg");
	if(typeof(lock_msg) == "undfined" || lock_msg == null){
		var msg_obj = createByTag("DIV", local);
		msg_obj.id = "lock_msg";
		msg_obj.className = "df_lock_msg";
		msg_obj.innerHTML = msg;
		lock_load.appendChild(msg_obj);
	}else{
		lock_msg.innerHTML = "";
	}
	var lock_load_btn = local.getElementById("lock_btn");
	if(typeof(lock_load_btn) == "undfined" || lock_load_btn == null){	
		var btn_obj = createByTag("DIV", local);
		btn_obj.id = "lock_btn";
		btn_obj.className = "df_lock_btn";
		
		var btn_ok = createByTag("DIV", local);
		btn_ok.id = "lock_ok";
		btn_ok.className = "df_lock_btn_ok";
		btn_ok.innerHTML = lang["confirm"];
		btn_ok.onclick = function(){
			if(callback != null)
				callback(true);
			hideAlertWin(local);
			return true;
		}
		btn_obj.appendChild(btn_ok);		
		if(type == "confirm"){
			var btn_cancal = createByTag("DIV", local);
			btn_cancal.id = "lock_cancel";
			btn_cancal.className = "df_lock_btn_cancel";
			btn_cancal.innerHTML = lang["Cancel"];
			btn_cancal.onclick = function(){
				hideAlertWin(local);
				if(callback != null)
					callback(false);
				return false;
			}
			btn_obj.appendChild(btn_cancal);	
		}
		if ( self!=top ){
			lock_load.appendChild(btn_obj);
		}
		lock_load.appendChild(btn_obj);		
	}else{
		$("#lock_ok").show();
		$("#lock_cancel").show();
		$("#lock_btn").show();
	}	
	
	lock_load.style.top =(parseInt((local.body.scrollHeight)/2-150))+'px';
	var lock_msg = local.getElementById("lock_msg");
	lock_msg.innerHTML = msg;
	if(is_mobile == 1){
		$(local).find("#lock_load").css({"top":"35%", "left":"10%", "width":"80%", "height":"auto", "line-height":"1.5rem", "padding":"5% 0", "font-size":"0.7rem"});
		$(local).find("#lock_msg").css({"padding-top":"5%"});
		$(local).find(".df_lock_btn_ok, .df_lock_btn_cancel").css({"margin": "2% 38%","width": "3rem","height": "1.3rem","border-radius": "0.2rem","line-height": "1.3rem"});
	}
	if(type == "confirm"){
		$(local).find(".df_lock_btn_ok").css({"margin":"2% 5%", "float":"right", "background":"#f6bd05"});
		$(local).find(".df_lock_btn_cancel").css({"margin":"2% 5%", "float":"left", "background":"#ffffff", "color":"black", "border":"1px #ccc solid"});
		if(is_mobile == 1){
			$(local).find(".df_lock_load").css({"max-width":"15rem"});
			$(local).find(".df_lock_btn").css({"padding":"0 25%"});
			$(local).find(".df_lock_btn_ok").css({"margin-top":"2%"});
			$(local).find(".df_lock_btn_cancel").css({"margin-top":"2%"});
		}else{
			$(local).find(".df_lock_btn").css({"padding":"20px 20%"});
		}
	}
	if(is_mobile == 1 && msg){
		if(msg.length > 50){
			$(local).find(".df_lock_msg").css({"margin-bottom":"0","padding-top":"0"});
		}else if(msg.length > 20 && msg.length < 50)
			$(local).find(".df_lock_msg").css("margin-bottom","2%");
		else
			$(local).find(".df_lock_msg").css("margin-bottom","5%");
	}
	if(msg.length > 240){
		$(local).find(".df_lock_msg").css("padding","8% 5% 0 5%");
	}
	lock_bg.style.display = "block";
	lock_load.style.display = "block";
	if(!msg){
		lock_load.style.display = "none";
		if(isIE6!= -1){lock_load.style.display = "none";}
		
	}
	return false;
}
function hideAlertWin(local){
	if(LockInterval) return;
	var lock_load = local.getElementById("lock_load");
	var lock_bg = local.getElementById("lock_bg");
	var lock_ifm = local.getElementById("lock_ifm");
	var browser = navigator.userAgent; 			 
	var isIE6 = browser.indexOf("MSIE 6.0");  		
	lock_load.style.display = "none";
	lock_bg.style.display = "none";	
	var lock_btn = local.getElementById("lock_btn");
	lock_btn.outerHTML = "";
	if(isIE6 != -1){lock_ifm.style.display = "none";}
	return;
}

/*(function(){
	var is_mobile = isMobile();
	var _alert;
	var flag=false;
	if(is_mobile == 1){
		_alert = window._alert ||{
			__alert:function(msg){
				return alertWin(msg, null, document);
			},
			__confirm:function(msg){
				return alertWin(msg, "confirm", document);
			}		
		}
	}else{
		_alert = window._alert ||{
			__alert:function(msg){
				return window.alert(msg);
			},
			__confirm:function(msg){
				window.confirm(msg);
				
			}		
		}	
	}
	window.alert = _alert.__alert;
	window.confirm = _alert.__confirm;
})();*/

function lockWin(msg,type, locktime,local, checkAPOn){
	document.body.onkeydown = function (event) {
		if (window.event) {
			return false;
		}
	}
	
	MaxLockTime = locktime;
	var is_mobile = isMobile();
	var lock_bg_o = local.getElementById("lock_bg");
	if(typeof(lock_bg_o) == "undfined" || lock_bg_o == null){
		var lock_bg_obj = createByTag("DIV", local);
		lock_bg_obj.id = "lock_bg";
		lock_bg_obj.className = "df_lock_bg";
		//if ( self!=top ){
			local.body.appendChild(lock_bg_obj);
		//}	
		//document.body.appendChild(lock_bg_obj);
	}else{
		var lock_bg_obj = lock_bg_o;
	}
	var width = screen.width;
	var height = local.documentElement.scrollHeight;

	var lock_bg = local.getElementById("lock_bg");
	lock_bg.style.height = height + "px";
	if(width<=720){
		if(is_mobile != -1){
			lock_bg.style.width = "100%";
		}else{
			lock_bg.style.width = "720px";
		}
	}else{
		lock_bg.style.width = "100%";
	}
	
	var lock_load_o = local.getElementById("lock_load");
	var browser = navigator.userAgent; 			 
	var isIE6 = browser.indexOf("MSIE 6.0");  
	var lock_ifm;
	if(lock_load_o) {
		local.body.removeChild(lock_load_o);
	}
	lock_load_o = local.getElementById("lock_load");
	if(typeof(lock_load_o) == "undfined" || lock_load_o == null){
		var lock_load_obj = createByTag("DIV", local);
		lock_load_obj.id = "lock_load";
		lock_load_obj.className = "df_lock_load";
		if(isIE6 != -1){
			var lock_ifm1 = local.createElement('<IFRAME id="lock_ifm" width=100% height=550px style="position:absolute;z-index:1;left:0;top:0;_filter:alpha(opacity=0);opacity=0;display:block;background-color:transparent;;" frameborder="0"></IFRAME>');
		}
		//if ( self!=top ){
			local.body.appendChild(lock_load_obj);
		//}
		if(isIE6 != -1){
			local.body.appendChild(lock_ifm1);
			lock_ifm = local.getElementById("lock_ifm");
		}
	}else{
		var lock_load_obj = lock_load_o;
	}
	
	var lock_load = local.getElementById("lock_load");
	if(type){
		lock_load.style.width = '950px';
		lock_load.style.left = (parseInt((local.body.offsetWidth),10)/2 - 400) + 'px';
	}else{		
		//lock_load.style.minWidth = '180px';
		if(width<=720){
			lock_load.style.left = '251px';
		}else{
			lock_load.style.left = (parseInt((local.body.offsetWidth),10)/2 - 150) + 'px';
		}
	}
	if(is_mobile == 1){
		$("#lock_load").css({"top":"35%", "left":"25%", "width":"80%", "height":"auto", "padding":"10% 2%", "font-size":"0.7rem"
							,"line-height": "unset", "word-break":"break-word"});
	}
	
	if(msg && msg.length > 25){
		if(msg.length > 160 && msg.length < 180 )lock_load.style.padding = "2% 1%";
		else if(msg.length >= 180 )lock_load.style.padding = "1% 1%";
		else if(msg.length >= 30)lock_load.style.padding = "4% 1%";
		else lock_load.style.padding = "5% 1%";
		if(is_mobile == 1)lock_load.style.lineHeight = "50px";
		else lock_load.style.lineHeight = "30px";
	}
	lock_load.style.top =(parseInt((local.body.scrollHeight)/2-150))+'px';
	lock_load.innerHTML = msg;
	lock_bg.style.display = "block";
	lock_load.style.display = "block";
	
	if(isIE6 != -1){lock_ifm.style.display="block";}
	if(!type && msg){

		LockInterval = window.setInterval(function(){
			if(LockTime < MaxLockTime){
				LockTime += 1;
				if(is_mobile == 1 && locktime >= 15){
					if(typeof(checkAPOn) != "undefined" && checkAPOn == true){
						$("#lock_load").css({"height":"8rem"});
						lock_load.innerHTML = msg + parseInt(MaxLockTime - LockTime).toString() + "s..." + lang["reconnwiredTips"];
					}else{
						lock_load.innerHTML = msg + parseInt(MaxLockTime - LockTime).toString() + "s..." + lang["reconnectTips"];
					}
				}else{
					lock_load.innerHTML = msg + parseInt(MaxLockTime - LockTime).toString() + "s";
				}
			}else{
				window.clearInterval(LockInterval);
				LockInterval = null;
				unlockWin("", local);
			}
		},1000);
	}else{
		var close =  createByTag("DIV", local);
		close.className = "df_h_close";
		close.onclick = function(){
			unlockWin("", local);
		
		}
		lock_load.append(close);
	}
	if(!msg){
		lock_load.style.display = "none";
		if(isIE6!= -1){lock_load.style.display = "none";}
		
	}
}

function unlockWin(msg, local){
	document.body.onkeydown = function (event){
	}
	LockTime = 0;
	window.clearInterval(LockInterval);
	var lock_load = local.getElementById("lock_load");
	var lock_bg = local.getElementById("lock_bg");
	var lock_ifm = local.getElementById("lock_ifm");
	var browser = navigator.userAgent; 			 
	var isIE6 = browser.indexOf("MSIE 6.0");  	
	lock_load.innerHTML = msg;
	
	if(!msg){		
		lock_load.style.display = "none";
		lock_bg.style.display = "none";
		if(isIE6 != -1){lock_ifm.style.display = "none";}
		return;
	}
	//window.setTimeout(function(){
		lock_load.style.display = "none";
		lock_bg.style.display = "none";
		if(isIE6 != -1){lock_ifm.style.display = "none";}
	//},1000);
}	

function counter(locktime, obj, msg){
	var MaxLockTime = locktime;
	var is_mobile = isMobile();
	var LockInterval = window.setInterval(function(){
		if(LockTime < MaxLockTime){
			LockTime += 1;
			if(is_mobile == 1 && locktime >= 15)
				obj.innerHTML = msg + " " + parseInt(MaxLockTime - LockTime).toString() + "s" +"..." + lang["reconnectTips"];
			else
				obj.innerHTML = msg + " " + parseInt(MaxLockTime - LockTime).toString() + "s" +"...";
		}else{
			window.clearInterval(LockInterval);
		}
	},1000);		
}
function getsec(str)
{  
	var str1=str.substring(1,str.length)*1;    
	var str2=str.substring(0,1);  
	if (str2=="s")
	{  
		return str1*1000; 
	}
	else if (str2=="h")
	{  
		return str1*60*60*1000; 
		}
	else if (str2=="d")
	{  
		return str1*24*60*60*1000; 
		}  
}
		
function setCookie(name,value,time)
{  
	var strsec = getsec(time); 
	var exp = new Date();  
	exp.setTime(exp.getTime() + strsec*1);  
	document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();  
} 

function getCookie(Name){
var search = Name + "=";
if(document.cookie.length > 0) 
{
	offset = document.cookie.indexOf(search);
	if(offset != -1) 
	{
		offset += search.length;
		end = document.cookie.indexOf(";", offset);
		if(end == -1) end = document.cookie.length;
		return unescape(document.cookie.substring(offset, end));
	}
	else 
		return "";
}
else
	return "";
}

function rmCookie(name){  
var exp = new Date();  
exp.setTime(exp.getTime() - 10000);  
document.cookie = name + "=del;expires=" + exp.toGMTString();  
document.cookie = name + "=del;expires=" + exp.toGMTString()+";path=/;";  
}
function cmpIpAddress(address1,address2)
{
		var Lnum = 0;
		var Snum = 0;
		var addrParts1 = address1.split('.');
		var addrParts2 = address2.split('.');
		for (i = 0; i <= 3; i++)
		{
			Lnum = parseInt(addrParts1[i]);
			Snum = parseInt(addrParts2[i]);
			if (Lnum < Snum)
			{
					return false;
			}
		}
		return true;
}
function IP2Bin(ip)
{
	var strIP = ip.toString(2);
	var len = strIP.length;
	if(len<8)
	{
		for(var i=0;i<8-len;i++){
			strIP = "0" + strIP;
		}
	}
	return strIP;
}		
function GetIP(ip_str)
{
	var ip="";
	var obj={};
	var ip_arr = ip_str.split(".");
	for(var i=0;i<ip_arr.length;i++){
		obj["ip"+i]=parseInt(ip_arr[i],10);
		ip +=IP2Bin(obj["ip"+i])
	}
	return ip;
}
function AND(ip,mask){
	var str = '' ;
	for(var i=0;i<32;i++){
		var a = ip.substring(i,i+1);
		var b = mask.substring(i,i+1);
		if(a=='0'||b=='0'){
			str +='0';
		}else{
			str +='1';    
		}
	}
	return str;
}

function NtoH(str){
	var data='';
	for(var i=0;i<str.length;i++){
		var st = str.substring(i,i+8);
		var ten = parseInt(st,2).toString();
		data += ten +"."; 
		i=i+7;
	}
	data = data.substring(0,data.length-1);
	return data;
}	

function different(str)
{
	if(str == '')
	{
		return '';
	}
	var tempArray = str.split(',');
	var tempbuf;
	var index = 0;
	var resultArray = new Array();
	for(i = 0; i < tempArray.length-1; i++)
	{
		for(j =0;j < tempArray.length-i-1;j++)
		{
				if(tempArray[j] > tempArray[parseInt(j)+1 ])
				{
					tempbuf = tempArray[j];
					tempArray[j] = tempArray[parseInt(j)+1];
					tempArray[parseInt(j)+1] = tempbuf;
				}
		}
	}
	resultArray[0] = tempArray[0];
	for(i = 1; i< tempArray.length; i++)
	{
		if(tempArray[i] != tempArray[i - 1])
		{
				index ++;
				resultArray[index] =  tempArray[i];
		}	
	}
	return resultArray;
}

function issame(str1,tempArray)
{
	for(i = 0 ; i<tempArray.length; i ++)
	{
		 if(parseInt(str1) == parseInt(tempArray[i]))
		 {
		 		return true;
		 }
	}	
	return false;
	
}

function isNumber(c)
{
	if(c == '0' || c == '')
		return false;
	for(var i=0; i < c.length;i ++ )
	{
		if (c.charAt(i) < "0" || c.charAt(i) > "9")
		{
			return false;
		}	
	}
	return true;
}

function MyConfirm_hide()
{	
	$("#confirmWindow").hide();
	$("#fogWindow").hide();
	
	return true;
}

function my_confirm(msg, fun)
{
	my_window("confirm", msg, fun);
}

function my_alert(msg, fun)
{
	if(fun == ""){
		my_window("alert", msg, "MyConfirm_hide()");
	}
	else{
		my_window("alert", msg, fun);
	}
}

function my_window(type, msg, fun)
{
	var is_mobile = isMobile();
	var cfmWindow_css = 'z-index: 999;width:25%;height:20%;border-radius:5px;background-color: #fff;text-align: center;'
					+ 'position:fixed;margin:auto;left:0; right:0;top: 30%;';
	var panel_css = 'border-radius: 5px;box-shadow: 0 0 10px rgba(0,0,0,0.4);';
	var Btn_css = 'height: 35px;min-width: 100px;font-size: 11px;line-height:11px;width:20%;'
				+ '-webkit-border-radius: 4px;-moz-border-radius: 4px;border-radius: 4px;cursor: pointer;';
	var submitBtn_css = Btn_css + 'background: #f6bd05;border: none;color: #FFFFFF;margin-right:10px;';
	var cancelBtn_css = Btn_css + 'background: white;color: black;border:1px #ccc solid;margin-left:10px;';
	var content_css = 'position: absolute;left:0;right:0;top: 20%;font-size: 15px; padding: 5px 15px;';
	var fog_css = 'position:fixed;top: 0;width: 100%;height: 100%;background: #333;opacity:0.3;display:none';
	
	if(is_mobile == 1){
		cfmWindow_css += 'min-width:14rem; min-height:8rem;';
		submitBtn_css += 'height: 1.2rem;font-size: 0.6rem;';
		cancelBtn_css += 'height: 1.2rem;font-size: 0.6rem;';
		content_css	  += 'font-size: 0.6rem;';
	}
	else{
		cfmWindow_css += 'min-width:450px; min-height:220px;';
		if(type == "confirm"){
			submitBtn_css += 'position:absolute; left:21%;';
			cancelBtn_css += 'position:absolute; right:21%;';
		}
		else{
			submitBtn_css += 'position:absolute;left:0;right:0;margin:auto;';
			cancelBtn_css += 'position:absolute;left:0;right:0;margin:auto;';
		}
	}
	
	var ContentHtml = '';
	
	ContentHtml = '<div id="confirmContent_div" style="height:60%">'
				+ '<span id="confirmContent" style="'+ content_css +'">'+ msg +'</span></div>'
				+ '<div id="confirmbtn_div" style="height:40%;padding-bottom:10px;">';
	
	ContentHtml += '<div style="position: absolute;right: 0;left: 0;padding-top: 20px;">';	
	if(fun == "jumpGuide" || fun == "_call_apply_and_wait" || fun == "_call_BndStrg" || fun == "_call_ChangeRadioMode_White" || fun == "_call_ChangeRadioMode_Black"){
		ContentHtml += '<input type="button" id="submitBtn" class="button" onclick="'+ fun +'(1);MyConfirm_hide();" value="'+ lang["Submit"] +'" style="'+ submitBtn_css +'" />';
		ContentHtml += '<input type="button" id="CancelBtn" class="button" onclick="'+ fun +'(0);MyConfirm_hide();" value="'+ lang["Cancel"] +'" style="'+ cancelBtn_css +'" />';
	}
	else{
		ContentHtml += '<input type="button" id="submitBtn" class="button" onclick="'+ fun +';MyConfirm_hide();" value="'+ lang["Submit"] +'" style="'+ submitBtn_css +'" />';
		if(type == "confirm"){
			ContentHtml += '<input type="button" id="CancelBtn" class="button" onclick="MyConfirm_hide();" value="'+ lang["Cancel"] +'" style="'+ cancelBtn_css +'" />';
		}
	}
	ContentHtml += '</div></div>';
	
	var WindowHtml = '<div id="confirmWindow" style="'+ cfmWindow_css + panel_css +'">'+ContentHtml+'</div>';
	
	var is_plugin = 0;
	if(ID("Selected_Menu"))
		is_plugin = 0;
	else
		is_plugin = 1;
	
	var getId = (1==is_plugin?(window.parent.$("#confirmWindow").attr("id")):($("#confirmWindow").attr("id")));
	if(getId != "confirmWindow"){
		if(1 == is_plugin){
			window.parent.$("body").after(WindowHtml);
		}
		else{
			$("body").after(WindowHtml);
		}	
	}
	else{
		if(1 == is_plugin){
			window.parent.$("#submitBtn").attr("onclick", fun+";MyConfirm_hide();");
			window.parent.$("#confirmContent").html(msg);
		}
		else{
			$("#submitBtn").attr("onclick", fun+";MyConfirm_hide();");
			$("#confirmContent").html(msg);
		}
	}
	
	var fogHtml = '<div id="fogWindow" style="'+ fog_css +'"></div>';
	var getId = (1==is_plugin?(window.parent.$("#fogWindow").attr("id")):($("#fogWindow").attr("id")));
	if(getId != "fogWindow"){
		if(1 == is_plugin){
			window.parent.$("body").after(fogHtml);
		}
		else{
			$("body").after(fogHtml);
		}
	}
	
	if(1 == is_plugin){
		window.parent.$("#fogWindow").show();
		window.parent.$("#confirmWindow").show();
	}
	else{
		$("#fogWindow").show();
		$("#confirmWindow").show();
	}

	return true;
}

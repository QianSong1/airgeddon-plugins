/*
	LuCI - Lua Configuration Interface

	Copyright 2008 Steven Barth <steven@midlink.org>
	Copyright 2008-2012 Jo-Philipp Wich <xm@subsignal.org>

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0
*/

var cbi_d = [];
var cbi_t = [];
var cbi_c = [];
var head_name;
var err_type;

var cbi_validators = {
		
	'guide_username': function()
	{
		var v = this;
		var len = 0;
		var i = 0;
		len = v.length;
		for(i=0;i<len;i++){
			code = v.charCodeAt(i);
			if((code >= 48 && code<= 57) || (code >= 97 && code <= 122) || (code >= 65 && code <= 90) || code ==95 || code ==45)
				continue;
			else
				return false;
		}
		return true;
	},
	
	'ssid_check': function()
	{
		var v = this;
		var len = 0;
		var i = 0;
		len = v.length;
		if (len > 32)
			return false;
		for(i=0;i<len;i++){
			code = v.charCodeAt(i);
			if((code >= 48 && code<= 57) || (code >= 97 && code <= 122) || (code >= 65 && code <= 90) || code ==95 || code ==45)
				continue;
			else
				return false;
		}
		return true;
	},
	
	
	'integer': function()
	{
		return (this.match(/^-?[0-9]+$/) != null);
	},
	
	'time_integer': function()
	{
		if((this.match(/^-?[0-9]+$/) != null) && (this >= 2) && (this <= 1440))
			return true;
		else
			return false;
	},
	
	'hour_integer': function()
	{
		if((this.match(/^-?[0-9]+$/) != null) && (this >= 0) && (this <= 23))
			return true;
		else
			return false;
	},
	
	'minutes_integer': function()
	{
		if((this.match(/^-?[0-9]+$/) != null) && (this >= 0) && (this <= 59))
			return true;
		else
			return false;
	},
	
	'leasetime_integer': function()
	{
		if((this.match(/^-?[0-9]+$/) != null) && (this >= 1) && (this <= 10080))
			return true;
		else
			return false;
	},
	
	'maxassoc_integer': function()
	{
		if((this.match(/^-?[0-9]+$/) != null) && (this >= 0) && (this <= 32))
			return true;
		else
			return false;
	},
	
	'roaming_integer': function()
	{
		if((this.match(/^-?[0-9]+$/) != null) && (this >= -90) && (this <= -30))
			return true;
		else
			return false;
	},
	
	'qos_integer': function()
	{
		if((this.match(/^-?[0-9]+$/) != null) && (this >= 8192) && (this <= 1000000000))
			return true;
		else if(this == 0)
			return true;
		else
			return false;
	},
	
	'beacon_period': function()
	{
		if((this.match(/^-?[0-9]+$/) != null) && (this >= 20) && (this <= 1024))
			return true;
		else
			return false;
	},	
	'dtim_period': function()
	{
		if((this.match(/^-?[0-9]+$/) != null) && (this >= 1) && (this <= 255))
			return true;
		else
			return false;
	},	
	'rts_thr': function()
	{
		if((this.match(/^-?[0-9]+$/) != null) && (this >= 1) && (this <= 2347))
			return true;
		else
			return false;
	},	
	'maxassoc': function()
	{
		if((this.match(/^-?[0-9]+$/) != null) && (this >= 0) && (this <= 32))
			return true;
		else
			return false;
	},		
	'uinteger': function()
	{
		return (cbi_validators.integer.apply(this) && (this >= 0));
	},

	'headname': function()
	{
		if(head_name != ""){
			var head = head_name;
			var ssid_head = this.substring(0,head.length);
			if(head != ssid_head || this.length <= head.length){
				err_type = 1;
				return false;
			}
		}
		if (this.length <= 32 && this.length >=1)
			if(this.match(/^[^\`\\$'"]*$/) != null)
				return true;
		err_type = 0;
		return false;
	},

	'float': function()
	{
		return !isNaN(parseFloat(this));
	},

	'ufloat': function()
	{
		return (cbi_validators['float'].apply(this) && (this >= 0));
	},

	'ipaddr': function()
	{
		return cbi_validators.ip4addr.apply(this) ||
			cbi_validators.ip6addr.apply(this);
	},

	'ip4addr': function()
	{
		if (this.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})?$/))
		{
			return (RegExp.$1 >= 0) && (RegExp.$1 <= 255) &&
			       (RegExp.$2 >= 0) && (RegExp.$2 <= 255) &&
			       (RegExp.$3 >= 0) && (RegExp.$3 <= 255) &&
			       (RegExp.$4 >= 1) && (RegExp.$4 <= 254)
			;
		}

		return false;
	},

	'ip4addr_lan': function()
	{
		if (this.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})(\/(\S+))?$/))
		{
			return (RegExp.$1 > 0) && (RegExp.$1 < 255) &&
			       (RegExp.$2 >= 0) && (RegExp.$2 <= 255) &&
			       (RegExp.$3 >= 0) && (RegExp.$3 <= 255) &&
			       (RegExp.$4 >= 1) && (RegExp.$4 <= 254) &&
			       ((RegExp.$6.indexOf('.') < 0)
			          ? ((RegExp.$6 >= 0) && (RegExp.$6 <= 32))
			          : (cbi_validators.ip4addr.apply(RegExp.$6)))
			;
		}

		return false;
	},

	'gateway': function()
	{
		if (this.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})(\/(\S+))?$/))
		{
			return (RegExp.$1 >= 0) && (RegExp.$1 <= 255) &&
			       (RegExp.$2 >= 0) && (RegExp.$2 <= 255) &&
			       (RegExp.$3 >= 0) && (RegExp.$3 <= 255) &&
			       (RegExp.$4 >= 1) && (RegExp.$4 <= 254) &&
			       ((RegExp.$6.indexOf('.') < 0)
			          ? ((RegExp.$6 >= 0) && (RegExp.$6 <= 32))
			          : (cbi_validators.ip4addr.apply(RegExp.$6)))
			;
		}

		return false;
	},
	
    'netmask': function()
	{
		if(this.search(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/) == -1) 
		{ 
			return false;
		}	  
		var exp=/^(254|252|248|240|224|192|128)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(255|254|252|248|240|224|192|128|0)$/; 
		var reg = this.match(exp); 
		var long = 0;
		
		if(reg==null) 
		{ 
			return false;
		} 
		else 
		{ 
			return true;
		} 

	},   

	'ip6addr': function()
	{
		if( this.match(/^([a-fA-F0-9:.]+)(\/(\d+))?$/) )
		{
			if( !RegExp.$2 || ((RegExp.$3 >= 0) && (RegExp.$3 <= 128)) )
			{
				var addr = RegExp.$1;

				if( addr == '::' )
				{
					return true;
				}

				if( addr.indexOf('.') > 0 )
				{
					var off = addr.lastIndexOf(':');

					if( !(off && cbi_validators.ip4addr.apply(addr.substr(off+1))) )
						return false;

					addr = addr.substr(0, off) + ':0:0';
				}

				if( addr.indexOf('::') >= 0 )
				{
					var colons = 0;
					var fill = '0';

					for( var i = 1; i < (addr.length-1); i++ )
						if( addr.charAt(i) == ':' )
							colons++;

					if( colons > 7 )
						return false;

					for( var i = 0; i < (7 - colons); i++ )
						fill += ':0';

					if (addr.match(/^(.*?)::(.*?)$/))
						addr = (RegExp.$1 ? RegExp.$1 + ':' : '') + fill +
						       (RegExp.$2 ? ':' + RegExp.$2 : '');
				}

				return (addr.match(/^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$/) != null);
			}
		}

		return false;
	},

	'port': function()
	{
		return cbi_validators.integer.apply(this) &&
			(this >= 0) && (this <= 65535);
	},

	'portrange': function()
	{
		if (this.match(/^(\d+)-(\d+)$/))
		{
			var p1 = RegExp.$1;
			var p2 = RegExp.$2;

			return cbi_validators.port.apply(p1) &&
			       cbi_validators.port.apply(p2) &&
			       (parseInt(p1) <= parseInt(p2))
			;
		}
		else
		{
			return cbi_validators.port.apply(this);
		}
	},

	'macaddr': function()
	{
		if(this.length != 0)
			return (this.match(/^([a-fA-F0-9]{2}:){5}[a-fA-F0-9]{2}$/) != null);
		else
			return true;
	},

	'host': function()
	{
		return cbi_validators.hostname.apply(this) ||
			cbi_validators.ipaddr.apply(this);
	},

	'hostname': function()
	{
		if (this.length <= 253)
			return (this.match(/^[a-zA-Z0-9]+$/) != null ||
			        (this.match(/^[a-zA-Z0-9_][a-zA-Z0-9_\-.]*[a-zA-Z0-9]$/) &&
			         this.match(/[^0-9.]/)));

		return false;
	},

    'name': function()
	{
		if (this.length <= 32 && this.length >=1)
			return (this.match(/^[a-zA-Z0-9]+$/) != null ||
			        (this.match(/^[a-zA-Z0-9_][a-zA-Z0-9_\-.]*[a-zA-Z0-9]$/) &&
			         this.match(/[^0-9.]/)));

		return false;
	},

	'ktname': function()
	{
		var v = this;
		var len = 0;
		var i = 0;
		
		len = v.length;
		for(i=0;i<len;i++)
		{
			code = v.charCodeAt(i);
			if((code>=0) && (code <= 128))
			{
				continue;
			}else
			{
				return false
			}
		}
		
		if(get_str_len(this) > 32){
			return false;
		}
		if (this.length <= 32 && this.length >0){
			//return (this.match(/^[^\`\\$'"<> ]*$/) != null);
			if((this.match(/^[^\`\\$'"<> &\/!#,]*$/) != null) ){
				//document.getElementById("setMTU").style = "display:none"; 
				return true;
			}else{
				//document.getElementById("setMTU").style = ""; 
				return false;
			}
		}	
		return false;
	},
	
	'ktssidname': function()
	{
		var v = this;
		
		var len = 0;
		var i = 0;
		
		len = v.length;
		for(i=0;i<len;i++)
		{
			code = v.charCodeAt(i);
			if (code == 44)
				return false;
			if((code>=0) && (code <= 128))
			{
				continue;
			}else
			{
				return false
			}
		}
		
		if(get_str_len(this) > 32){
			return false;
		}
		if (this.length <= 32 && this.length >=0){
			//return (this.match(/^[^\`\\$'"<> ]*$/) != null);
			if((this.match(/^[^\`\\$'"<> ]*$/) != null) && (this.match(/[&][#]/) == null)){
				//document.getElementById("setMTU").style = "display:none"; 
				return true;
			}else{
				//document.getElementById("setMTU").style = ""; 
				return false;
			}
		}	
		return false;
	},
	
	'ktname1': function()
	{
		if (this.length <= 253)
			return (this.match(/^[a-zA-Z0-9]+$/) != null ||
			        (this.match(/^[a-zA-Z0-9_][a-zA-Z0-9_\-.]*[a-zA-Z0-9]$/) &&
			         this.match(/[^0-9.]/)));

		return false;
	},
	
	'kt_user_ktname': function()
	{
		if (this.length <= 32 && this.length >0)
			return this.match(/^[a-zA-Z0-9_\-]+$/);

		return false;
	},
	
	'kt_user_password': function()
	{
		if (this.length <= 32 && this.length >=8)
			return this.match(/[a-zA-Z]/) && this.match(/[0-9]/) && this.match(/[_\-]/) && this.match(/^[a-zA-Z0-9_\-]+$/);

		return false;
	},

	'network': function()
	{
		return cbi_validators.uciname.apply(this) ||
			cbi_validators.host.apply(this);
	},

	'wpakey': function()
	{
		var v = this;
		
		var len = 0;
		var i = 0;
		
		len = v.length;
		for(i=0;i<len;i++)
		{
			code = v.charCodeAt(i);
			if((code>=0) && (code <= 128))
			{
				continue;
			}else
			{
				return false
			}
		}
		
		if( v.length == 64 )
			return (v.match(/^[a-fA-F0-9]{64}$/) != null);
		else if((v.length >= 8) && (v.length <= 63))
			//return (v.match(/^[^\`\\$'"]*$/) != null);
			if((this.match(/^[^\`\\$'"<> &\/!#,]*$/) != null) ){
				//document.getElementById("setMTU").style = "display:none"; 
				return true;
			}else{
				//document.getElementById("setMTU").style = ""; 
				return false;
			}
		else
			return false
	},
	
	'wpakey_new': function()
	{
		var v = this;

		if( v.length == 64 )
			return (v.match(/^[a-fA-F0-9]{64}$/) != null);
		else if((v.length >= 8) && (v.length <= 63))
			return (v.match(/^[a-zA-Z0-9]+$/) != null ||
			        (v.match(/^[a-zA-Z0-9_][a-zA-Z0-9_\-.]*[a-zA-Z0-9]$/) &&
			         v.match(/[^0-9.]/)));
		else
			return false;
	},

	'wepkey': function()
	{
		var v = this;
		
		var len = 0;
		var i = 0;
		
		len = v.length;
		for(i=0;i<len;i++)
		{
			code = v.charCodeAt(i);
			if((code>=0) && (code <= 128))
			{
				continue;
			}else
			{
				return false
			}
		}

		if ( v.substr(0,2) == 's:' )
			v = v.substr(2);

		if( (v.length == 10) || (v.length == 26) )
			return (v.match(/^[a-fA-F0-9]{10,26}$/) != null);
		else if((v.length == 5) || (v.length == 13))
			return (v.match(/^[^\`\\$'"<> &\/!#%,]*$/) != null);		
		else
			return false
	},
	
	'wepkey_new': function()
	{
		var v = this;

		if ( v.substr(0,2) == 's:' )
			v = v.substr(2);

		if( (v.length == 10) || (v.length == 26) )
			return (v.match(/^[a-fA-F0-9]{10,26}$/) != null);
		else if((v.length == 5) || (v.length == 13))
			return (v.match(/^[a-zA-Z0-9]+$/) != null ||
			        (v.match(/^[a-zA-Z0-9_][a-zA-Z0-9_\-.]*[a-zA-Z0-9]$/) &&
			         v.match(/[^0-9.]/)));
		else
			return false;
	},

	'uciname': function()
	{
		return (this.match(/^[a-zA-Z0-9_]+$/) != null);
	},

	'range': function(min, max)
	{
		var val = parseFloat(this);
		if (!isNaN(min) && !isNaN(max) && !isNaN(val))
			return ((val >= min) && (val <= max));

		return false;
	},

	'min': function(min)
	{
		var val = parseFloat(this);
		if (!isNaN(min) && !isNaN(val))
			return (val >= min);

		return false;
	},

	'max': function(max)
	{
		var val = parseFloat(this);
		if (!isNaN(max) && !isNaN(val))
			return (val <= max);

		return false;
	},

	'rangelength': function(min, max)
	{
		var val = '' + this;
		if (!isNaN(min) && !isNaN(max))
			return ((val.length >= min) && (val.length <= max));

		return false;
	},

	'minlength': function(min)
	{
		var val = '' + this;
		if (!isNaN(min))
			return (val.length >= min);

		return false;
	},

	'maxlength': function(max)
	{
		var val = '' + this;
		if (!isNaN(max))
			return (val.length <= max);

		return false;
	},

	'or': function()
	{
		for (var i = 0; i < arguments.length; i += 2)
		{
			if (typeof arguments[i] != 'function')
			{
				if (arguments[i] == this)
					return true;
				i--;
			}
			else if (arguments[i].apply(this, arguments[i+1]))
			{
				return true;
			}
		}
		return false;
	},

	'and': function()
	{
		for (var i = 0; i < arguments.length; i += 2)
		{
			if (typeof arguments[i] != 'function')
			{
				if (arguments[i] != this)
					return false;
				i--;
			}
			else if (!arguments[i].apply(this, arguments[i+1]))
			{
				return false;
			}
		}
		return true;
	},

	'neg': function()
	{
		return cbi_validators.or.apply(
			this.replace(/^[ \t]*![ \t]*/, ''), arguments);
	},

	'list': function(subvalidator, subargs)
	{
		if (typeof subvalidator != 'function')
			return false;

		var tokens = this.match(/[^ \t]+/g);
		for (var i = 0; i < tokens.length; i++)
			if (!subvalidator.apply(tokens[i], subargs))
				return false;

		return true;
	},
	'phonedigit': function()
	{
		return (this.match(/^[0-9\*#!\.]+$/) != null);
	},
    'kt_name': function(length)
	{
		var v = this;
		if( v.length < length ){
			return (v.match(/^[a-zA-Z0-9_\-]+$/) != null);
        }
		else
			return false;
	},
	
	'website': function()
	{
		if (this.length <= 253)
			return ((this.match(/^[a-zA-Z0-9]+$/) != null ||
			        (this.match(/^[a-zA-Z0-9_][a-zA-Z0-9_\-.]*[a-zA-Z0-9]$/) &&
			         this.match(/[^0-9.]/))) || cbi_validators.ip4addr.apply(this));
		 
		return false;
	}
};

function cbi_d_add(field, dep, next) {
	var obj = document.getElementById(field);
	if (obj) {
		var entry
		for (var i=0; i<cbi_d.length; i++) {
			if (cbi_d[i].id == field) {
				entry = cbi_d[i];
				break;
			}
		}
		if (!entry) {
			entry = {
				"node": obj,
				"id": field,
				"parent": obj.parentNode.id,
				"next": next,
				"deps": []
			};
			cbi_d.unshift(entry);
		}
		entry.deps.push(dep)
	}
}

function Base64() 
{ 
// private property 

_keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="; 

// public method for encoding 

this.encode = function (input) 
{ 

	var output = ""; 

	var chr1, chr2, chr3, enc1, enc2, enc3, enc4; 

	var i = 0; 

	input = _utf8_encode(input); 

	while (i < input.length) { 

	chr1 = input.charCodeAt(i++); 

	chr2 = input.charCodeAt(i++); 

	chr3 = input.charCodeAt(i++); 

	enc1 = chr1 >> 2; 

	enc2 = ((chr1 & 3) << 4) | (chr2 >> 4); 

	enc3 = ((chr2 & 15) << 2) | (chr3 >> 6); 

	enc4 = chr3 & 63; 

	if (isNaN(chr2)) { 

	enc3 = enc4 = 64; 

	} else if (isNaN(chr3)) { 

	enc4 = 64; 

	} 

	output = output + _keyStr.charAt(enc1) + 
		_keyStr.charAt(enc2) + 
		_keyStr.charAt(enc3) + 
		_keyStr.charAt(enc4); 

	} 

	return output; 

	} 


	// public method for decoding 

	this.decode = function (input) { 

	var output = ""; 

	var chr1, chr2, chr3; 

	var enc1, enc2, enc3, enc4; 

	var i = 0; 

	input = input.replace(/[^A-Za-z0-9\+\/\=]/g, ""); 

	while (i < input.length) { 

	enc1 = _keyStr.indexOf(input.charAt(i++)); 

	enc2 = _keyStr.indexOf(input.charAt(i++)); 

	enc3 = _keyStr.indexOf(input.charAt(i++)); 

	enc4 = _keyStr.indexOf(input.charAt(i++)); 

	chr1 = (enc1 << 2) | (enc2 >> 4); 

	chr2 = ((enc2 & 15) << 4) | (enc3 >> 2); 

	chr3 = ((enc3 & 3) << 6) | enc4; 

	output = output + String.fromCharCode(chr1); 

	if (enc3 != 64) { 

	output = output + String.fromCharCode(chr2); 

	} 

	if (enc4 != 64) { 

	output = output + String.fromCharCode(chr3); 

	} 

	} 

	output = _utf8_decode(output); 

	return output; 

	} 


	// private 
	//method for UTF-8 encoding 

	_utf8_encode = function (string) { 

	string = string.replace(/\r\n/g,"\n"); 

	var utftext = ""; 

	for (var n = 0; n < string.length; n++) { 

	var c = string.charCodeAt(n); 

	if (c < 128) { 

	utftext += String.fromCharCode(c); 

	} else if((c > 127) && (c < 2048)) { 

	utftext += String.fromCharCode((c >> 6) | 192); 

	utftext += String.fromCharCode((c & 63) | 128); 

	} else { 

	utftext += String.fromCharCode((c >> 12) | 224); 

	utftext += String.fromCharCode(((c >> 6) & 63) | 128); 

	utftext += String.fromCharCode((c & 63) | 128); 

	} 


	} 

	return utftext; 

	} 


	// private 
	//method for UTF-8 decoding 

	_utf8_decode = function (utftext) { 

	var string = ""; 

	var i = 0; 

	var c = c1 = c2 = 0; 

	while ( i < utftext.length ) { 

	c = utftext.charCodeAt(i); 

	if (c < 128) { 

	string += String.fromCharCode(c); 

	i++; 

	} else if((c > 191) && (c < 224)) { 

	c2 = utftext.charCodeAt(i+1); 

	string += String.fromCharCode(((c & 31) << 6) | (c2 & 63)); 

	i += 2; 

	} else { 

	c2 = utftext.charCodeAt(i+1); 

	c3 = utftext.charCodeAt(i+2); 

	string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)); 

	i += 3; 

	} 

	} 

	return string; 

	} 

} 

function cbi_d_checkvalue(target, ref) {
	var t = document.getElementById(target);
	var value;

	if (!t) {
		var tl = document.getElementsByName(target);

		if( tl.length > 0 && (tl[0].type == 'radio' || tl[0].type == 'checkbox'))
			for( var i = 0; i < tl.length; i++ )
				if( tl[i].checked ) {
					value = tl[i].value;
					break;
				}

		value = value ? value : "";
	} else if (!t.value) {
		value = "";
	} else {
		value = t.value;

		if (t.type == "checkbox") {
			value = t.checked ? value : "";
		}
	}

	return (value == ref)
}

function cbi_d_check(deps) {
	var reverse;
	var def = false;
	for (var i=0; i<deps.length; i++) {
		var istat = true;
		reverse = false;
		for (var j in deps[i]) {
			if (j == "!reverse") {
				reverse = true;
			} else if (j == "!default") {
				def = true;
				istat = false;
			} else {
				istat = (istat && cbi_d_checkvalue(j, deps[i][j]))
			}
		}
		if (istat) {
			return !reverse;
		}
	}
	return def;
}

function cbi_d_update() {
	var _wpa_key_zone1 = document.getElementById("_wpa_key_zone1");
	if (_wpa_key_zone1){
		if (_wpa_key_zone1.style.display == ""){
			document.getElementById("_wpa_key2").value = document.getElementById("_wpa_key1").value; 
			document.getElementById("_wpa_key2").className = document.getElementById("_wpa_key1").className;
			
		}else{
			document.getElementById("_wpa_key1").value = document.getElementById("_wpa_key2").value; 
			document.getElementById("_wpa_key1").className = document.getElementById("_wpa_key2").className;
		}
	}	
	
	var key1_zone1 = document.getElementById("cbid.wireless.key1.zone1");
	if (key1_zone1){
		if (key1_zone1.style.display == ""){
			document.getElementById("cbid.wireless.key1.2").value = document.getElementById("cbid.wireless.key1.1").value; 
			document.getElementById("cbid.wireless.key1.2").className = document.getElementById("cbid.wireless.key1.1").className;
			
		}else{
			document.getElementById("cbid.wireless.key1.1").value = document.getElementById("cbid.wireless.key1.2").value; 
			document.getElementById("cbid.wireless.key1.1").className = document.getElementById("cbid.wireless.key1.2").className;
		}
	}	
	
	var key2_zone1 = document.getElementById("cbid.wireless.key2.zone1");
	if (key2_zone1){
		if (key2_zone1.style.display == ""){
			document.getElementById("cbid.wireless.key2.2").value = document.getElementById("cbid.wireless.key2.1").value; 
			document.getElementById("cbid.wireless.key2.2").className = document.getElementById("cbid.wireless.key2.1").className;
			
		}else{
			document.getElementById("cbid.wireless.key2.1").value = document.getElementById("cbid.wireless.key2.2").value; 
			document.getElementById("cbid.wireless.key2.1").className = document.getElementById("cbid.wireless.key2.2").className;
		}
	}

	var key3_zone1 = document.getElementById("cbid.wireless.key3.zone1");
	if (key3_zone1){
		if (key3_zone1.style.display == ""){
			document.getElementById("cbid.wireless.key3.2").value = document.getElementById("cbid.wireless.key3.1").value; 
			document.getElementById("cbid.wireless.key3.2").className = document.getElementById("cbid.wireless.key3.1").className;
			
		}else{
			document.getElementById("cbid.wireless.key3.1").value = document.getElementById("cbid.wireless.key3.2").value; 
			document.getElementById("cbid.wireless.key3.1").className = document.getElementById("cbid.wireless.key3.2").className;
		}
	}

	var key4_zone1 = document.getElementById("cbid.wireless.key4.zone1");
	if (key4_zone1){
		if (key4_zone1.style.display == ""){
			document.getElementById("cbid.wireless.key4.2").value = document.getElementById("cbid.wireless.key4.1").value; 
			document.getElementById("cbid.wireless.key4.2").className = document.getElementById("cbid.wireless.key4.1").className;
			
		}else{
			document.getElementById("cbid.wireless.key4.1").value = document.getElementById("cbid.wireless.key4.2").value; 
			document.getElementById("cbid.wireless.key4.1").className = document.getElementById("cbid.wireless.key4.2").className;
		}
	}	
	
	
	var _key_zone1 = document.getElementById("_key_zone1");
	if (_key_zone1){
		if (_key_zone1.style.display == ""){
			document.getElementById("key2").value = document.getElementById("key1").value; 
			document.getElementById("key2").className = document.getElementById("key1").className;
			
		}else{
			document.getElementById("key1").value = document.getElementById("key2").value; 
			document.getElementById("key1").className = document.getElementById("key2").className;
		}
	}
	
	var state = false;
	for (var i=0; i<cbi_d.length; i++) {
		var entry = cbi_d[i];
		var next  = document.getElementById(entry.next)
		var node  = document.getElementById(entry.id)
		var parent = document.getElementById(entry.parent)

		if (node && node.parentNode && !cbi_d_check(entry.deps)) {
			node.parentNode.removeChild(node);
			state = true;
			if( entry.parent )
				cbi_c[entry.parent]--;
		} else if ((!node || !node.parentNode) && cbi_d_check(entry.deps)) {
			if (!next) {
				parent.appendChild(entry.node);
			} else {
				next.parentNode.insertBefore(entry.node, next);
			}
			state = true;
			if( entry.parent )
				cbi_c[entry.parent]++;
		}
	}

	if (entry && entry.parent) {
		if (!cbi_t_update())
			cbi_tag_last(parent);
	}

	if (state) {
		cbi_d_update();
	}
}

function cbi_bind(obj, type, callback, mode) {
	if (!obj.addEventListener) {
		obj.attachEvent('on' + type,
			function(){
				var e = window.event;

				if (!e.target && e.srcElement)
					e.target = e.srcElement;

				return !!callback(e);
			}
		);
	} else {
		obj.addEventListener(type, callback, !!mode);
	}
	return obj;
}

function cbi_combobox(id, values, def, man) {
	var selid = "cbi.combobox." + id;
	if (document.getElementById(selid)) {
		return
	}

	var obj = document.getElementById(id)
	var sel = document.createElement("select");
		sel.id = selid;
		sel.className = obj.className.replace(/cbi-input-text/, 'cbi-input-select');

	if (obj.nextSibling) {
		obj.parentNode.insertBefore(sel, obj.nextSibling);
	} else {
		obj.parentNode.appendChild(sel);
	}

	var dt = obj.getAttribute('cbi_datatype');
	var op = obj.getAttribute('cbi_optional');

	if (dt)
		cbi_validate_field(sel, op == 'true', dt);

	if (!values[obj.value]) {
		if (obj.value == "") {
			var optdef = document.createElement("option");
			optdef.value = "";
			optdef.appendChild(document.createTextNode(def));
			sel.appendChild(optdef);
		} else {
			var opt = document.createElement("option");
			opt.value = obj.value;
			opt.selected = "selected";
			opt.appendChild(document.createTextNode(obj.value));
			sel.appendChild(opt);
		}
	}

	for (var i in values) {
		var opt = document.createElement("option");
		opt.value = i;

		if (obj.value == i) {
			opt.selected = "selected";
		}

		opt.appendChild(document.createTextNode(values[i]));
		sel.appendChild(opt);
	}

	var optman = document.createElement("option");
	optman.value = "";
	optman.appendChild(document.createTextNode(man));
	sel.appendChild(optman);

	obj.style.display = "none";

	cbi_bind(sel, "change", function() {
		if (sel.selectedIndex == sel.options.length - 1) {
			obj.style.display = "inline";
			sel.parentNode.removeChild(sel);
			obj.focus();
		} else {
			obj.value = sel.options[sel.selectedIndex].value;
		}

		try {
			cbi_d_update();
		} catch (e) {
			//Do nothing
		}
	})

	// Retrigger validation in select
	sel.focus();
	sel.blur();
}

function cbi_combobox_init(id, values, def, man) {
	var obj = document.getElementById(id);
	cbi_bind(obj, "blur", function() {
		cbi_combobox(id, values, def, man)
	});
	cbi_combobox(id, values, def, man);
}

function cbi_filebrowser(id, url, defpath) {
	var field   = document.getElementById(id);
	var browser = window.open(
		url + ( field.value || defpath || '' ) + '?field=' + id,
		"luci_filebrowser", "width=300,height=400,left=100,top=200,scrollbars=yes"
	);

	browser.focus();
}

function cbi_browser_init(id, respath, url, defpath)
{
	function cbi_browser_btnclick(e) {
		cbi_filebrowser(id, url, defpath);
		return false;
	}

	var field = document.getElementById(id);

	var btn = document.createElement('img');
	btn.className = 'cbi-image-button';
	btn.src = respath + '/cbi/folder.gif';
	field.parentNode.insertBefore(btn, field.nextSibling);

	cbi_bind(btn, 'click', cbi_browser_btnclick);
}

function cbi_dynlist_init(name, respath, datatype, optional, choices)
{
	var input0 = document.getElementsByName(name)[0];
	var prefix = input0.name;
	var parent = input0.parentNode;
	var holder = input0.placeholder;

	var values;

	function cbi_dynlist_redraw(focus, add, del)
	{
		values = [ ];

		while (parent.firstChild)
		{
			//alert("111111");
			var n = parent.firstChild;
			var i = parseInt(n.index);
			//alert(i);
			//alert(del);
			if (i != del)
			{
				if (n.nodeName.toLowerCase() == 'input')
					values.push(n.value || '');
				else if (n.nodeName.toLowerCase() == 'select')
					values[values.length-1] = n.options[n.selectedIndex].value;
			}

			parent.removeChild(n);
		}

		// if (add >= 0)
		// {
			// focus = add+1;
			// values.splice(focus, 0, '');
		// }
		// else 
		if (values.length == 0)
		{
			focus = 0;
			values.push('');
		}
		var i;
		for (i = 0; i < values.length; i++)
		{
			var t = document.createElement('input');
				t.id = prefix + '.' + (i+1);
				t.name = prefix;
				t.value = values[i];
				t.type = 'text';
				t.index = i;
				t.style.marginBottom = '6px';
				t.className = 'text form-control';

			if (i == 0 && holder)
			{
				t.placeholder = holder;
			}

			var b = document.createElement('img');
			if((i+1) == values.length){
				var c = document.createElement('img');
			}
			
			b.src = respath + '/cbi/remove.gif';
			if(((i+1) == values.length) && (del != -2)){
				c.src = respath + '/cbi/add.gif';
				c.className = 'cbi-image-button';
			}
			
			b.className = 'cbi-image-button';

			parent.appendChild(t);
			parent.appendChild(b);
			if(((i+1) == values.length) && (del != -2)){
				parent.appendChild(c);
			}
			//parent.appendChild(t);
			parent.appendChild(document.createElement('br'));

			if (datatype)
			{
				cbi_validate_field(t.id, ((i+1) == values.length) || optional, datatype);
			}

			if (choices)
			{
				cbi_combobox_init(t.id, choices[0], '', choices[1]);
				t.nextSibling.index = i;

				// cbi_bind(t.nextSibling, 'keydown',  cbi_dynlist_keydown);
				// cbi_bind(t.nextSibling, 'keypress', cbi_dynlist_keypress);

				if (i == focus || -i == focus)
					t.nextSibling.focus();
			}
			else
			{
				// cbi_bind(t, 'keydown',  cbi_dynlist_keydown);
				// cbi_bind(t, 'keypress', cbi_dynlist_keypress);

				if (i == focus)
				{
					t.focus();
				}
				else if (-i == focus)
				{
					t.focus();

					/* force cursor to end */
					var v = t.value;
					t.value = ' '
					t.value = v;
				}
			}

			cbi_bind(b, 'click', cbi_dynlist_btnclick);
			if(((i+1) == values.length) && (del != -2)){
				cbi_bind(c, 'click', cbi_dynlist_btnclick);
			}
		}
		
		if(del == -2)
		{
			//alert(231232);
			var t = document.createElement('input');
				t.id = prefix + '.' + (i+1);
				t.name = prefix;
				t.value = "";
				t.type = 'text';
				t.index = i;
				//t.style.marginBottom = '6px';
				t.style.marginTop = '6x';
				t.className = 'text form-control';

			if (i == 0 && holder)
			{
				t.placeholder = holder;
			}

			var b = document.createElement('img');
			var c = document.createElement('img');
			
			b.src = respath + '/cbi/remove.gif';
			c.src = respath + '/cbi/add.gif';
			c.className = 'cbi-image-button';
			
			b.className = 'cbi-image-button';

			parent.appendChild(t);
			parent.appendChild(b);
			parent.appendChild(c);
			//parent.appendChild(t);
			parent.appendChild(document.createElement('br'));

			if (datatype)
			{
				cbi_validate_field(t.id, ((i+1) == values.length) || optional, datatype);
			}

			if (choices)
			{
				cbi_combobox_init(t.id, choices[0], '', choices[1]);
				t.nextSibling.index = i;

				// cbi_bind(t.nextSibling, 'keydown',  cbi_dynlist_keydown);
				// cbi_bind(t.nextSibling, 'keypress', cbi_dynlist_keypress);

				if (i == focus || -i == focus)
					t.nextSibling.focus();
			}
			else
			{
				focus = i;
				// cbi_bind(t, 'keydown',  cbi_dynlist_keydown);
				// cbi_bind(t, 'keypress', cbi_dynlist_keypress);

				if (i == focus)
				{
					t.focus();
				}
				else if (-i == focus)
				{
					t.focus();

					/* force cursor to end */
					var v = t.value;
					t.value = ' '
					t.value = v;
				}
			}

			cbi_bind(b, 'click', cbi_dynlist_btnclick);
			cbi_bind(c, 'click', cbi_dynlist_btnclick);
			
		}
	}

	function cbi_dynlist_keypress(ev)
	{
		ev = ev ? ev : window.event;

		var se = ev.target ? ev.target : ev.srcElement;

		if (se.nodeType == 3)
			se = se.parentNode;

		switch (ev.keyCode)
		{
			/* backspace, delete */
			case 8:
			case 46:
				if (se.value.length == 0)
				{
					if (ev.preventDefault)
						ev.preventDefault();

					return false;
				}

				return true;

			/* enter, arrow up, arrow down */
			case 13:
			case 38:
			case 40:
				if (ev.preventDefault)
					ev.preventDefault();

				return false;
		}

		return true;
	}

	function cbi_dynlist_keydown(ev)
	{
		ev = ev ? ev : window.event;

		var se = ev.target ? ev.target : ev.srcElement;

		if (se.nodeType == 3)
			se = se.parentNode;

		var prev = se.previousSibling;
		while (prev && prev.name != name)
			prev = prev.previousSibling;

		var next = se.nextSibling;
		while (next && next.name != name)
			next = next.nextSibling;

		/* advance one further in combobox case */
		if (next && next.nextSibling.name == name)
			next = next.nextSibling;

		switch (ev.keyCode)
		{
			/* backspace, delete */
			case 8:
			case 46:
				var del = (se.nodeName.toLowerCase() == 'select')
					? true : (se.value.length == 0);
				if (del)
				{
					if (ev.preventDefault)
						ev.preventDefault();

					var focus = se.index;
					if (ev.keyCode == 8)
						focus = -focus+1;

					cbi_dynlist_redraw(focus, -1, se.index);

					return false;
				}

				break;

			/* enter */
			case 13:
				cbi_dynlist_redraw(-1, se.index, -2);
				break;

			/* arrow up */
			case 38:
				if (prev)
					prev.focus();

				break;

			/* arrow down */
			case 40:
				if (next)
					next.focus();

				break;
		}

		return true;
	}

	function cbi_dynlist_btnclick(ev)
	{
		ev = ev ? ev : window.event;

		var se = ev.target ? ev.target : ev.srcElement;
		//alert("delete");
		if (se.src.indexOf('remove') > -1)
		{
		//alert("delete");
			se.previousSibling.value = '';

			cbi_dynlist_keydown({
				target:  se.previousSibling,
				keyCode: 8
			});
		}
		else
		{
		//alert("add");
			cbi_dynlist_keydown({
				target:  se.previousSibling,
				keyCode: 13
			});
		}

		return false;
	}

	cbi_dynlist_redraw(NaN, -1, -1);
}

//Hijacks the CBI form to send via XHR (requires Prototype)
function cbi_hijack_forms(layer, win, fail, load) {
	var forms = layer.getElementsByTagName('form');
	for (var i=0; i<forms.length; i++) {
		$(forms[i]).observe('submit', function(event) {
			// Prevent the form from also submitting the regular way
			event.stop();

			// Submit via XHR
			event.element().request({
				onSuccess: win,
				onFailure: fail
			});

			if (load) {
				load();
			}
		});
	}
}


function cbi_t_add(section, tab) {
	var t = document.getElementById('tab.' + section + '.' + tab);
	var c = document.getElementById('container.' + section + '.' + tab);

	if( t && c ) {
		cbi_t[section] = (cbi_t[section] || [ ]);
		cbi_t[section][tab] = { 'tab': t, 'container': c, 'cid': c.id };
	}
}

function cbi_t_switch(section, tab) {
	if( cbi_t[section] && cbi_t[section][tab] ) {
		var o = cbi_t[section][tab];
		var h = document.getElementById('tab.' + section);
		for( var tid in cbi_t[section] ) {
			var o2 = cbi_t[section][tid];
			if( o.tab.id != o2.tab.id ) {
				o2.tab.className = o2.tab.className.replace(/(^| )cbi-tab( |$)/, " cbi-tab-disabled ");
				o2.container.style.display = 'none';
			}
			else {
				if(h) h.value = tab;
				o2.tab.className = o2.tab.className.replace(/(^| )cbi-tab-disabled( |$)/, " cbi-tab ");
				o2.container.style.display = 'block';
			}
		}
	}
	return false
}

function cbi_t_update() {
	var hl_tabs = [ ];
	var updated = false;

	for( var sid in cbi_t )
		for( var tid in cbi_t[sid] )
		{
			if( cbi_c[cbi_t[sid][tid].cid] == 0 ) {
				cbi_t[sid][tid].tab.style.display = 'none';
			}
			else if( cbi_t[sid][tid].tab && cbi_t[sid][tid].tab.style.display == 'none' ) {
				cbi_t[sid][tid].tab.style.display = '';

				var t = cbi_t[sid][tid].tab;
				t.className += ' cbi-tab-highlighted';
				hl_tabs.push(t);
			}

			cbi_tag_last(cbi_t[sid][tid].container);
			updated = true;
		}

	if( hl_tabs.length > 0 )
		window.setTimeout(function() {
			for( var i = 0; i < hl_tabs.length; i++ )
				hl_tabs[i].className = hl_tabs[i].className.replace(/ cbi-tab-highlighted/g, '');
		}, 750);

	return updated;
}

function old_cbi_validate_form(form, errmsg)
{
/* if triggered by a section removal or addition, don't validate */
	if( form.cbi_state == 'add-section' || form.cbi_state == 'del-section' )
		return true;

	if( form.cbi_validators )
	{
		for( var i = 0; i < form.cbi_validators.length; i++ )
		{
			var validator = form.cbi_validators[i];
			if( !validator() && errmsg )
			{
				alert(errmsg);
				return false;
			}
		}
	}
    return true;
}

function cbi_validate_form(form, errmsg)
{
	/* if triggered by a section removal or addition, don't validate */
	if( form.cbi_state == 'add-section' || form.cbi_state == 'del-section' )
		return true;

	if( form.cbi_validators )
	{
		for( var i = 0; i < form.cbi_validators.length; i++ )
		{
			var validator = form.cbi_validators[i];
			if( !validator() && errmsg )
			{
				alert(errmsg);
				return false;
			}
		}
	}
		
	return true;
}

function cbi_validate_dmz_form(option, errmsg, errmsg1)
{
	dmz = document.getElementById("dmz_ip");
	dmz.className = dmz.className.replace(/ cbi-check-invalid/g, '');	
	if(dmz.value == "")
		return true;
	
	var dmz_ip = dmz.value;
	if(!document.getElementById("lan_ip").value)
		return true;
	var lan_ip = document.getElementById("lan_ip").value;
	if(!document.getElementById("netmask").value)
		return true;
	var netmask = document.getElementById("netmask").value;
	
    var res1 = [];
    var res2 = [];    
	dmz_ip = dmz_ip.split(".");    
	lan_ip = lan_ip.split(".");    
	netmask  = netmask.split(".");  
	if(dmz_ip.length != 4){
		//alert(errmsg);
		return false;
	}else if(!dmz_ip[3]){
		//alert(errmsg);
		return false;
	}
			
	for(var i = 0,ilen = dmz_ip.length; i < ilen ; i += 1)
	{        
		if(parseInt(dmz_ip[i])<1 || parseInt(dmz_ip[i])>255 || (dmz_ip[i].match(/^-?[0-9]+$/) == null)){
			//alert(errmsg);
			return false;
		}
		res1.push(parseInt(dmz_ip[i]) & parseInt(netmask[i]));        
		res2.push(parseInt(lan_ip[i]) & parseInt(netmask[i]));    
	}    
	// if(!check_data("")){
		// alert(errmsg);
		// return false;
	// }
	if(res1.join(".") != res2.join("."))
	{               
		dmz.className += ' cbi-check-invalid';
		//alert(errmsg1);        
		return false; 
	}
	return true;
}

function cbi_validate_lanip_form(option, errmsg, errmsg1)
{
	dmz = document.getElementById("dmz_ip");
	dmz.className = dmz.className.replace(/ cbi-check-invalid/g, '');	
	if(dmz.value == "")
		return true;
	
	var dmz_ip = dmz.value;
	if(!document.getElementById("lan_ip").value)
		return true;
	var lan_ip = document.getElementById("lan_ip").value;
	if(!document.getElementById("netmask").value)
		return true;
	var netmask = document.getElementById("netmask").value;
	
    var res1 = [];
    var res2 = [];    
	dmz_ip = dmz_ip.split(".");    
	lan_ip = lan_ip.split(".");    
	netmask  = netmask.split(".");  
	if(dmz_ip.length != 4){
		//alert(errmsg);
		return false;
	}else if(!dmz_ip[3]){
		//alert(errmsg);
		return false;
	}
			
	for(var i = 0,ilen = dmz_ip.length; i < ilen ; i += 1)
	{        
		if(parseInt(dmz_ip[i])<1 || parseInt(dmz_ip[i])>255 || (dmz_ip[i].match(/^-?[0-9]+$/) == null)){
			//alert(errmsg);
			return false;
		}
		res1.push(parseInt(dmz_ip[i]) & parseInt(netmask[i]));        
		res2.push(parseInt(lan_ip[i]) & parseInt(netmask[i]));    
	}    
	// if(!check_data("")){
		// alert(errmsg);
		// return false;
	// }
	if(res1.join(".") != res2.join("."))
	{               
		dmz.className += ' cbi-check-invalid';
		//alert(errmsg1);        
		return false; 
	}
	return true;
}

function cbi_validate_reset(form)
{
	window.setTimeout(
		function() { cbi_validate_form(form, null) }, 100
	);

	return true;
}

function cbi_validate_compile(code)
{
	var pos = 0;
	var esc = false;
	var depth = 0;
	var stack = [ ];

	code += ',';

	for (var i = 0; i < code.length; i++)
	{
		if (esc)
		{
			esc = false;
			continue;
		}

		switch (code.charCodeAt(i))
		{
		case 92:
			esc = true;
			break;

		case 40:
		case 44:
			if (depth <= 0)
			{
				if (pos < i)
				{
					var label = code.substring(pos, i);
						label = label.replace(/\\(.)/g, '$1');
						label = label.replace(/^[ \t]+/g, '');
						label = label.replace(/[ \t]+$/g, '');

					if (label && !isNaN(label))
					{
						stack.push(parseFloat(label));
					}
					else if (label.match(/^(['"]).*\1$/))
					{
						stack.push(label.replace(/^(['"])(.*)\1$/, '$2'));
					}
					else if (typeof cbi_validators[label] == 'function')
					{
						stack.push(cbi_validators[label]);
						stack.push(null);
					}
					else
					{
						throw "Syntax error, unhandled token '"+label+"'";
					}
				}
				pos = i+1;
			}
			depth += (code.charCodeAt(i) == 40);
			break;

		case 41:
			if (--depth <= 0)
			{
				if (typeof stack[stack.length-2] != 'function')
					throw "Syntax error, argument list follows non-function";

				stack[stack.length-1] =
					arguments.callee(code.substring(pos, i));

				pos = i+1;
			}
			break;
		}
	}

	return stack;
}

function cbi_validate_field(cbid, optional, type)
{
	var field = (typeof cbid == "string") ? document.getElementById(cbid) : cbid;
	var vstack; try { vstack = cbi_validate_compile(type); } catch(e) { };

	if (field && vstack && typeof vstack[0] == "function")
	{
		var validator = function()
		{
			// is not detached
			if( field.form )
			{
				field.className = field.className.replace(/ cbi-input-invalid/g, '');
				// validate value
				var value = (field.options && field.options.selectedIndex > -1)
					? field.options[field.options.selectedIndex].value : field.value;
                //modify by zxj 2016-8-11
				if (!(((value.length == 0) && optional) || vstack[0].call(value, vstack[1])))
				{
					// invalid
					field.className += ' cbi-input-invalid';
					//if(head && head.length != 0)
						//field.value = headname;
					return false;
				}
			}

			return true;
		};

		if( ! field.form.cbi_validators )
			field.form.cbi_validators = [ ];

		field.form.cbi_validators.push(validator);

		cbi_bind(field, "blur",  validator);
		cbi_bind(field, "keyup", validator);

		if (field.nodeName == 'SELECT')
		{
			cbi_bind(field, "change", validator);
			cbi_bind(field, "click",  validator);
		}

		field.setAttribute("cbi_validate", validator);
		field.setAttribute("cbi_datatype", type);
		field.setAttribute("cbi_optional", (!!optional).toString());

		var ret = validator();

		var fcbox = document.getElementById('cbi.combobox.' + field.id);
		if (fcbox)
			ret = cbi_validate_field(fcbox, optional, type);
		return ret;
	}
}

function cbi_validate_field_tips(cbid, optional, type, tips_cbid)
{
	var field = (typeof cbid == "string") ? document.getElementById(cbid) : cbid;
	var vstack; try { vstack = cbi_validate_compile(type); } catch(e) { };
	if (field && vstack && typeof vstack[0] == "function")
	{
		var validator = function()
		{
			// is not detached
			if( field.form )
			{
				var tips_field = document.getElementById(tips_cbid);
				if(field.className.indexOf("cbi-check-invalid") != -1) 
					field.className += ' text form-control';
				else
					field.className = 'text form-control';
				tips_field.style.display="none";
				// validate value
				var value = (field.options && field.options.selectedIndex > -1)
					? field.options[field.options.selectedIndex].value : field.value;
                //modify by zxj 2016-8-11
				if ((value.length == 0) && (!optional))
				{
					field.className += ' cbi-input-invalid';
					//if(head && head.length != 0)
						//field.value = headname;
					tips_field.style.display="";
					tips_field.style.color = "red";
					return false;
				}
				if (!(((value.length == 0) && optional) || vstack[0].call(value, vstack[1])))
				{
					// invalid
					field.className += ' cbi-input-invalid';
					//if(head && head.length != 0)
						//field.value = headname;
					tips_field.style.display="";
					tips_field.style.color = "red";
					return false;
				}
			}

			return true;
		};

		if( ! field.form.cbi_validators )
			field.form.cbi_validators = [ ];

		field.form.cbi_validators.push(validator);

		cbi_bind(field, "blur",  validator);
		cbi_bind(field, "keyup", validator);

		if (field.nodeName == 'SELECT')
		{
			cbi_bind(field, "change", validator);
			cbi_bind(field, "click",  validator);
		}

		field.setAttribute("cbi_validate", validator);
		field.setAttribute("cbi_datatype", type);
		field.setAttribute("cbi_optional", (!!optional).toString());

		validator();

		var fcbox = document.getElementById('cbi.combobox.' + field.id);
		if (fcbox)
			cbi_validate_field(fcbox, optional, type);
	}
}

function cbi_validate_field_head(cbid, optional, type, headname)
{
	var field = (typeof cbid == "string") ? document.getElementById(cbid) : cbid;
	var vstack; try { vstack = cbi_validate_compile(type); } catch(e) { };
	 head_name = headname;
	 //alert(headname);
	//var headname = document.getElementById(head).value;
	//var headname = "222222222222";
	if (field && vstack && typeof vstack[0] == "function")
	{
		var validator = function()
		{
			// is not detached
			if( field.form )
			{
				field.className = field.className.replace(/ cbi-input-invalid/g, '');
				// validate value
				var value = (field.options && field.options.selectedIndex > -1)
					? field.options[field.options.selectedIndex].value : field.value;
                //modify by zxj 2016-8-11
				if (!(((value.length == 0) && optional) || vstack[0].call(value, vstack[1])))
				{
					// invalid
					field.className += ' cbi-input-invalid';
					if( headname != "" && err_type == 1)
						field.value = headname;
					return false;
				}
			}

			return true;
		};

		if( ! field.form.cbi_validators )
			field.form.cbi_validators = [ ];

		field.form.cbi_validators.push(validator);

		cbi_bind(field, "blur",  validator);
		cbi_bind(field, "keyup", validator);

		if (field.nodeName == 'SELECT')
		{
			cbi_bind(field, "change", validator);
			cbi_bind(field, "click",  validator);
		}

		field.setAttribute("cbi_validate", validator);
		field.setAttribute("cbi_datatype", type);
		field.setAttribute("cbi_optional", (!!optional).toString());

		validator();

		var fcbox = document.getElementById('cbi.combobox.' + field.id);
		if (fcbox)
			cbi_validate_field(fcbox, optional, type);
	}
}

function cbi_row_swap(elem, up, store)
{
	var tr = elem.parentNode;
	while (tr && tr.nodeName.toLowerCase() != 'tr')
		tr = tr.parentNode;

	if (!tr)
		return false;

	var table = tr.parentNode;
	while (table && table.nodeName.toLowerCase() != 'table')
		table = table.parentNode;

	if (!table)
		return false;

	var s = up ? 3 : 2;
	var e = up ? table.rows.length : table.rows.length - 1;

	for (var idx = s; idx < e; idx++)
	{
		if (table.rows[idx] == tr)
		{
			if (up)
				tr.parentNode.insertBefore(table.rows[idx], table.rows[idx-1]);
			else
				tr.parentNode.insertBefore(table.rows[idx+1], table.rows[idx]);

			break;
		}
	}

	var ids = [ ];
	for (idx = 2; idx < table.rows.length; idx++)
	{
		table.rows[idx].className = table.rows[idx].className.replace(
			/cbi-rowstyle-[12]/, 'cbi-rowstyle-' + (1 + (idx % 2))
		);

		if (table.rows[idx].id && table.rows[idx].id.match(/-([^\-]+)$/) )
			ids.push(RegExp.$1);
	}

	var input = document.getElementById(store);
	if (input)
		input.value = ids.join(' ');

	return false;
}

function cbi_tag_last(container)
{
	var last;

	for (var i = 0; i < container.childNodes.length; i++)
	{
		var c = container.childNodes[i];
		if (c.nodeType == 1 && c.nodeName.toLowerCase() == 'div')
		{
			c.className = c.className.replace(/ cbi-value-last$/, '');
			last = c;
		}
	}

	if (last)
	{
		last.className += ' cbi-value-last';
	}
}

function isChina(s) 
{ 
	var patrn= /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi; 
	if (!patrn.exec(s)) 
	{ 
		return false; 
	}else{ 
		return true; 
	} 
}

function isNameLength(s, maxlength)
{
	var count = 0;
	for (var i = 0; i < s.length; i++)
	{
		if (isChina(s.charAt(i))){
			count = count + 3;
		}else{
			count = count + 1;
		}
	}

	if (count == 0 || count > maxlength)
	{
		return false;
	}else{
		return true;
	}
} 

function getUrlParameter(strUrl, pName)
{
  var reg = new RegExp("(^|\\?|&)"+ pName +"=([^&]*)(\\s|&|$)", "i");  
  if (reg.test(strUrl)) return RegExp.$2; return "";
};

//add by wuhj 2016-08-26
function Check_WiFi(ssid_obj,quickconfig){
    this.ssid = ssid_obj;
    this.flag = quickconfig;
}
Check_WiFi.prototype.checkSSID = function(errmsg){
    //var ssid = document.getElementById("ssid");
    var ssiderror = document.getElementById("ssiderrormsg");
    var ssiderrormsg = ssiderror ? ssiderror.value : errmsg;
    var ssid = this.ssid;
    if(ssid){
        //var header = document.getElementsByName("header");
        //var tail = document.getElementsByName("tail");
        //var headerLength = 0;
        //var tailLength = 0;
        //if(header.length > 0){
       //     headerLength = header[0].value.length;
       // }
       // if(tail.length > 0){
       //     tailLength = tail[0].value.length;
       // }
        var value = ssid.value;
		var ssidMaxlength = ssid.maxLength;
       // var maxlength = 0;
        ssid.className = ssid.className.replace(/ cbi-input-invalid/g, '');
        //var ssid_id = document.getElementsByName("ssid_id")[0].value;
        //maxlength = ssidMaxlength - headerLength - tailLength;
        if(isNameLength(value,ssidMaxlength)){
            //var error = value.match(/^[a-zA-Z0-9_\-]+$/);
            /*if(value.match(/^[a-zA-Z0-9_\-]+$/)){
               return true;
            }
            else{
                ssid.className += ' cbi-input-invalid';
                alert(ssiderrormsg);
                return false;
            }*/
			return true;
        }
        else{
            ssid.className += ' cbi-input-invalid';
            alert(ssiderrormsg);
            return false;
        }
    }
    else{
        alert(ssiderrormsg);
        return false;
    }
}
Check_WiFi.prototype.checkKey = function(errmsg){
    if(this.flag == 1){//quickconfig check
		var key = document.getElementById("key");
		var _key_zone1 = document.getElementById("_key_zone1");
		if (_key_zone1){
			if (_key_zone1.style.display == "")
			{
				var key1 = document.getElementById("key1");
				key1.className = key1.className.replace(/ cbi-input-invalid/g, '');
				key.value = key1.value;
				if (key.value == ""){
					key1.className += ' cbi-input-invalid';
					alert(errmsg);
					return false;			
				}
			}else{
				var key2 = document.getElementById("key2");
				key2.className = key2.className.replace(/ cbi-input-invalid/g, '');
				key.value = key2.value;	
				if (key.value == ""){
					key2.className += ' cbi-input-invalid';
					alert(errmsg);
					return false;			
				}		
			}			
		}
		return true;

    }
    else{//ssid check
        var encryption = document.getElementById("encryption");
        if(encryption){
            var encryption_value = encryption.value;
            if(encryption_value == "wep-open" || encryption_value == "wep-shared"){
				var key_array = new Array();
                var key1 = document.getElementById("cbid.wireless.key1");
				var key2 = document.getElementById("cbid.wireless.key2");
                var key3 = document.getElementById("cbid.wireless.key3");
                var key4 = document.getElementById("cbid.wireless.key4");
				
				var key1_zone1 = document.getElementById("cbid.wireless.key1.zone1");
				if (key1_zone1){
					if (key1_zone1.style.display == "")
					{
						var _wep_key1_1 = document.getElementById("cbid.wireless.key1.1");
						_wep_key1_1.className = _wep_key1_1.className.replace(/ cbi-input-invalid/g, '');
						key1.value = _wep_key1_1.value;
						key_array.push(_wep_key1_1);

					}else{
						var _wep_key1_2 = document.getElementById("cbid.wireless.key1.2");
						_wep_key1_2.className = _wep_key1_2.className.replace(/ cbi-input-invalid/g, '');
						key1.value = _wep_key1_2.value;	
						key_array.push(_wep_key1_2);
					}			
				}	
				
				var key2_zone1 = document.getElementById("cbid.wireless.key2.zone1");
				if (key2_zone1){
					if (key2_zone1.style.display == "")
					{
						var _wep_key2_1 = document.getElementById("cbid.wireless.key2.1");
						_wep_key2_1.className = _wep_key2_1.className.replace(/ cbi-input-invalid/g, '');
						key2.value = _wep_key2_1.value;
						key_array.push(_wep_key2_1);

					}else{
						var _wep_key2_2 = document.getElementById("cbid.wireless.key2.2");
						_wep_key2_2.className = _wep_key2_2.className.replace(/ cbi-input-invalid/g, '');
						key2.value = _wep_key2_2.value;	
						key_array.push(_wep_key2_2);
					}			
				}	
				
				
				var key3_zone1 = document.getElementById("cbid.wireless.key3.zone1");
				if (key3_zone1){
					if (key3_zone1.style.display == "")
					{
						var _wep_key3_1 = document.getElementById("cbid.wireless.key3.1");
						_wep_key3_1.className = _wep_key3_1.className.replace(/ cbi-input-invalid/g, '');
						key3.value = _wep_key3_1.value;
						key_array.push(_wep_key3_1);

					}else{
						var _wep_key3_2 = document.getElementById("cbid.wireless.key3.2");
						_wep_key3_2.className = _wep_key3_2.className.replace(/ cbi-input-invalid/g, '');
						key3.value = _wep_key3_2.value;	
						key_array.push(_wep_key3_2);
					}			
				}	
				
				var key4_zone1 = document.getElementById("cbid.wireless.key4.zone1");
				if (key4_zone1){
					if (key4_zone1.style.display == "")
					{
						var _wep_key4_1 = document.getElementById("cbid.wireless.key4.1");
						_wep_key4_1.className = _wep_key4_1.className.replace(/ cbi-input-invalid/g, '');
						key4.value = _wep_key4_1.value;
						key_array.push(_wep_key4_1);

					}else{
						var _wep_key4_2 = document.getElementById("cbid.wireless.key4.2");
						_wep_key4_2.className = _wep_key4_2.className.replace(/ cbi-input-invalid/g, '');
						key4.value = _wep_key4_2.value;	
						key_array.push(_wep_key4_2);
					}			
				}	
				
                var key_select = document.getElementById("_wep_key");
                for(var i=0;i<4;i++){
                    if (i+1 == key_select.value){
                        var obj = key_array[i];
                        if(obj.value == "" || obj.value.length == 0){
                            obj.className += ' cbi-input-invalid';
                            alert(errmsg);
                            return false;
                        }
                    }
                }
            }
            else if(encryption_value != "none"){
				var _wpa_key = document.getElementById("_wpa_key");
				var _wpa_key_zone1 = document.getElementById("_wpa_key_zone1");
				if (_wpa_key_zone1){
					if (_wpa_key_zone1.style.display == "")
					{
						var _wpa_key1 = document.getElementById("_wpa_key1");
						_wpa_key1.className = _wpa_key1.className.replace(/ cbi-input-invalid/g, '');
						_wpa_key.value = _wpa_key1.value;
						if (_wpa_key.value == ""){
							_wpa_key1.className += ' cbi-input-invalid';
							alert(errmsg);
							return false;			
						}
					}else{
						var _wpa_key2 = document.getElementById("_wpa_key2");
						_wpa_key2.className = _wpa_key2.className.replace(/ cbi-input-invalid/g, '');
						_wpa_key.value = _wpa_key2.value;	
						if (_wpa_key.value == ""){
							_wpa_key2.className += ' cbi-input-invalid';
							alert(errmsg);
							return false;			
						}		
					}			
				}				
            }
            return true;
        }
        else{
            alert(errmsg);
            return false;
        }
    }
}
function Check_WAN(name_obj,vlan_obj){
    this.name = name_obj;
    this.vlan = vlan_obj;
}
Check_WAN.prototype.checkName = function(errmsg){
    var kt_alias = this.name;
	kt_alias.className = kt_alias.className.replace(/ cbi-input-invalid/g, '');
    if (kt_alias.value == "" || kt_alias.value.length == 0 || !isNameLength(kt_alias.value, 32))
    {
        kt_alias.className += ' cbi-input-invalid';
        alert(errmsg);
        return false;
    }
    return true;
}
Check_WAN.prototype.checkVlan = function(errmsg){
    var vlan = this.vlan;
    if(vlan){
        var vlanerror = document.getElementById("vlanerrormsg");
        var vlanerrormsg = vlanerror ? vlanerror.value : errmsg;

        var value = vlan.value;
        vlan.className = vlan.className.replace(/ cbi-input-invalid/g, '');
        if(1*value < 1 || 1*value > 4093){
            vlan.className += ' cbi-input-invalid';
            alert(errmsg);
            return false;
        }
        var vlan_wan1 = document.getElementById("vlan_wan1");
        if (vlan_wan1) {
            //var error = vlan.value & vlan_wan.value;
            if (1*vlan.value == 1*vlan_wan1.value) {
                vlan.className += ' cbi-input-invalid';
                alert(vlanerrormsg);                
                return false;
            }        
        }
        var vlan_wan2 = document.getElementById("vlan_wan2");
        if (vlan_wan2) {
            //var error = vlan.value & vlan_wanbr1.value;
            if (1*vlan.value == 1*vlan_wan2.value) {
                vlan.className += ' cbi-input-invalid';
                alert(vlanerrormsg);
                return false;
            }
        }
        var vlan_wan3 = document.getElementById("vlan_wan3");
        if (vlan_wan3) {
            //var error = vlan.value & vlan_wanbr2.value;
            if (1*vlan.value == 1*vlan_wan3.value) {
                vlan.className += ' cbi-input-invalid';
                alert(vlanerrormsg);
                return false;
            }
        }
        var vlan_wan4 = document.getElementById("vlan_wan4");
        if (vlan_wan4) {
            //var error = vlan.value & vlan_wanbr3.value;
            if (1*vlan.value == 1*vlan_wan4.value) {
                vlan.className += ' cbi-input-invalid';
                alert(vlanerrormsg);
                return false;
            }
        }
    }    
    return true;
}
Check_WAN.prototype.checkBindPort = function(errmsg){
    var portError = document.getElementById("errormsg");
    var wanError = document.getElementById("wanerrormsg");
	var iface = document.getElementsByName("iface")[0];
	var portErrorMsg = portError ? portError.value : errmsg;
	var wanErrorMsg = wanError ? wanError.value : errmsg;
    var conflictBind = 0;
    if (iface) {
        //alert("not lan config " + section.value);
        var currentIfacePort = document.getElementsByName("network." + iface.value + ".ports")[0];
        //alert(current_section.value);
        //
        if (iface.value == "wan1" && 1 * currentIfacePort.value == 0) {
            alert(wanErrorMsg);
            return false;
        }
        var portWan1 = document.getElementById("port_1");
        var resolved;
        if (portWan1) {
            var error = currentIfacePort.value & portWan1.value;
            if (error != 0) {
                conflictBind |= 0x01;
                resolved = portWan1.value^(portWan1.value & currentIfacePort.value);
                var conflictPort = "0t";
                if(1 * resolved == 0){
                    document.getElementById("conflict_port_1").value = "1";
                }
                else{
                    for(var i = 0;i<4;i++){
                        var port = (resolved >> i) & 0x01;
                        if(1 * port != 0){
                            conflictPort = conflictPort + " " + (i+1);
                        }
                    }                    
                    document.getElementById("conflict_port_1").value = conflictPort;
                }
                //alert(porterrormsg);
                //return false;
            }        
        }
        var portWan2 = document.getElementById("port_2");
        if (portWan2) {
            var error = currentIfacePort.value & portWan2.value;
            if (error != 0) {
                conflictBind |= 0x02;
                resolved = portWan2.value^(portWan2.value & currentIfacePort.value);
                var conflictPort = "0t";
                if(1 * resolved == 0){
                    document.getElementById("conflict_port_2").value = "1";
                }
                else{
                    for(var i = 0;i<4;i++){
                        var port = (resolved >> i) & 0x01;
                        if(1 * port != 0){
                            conflictPort = conflictPort + " " + (i+1);
                        }
                    }                    
                    document.getElementById("conflict_port_2").value = conflictPort;
                }
                //alert(resolved);
                //alert(porterrormsg);
                //return false;
            }
        }
        var portWan3 = document.getElementById("port_3");
        if (portWan3) {
            var error = currentIfacePort.value & portWan3.value;
            if (error != 0) {
                conflictBind |= 0x04;
                resolved = portWan3.value^(portWan3.value & currentIfacePort.value);
                var conflictPort = "0t";
                if(1 * resolved == 0){
                    document.getElementById("conflict_port_3").value = "1";
                }
                else{
                    for(var i = 0;i<4;i++){
                        var port = (resolved >> i) & 0x01;
                        if(1 * port != 0){
                            conflictPort = conflictPort + " " + (i+1);
                        }
                    }                    
                    document.getElementById("conflict_port_3").value = conflictPort;
                }
               // alert(porterrormsg);
                //return false;
            }
        }
        var portWan4 = document.getElementById("port_4");
        if (portWan4) {
            var error = currentIfacePort.value & portWan4.value;
            if (error != 0) {
                conflictBind |= 0x08;
                resolved = portWan4.value^(portWan4.value & currentIfacePort.value);
                var conflictPort = "0t";
                if(1 * resolved == 0){
                    document.getElementById("conflict_port_4").value = "1";
                }
                else{
                    for(var i = 0;i<4;i++){
                        var port = (resolved >> i) & 0x01;
                        if(1 * port != 0){
                            conflictPort = conflictPort + " " + (i+1);
                        }
                    }                    
                    document.getElementById("conflict_port_4").value = conflictPort;
                }
                //alert(porterrormsg);
                //return false;
            }
        }
        if(conflictBind != 0){
            document.getElementsByName("bindport_changed")[0].value = "1";
            document.getElementsByName("force_bind_port")[0].value = conflictBind;
            //if(!confirm(portErrorMsg)){
            //   return false;
            //}
			alert(portErrorMsg);
        }
    }
    return true;
}
function Check_PPPOE(name_obj,vlan_obj){
    this.name = name_obj;
    this.vlan = vlan_obj;
}
Check_PPPOE.prototype = new Check_WAN();
Check_PPPOE.prototype.checkUsername = function(errmsg){
   var username = document.getElementById("username_pppoe");
   username.className = username.className.replace(/ cbi-input-invalid/g, '');
    if (username.value == "" || username.value.length == 0 || !isNameLength(username.value, 32)){
        username.className += ' cbi-input-invalid';
        alert(errmsg);
        return false;
    }
    return true;
}
Check_PPPOE.prototype.checkPassword = function(errmsg){
	var password = document.getElementById("password");
	var password_zone1 = document.getElementById("password_zone1");
	if (password_zone1){
		if (password_zone1.style.display == ""){
			var password1 = document.getElementById("password1");
			password1.className = password1.className.replace(/ cbi-input-invalid/g, '');
			password.value = password1.value;
			if (password.value == ""){
				password1.className += ' cbi-input-invalid';
				alert(errmsg);
				return false;			
			}
		}else{
			var password2 = document.getElementById("password2");
			password2.className = password2.className.replace(/ cbi-input-invalid/g, '');
			password.value = password2.value;	
			if (password2.value == ""){
				password2.className += ' cbi-input-invalid';
				alert(errmsg);
				return false;			
			}		
		}		
	}/*else{
		password.className = password.className.replace(/ cbi-input-invalid/g, '');
		if (password.value == "" || password.value.length == 0){
			password.className += ' cbi-input-invalid';
			alert(errmsg);
			return false;
		}
	}	*/

    return true;
}
function CheckDHCP(name_obj,vlan_obj){
    this.name = name_obj;
    this.vlan = vlan_obj;
}
CheckDHCP.prototype = new Check_WAN();
CheckDHCP.prototype.checkHostname = function(errmsg){
    var hostname = document.getElementById("hostname");
    hostname.className = hostname.className.replace(/ cbi-input-invalid/g, '');
    if (hostname.value == "" || hostname.value.length == 0){
        hostname.className += ' cbi-input-invalid';
        alert(errmsg);
        return false;
    }
    if(hostname.value.match(/^[a-zA-Z0-9]+$/)){//right
        return true;
    }
    else{//error
        hostname.className += ' cbi-input-invalid';
        alert(errmsg);
        return false;
    }
}

function CheckStatic(name_obj,vlan_obj){
    this.name = name_obj;
    this.vlan = vlan_obj;
}
CheckStatic.prototype = new Check_WAN();
CheckStatic.prototype.checkIP = function(errmsg){
    var ip = document.getElementById("ipaddr");
    if (ip.value == "" || ip.value.length == 0)
    {
        ip.className += ' cbi-input-invalid';
        alert(errmsg);
        return false;
    }
    return true;
}
CheckStatic.prototype.checkMask = function(errmsg){
    var mask = document.getElementById("mask");
    if (mask.value == "" || mask.value.length == 0)
    {
        mask.className += ' cbi-input-invalid';
        alert(errmsg);
        return false;
    }
    return true;
}
CheckStatic.prototype.checkGateway = function(errmsg){
    var gateway = document.getElementById("gateway");
    if (gateway.value == "" || gateway.value.length == 0)
    {
        gateway.className += ' cbi-input-invalid';
        alert(errmsg);
        return false;
    }
    return true;
}

String.prototype.serialize = function()
{
	var o = this;
	switch(typeof(o))
	{
		case 'object':
			// null
			if( o == null )
			{
				return 'null';
			}

			// array
			else if( o.length )
			{
				var i, s = '';

				for( var i = 0; i < o.length; i++ )
					s += (s ? ', ' : '') + String.serialize(o[i]);

				return '[ ' + s + ' ]';
			}

			// object
			else
			{
				var k, s = '';

				for( k in o )
					s += (s ? ', ' : '') + k + ': ' + String.serialize(o[k]);

				return '{ ' + s + ' }';
			}

			//break;

		case 'string':
			// complex string
			if( o.match(/[^a-zA-Z0-9_,.: -]/) )
				return 'decodeURIComponent("' + encodeURIComponent(o) + '")';

			// simple string
			else
				return '"' + o + '"';

			//break;

		default:
			return o.toString();
	}
}

String.prototype.format = function()
{
	if (!RegExp)
		return;

	var html_esc = [/&/g, '&#38;', /"/g, '&#34;', /'/g, '&#39;', /</g, '&#60;', />/g, '&#62;'];
	var quot_esc = [/"/g, '&#34;', /'/g, '&#39;'];

	function esc(s, r) {
		for( var i = 0; i < r.length; i += 2 )
			s = s.replace(r[i], r[i+1]);
		return s;
	}

	var str = this;
	var out = '';
	var re = /^(([^%]*)%('.|0|\x20)?(-)?(\d+)?(\.\d+)?(%|b|c|d|u|f|o|s|x|X|q|h|j|t|m))/;
	var a = b = [], numSubstitutions = 0, numMatches = 0;

	while( a = re.exec(str) )
	{
		var m = a[1];
		var leftpart = a[2], pPad = a[3], pJustify = a[4], pMinLength = a[5];
		var pPrecision = a[6], pType = a[7];

		numMatches++;

		if (pType == '%')
		{
			subst = '%';
		}
		else
		{
			if (numSubstitutions < arguments.length)
			{
				var param = arguments[numSubstitutions++];

				var pad = '';
				if (pPad && pPad.substr(0,1) == "'")
					pad = leftpart.substr(1,1);
				else if (pPad)
					pad = pPad;

				var justifyRight = true;
				if (pJustify && pJustify === "-")
					justifyRight = false;

				var minLength = -1;
				if (pMinLength)
					minLength = parseInt(pMinLength);

				var precision = -1;
				if (pPrecision && pType == 'f')
					precision = parseInt(pPrecision.substring(1));

				var subst = param;

				switch(pType)
				{
					case 'b':
						subst = (parseInt(param) || 0).toString(2);
						break;

					case 'c':
						subst = String.fromCharCode(parseInt(param) || 0);
						break;

					case 'd':
						subst = (parseInt(param) || 0);
						break;

					case 'u':
						subst = Math.abs(parseInt(param) || 0);
						break;

					case 'f':
						subst = (precision > -1)
							? ((parseFloat(param) || 0.0)).toFixed(precision)
							: (parseFloat(param) || 0.0);
						break;

					case 'o':
						subst = (parseInt(param) || 0).toString(8);
						break;

					case 's':
						subst = param;
						break;

					case 'x':
						subst = ('' + (parseInt(param) || 0).toString(16)).toLowerCase();
						break;

					case 'X':
						subst = ('' + (parseInt(param) || 0).toString(16)).toUpperCase();
						break;

					case 'h':
						subst = esc(param, html_esc);
						break;

					case 'q':
						subst = esc(param, quot_esc);
						break;

					case 'j':
						subst = String.serialize(param);
						break;

					case 't':
						var td = 0;
						var th = 0;
						var tm = 0;
						var ts = (param || 0);

						if (ts > 60) {
							tm = Math.floor(ts / 60);
							ts = (ts % 60);
						}

						if (tm > 60) {
							th = Math.floor(tm / 60);
							tm = (tm % 60);
						}

						if (th > 24) {
							td = Math.floor(th / 24);
							th = (th % 24);
						}

						subst = (td > 0)
							? String.format('%dd %dh %dm %ds', td, th, tm, ts)
							: String.format('%dh %dm %ds', th, tm, ts);

						break;

					case 'm':
						var mf = pMinLength ? parseInt(pMinLength) : 1000;
						var pr = pPrecision ? Math.floor(10*parseFloat('0'+pPrecision)) : 2;

						var i = 0;
						var val = parseFloat(param || 0);
						var units = [ '', 'K', 'M', 'G', 'T', 'P', 'E' ];

						for (i = 0; (i < units.length) && (val > mf); i++)
							val /= mf;

						subst = val.toFixed(pr) + ' ' + units[i];
						break;
				}
			}
		}

		out += leftpart + subst;
		str = str.substr(m.length);
	}

	return out + str;
}

String.prototype.nobr = function()
{
	return this.replace(/[\s\n]+/g, '&#160;');
}

String.serialize = function()
{
	var a = [ ];
	for (var i = 1; i < arguments.length; i++)
		a.push(arguments[i]);
	return ''.serialize.apply(arguments[0], a);
}

String.format = function()
{
	var a = [ ];
	for (var i = 1; i < arguments.length; i++)
		a.push(arguments[i]);
	return ''.format.apply(arguments[0], a);
}

String.nobr = function()
{
	var a = [ ];
	for (var i = 1; i < arguments.length; i++)
		a.push(arguments[i]);
	return ''.nobr.apply(arguments[0], a);
}

function check_data(msg){
    if(($("input.cbi-input-invalid").length!=0)||($("input.cbi-check-invalid").length!=0)){
		if(msg != ""){
			//alert(msg);
			my_alert(msg);
		}
        return false;
    }else{
        return true;
    }
}

function get_str_len(str){
	var code = -1;
	var len = 0;
	var r_len = 0;
	var i = 0;
	
	if("" == str){
		return 0;
	}
	len = str.length;
	for(i=0;i<len;i++){
		code = str.charCodeAt(i);
		if((code>=0) && (code <= 128)){
			r_len += 1;
		}else {
			r_len += 3;
		}
	}
	return r_len;
}

function cbi_validate_field_ip(cbid,cbid1,msg)
{	
	var dmz = document.getElementById(cbid);
	var mask = document.getElementById(cbid1);
	mask.className = mask.className.replace(/ cbi-check-invalid/g, '');
	if((dmz.className == "text cbi-input-invalid") || (mask.className == "text cbi-input-invalid"))
		return false;
	//alert(dmz.className);
	//alert(cbid);
	//alert(cbid1);
	if((dmz.value == "") || (mask.value == ""))
		return false;

	var dmz_ip = dmz.value;
	var netmask = mask.value;
	var netmask1 = "255.255.255.255";
	//alert(dmz_ip);
	//alert(netmask);
	//alert(netmask1);
	var res1 = [];
	var res2 = [];    
	dmz_ip = dmz_ip.split(".");    
	netmask  = netmask.split(".");    
	netmask1  = netmask1.split(".");    
	for(var i = 0,ilen = dmz_ip.length; i < ilen ; i += 1)
	{        
		res1.push(parseInt(dmz_ip[i]) & parseInt(netmask[i]));        
		res2.push(parseInt(dmz_ip[i]) & parseInt(netmask1[i]));    
	}    
	if(res1.join(".") != res2.join("."))
	{               
		mask.className += " cbi-check-invalid"
		alert(msg);
		return false; 
	}else{
		return true;
	}

}

function cbi_validate_field_Vserver_ip(cbid,msg)
{
	var dmz = document.getElementById(cbid);
	dmz.className = dmz.className.replace(/ cbi-check-invalid/g, '');
	if((dmz.className == "text cbi-input-invalid"))
		return false;
	if((dmz.value == ""))
		return false;
	var dmz_ip = dmz.value;
	if(!document.getElementById("lan_ip").value)
		return true;
	var lan_ip = document.getElementById("lan_ip").value;
	if(!document.getElementById("netmask").value)
		return true;
	var netmask = document.getElementById("netmask").value;
	
    var res1 = [];
    var res2 = [];    
	dmz_ip = dmz_ip.split(".");    
	lan_ip = lan_ip.split(".");    
	netmask  = netmask.split(".");    
	for(var i = 0,ilen = dmz_ip.length; i < ilen ; i += 1)
	{        
		res1.push(parseInt(dmz_ip[i]) & parseInt(netmask[i]));        
		res2.push(parseInt(lan_ip[i]) & parseInt(netmask[i]));    
	}    
	if(res1.join(".") != res2.join("."))
	{               
		dmz.className += ' cbi-check-invalid';
		alert(msg);        
		return false; 
	}
	return true;
}

function cbi_validate_field_dmz(errmsg,errmsg1)
{
	if(!check_data("")){
		alert(errmsg);
		return false;
	}
	
	dmz = document.getElementById("dmz_ip");
	if(dmz.value == "")
		return true;
	
	var dmz = document.getElementById(cbid);
	var mask = document.getElementById(cbid1);
	if((dmz.className == "text cbi-input-invalid") || (mask.className == "text cbi-input-invalid"))
		return false;
	//alert(dmz.className);
	//alert(cbid);
	//alert(cbid1);
	var dmz_ip = dmz.value;
	var netmask = mask.value;
	var netmask1 = "255.255.255.255";
	//alert(dmz_ip);
	//alert(netmask);
	//alert(netmask1);
	var res1 = [];
	var res2 = [];    
	dmz_ip = dmz_ip.split(".");    
	netmask  = netmask.split(".");    
	netmask1  = netmask1.split(".");    
	for(var i = 0,ilen = dmz_ip.length; i < ilen ; i += 1)
	{        
		res1.push(parseInt(dmz_ip[i]) & parseInt(netmask[i]));        
		res2.push(parseInt(dmz_ip[i]) & parseInt(netmask1[i]));    
	}    
	if(res1.join(".") != res2.join("."))
	{               
		mask.value = ""
		alert(msg);
		return false; 
	}else{
		return true;
	}

}

function cbi_check_data_rang(cbid,min,max,name)
{
	var field = document.getElementById(cbid);
	if((field.className == "text cbi-input-invalid"))
		return false;

	if (field)
	{
		field.className = "text";

		var value =  field.value;
		if(((1*value)<(1*min))||((1*value)>(1*max)))
		{
			field.className += ' cbi-input-invalid';
			field.className += ' form-control';
			return false;
		}
	};
	field.className = "text form-control";

	return true;
	
}


function isNameLength1(str, maxlength)
{
	var code = -1;
	var len = 0;
	var r_len = 0;
	var i = 0;
	
	len = str.length;
	for(i=0;i<len;i++){
		code = str.charCodeAt(i);
		if((code>=0) && (code <= 128)){
			r_len += 1;
		}else {
			r_len += 3;
		}
	}
	//alert(r_len);
	if (r_len == 0 || r_len > maxlength)
	{
		return false;
	}else{
		return true;
	}
} 

function check_quick_wan(form, errmsg){
    //if(old_cbi_validate_form(form,errmsg) == false){
     //   return false;
    //}
	alert(111111111);
	//return false;
    //check wan
    var proto = document.getElementById("proto").value;
    var nameObj = document.getElementById("kt_alias");
    var vlanObj = document.getElementById("vlan");
    switch(proto){
        case "pppoe":
		   var username = document.getElementById("username");
		   username.className = username.className.replace(/ cbi-input-invalid/g, '');
			if (username.value == "" || username.value.length == 0 || !isNameLength1(username.value, 32)){
				username.className += ' cbi-input-invalid';
				alert(errmsg);
				return false;
			}
			var password = document.getElementById("key");
			var password_zone1 = document.getElementById("usepwd");
			if (password_zone1){
				if (password_zone1.style.display == ""){
					var password1 = document.getElementById("key1");
					password1.className = password1.className.replace(/ cbi-input-invalid/g, '');
					password.value = password1.value;
					if (password.value == ""){
						password1.className += ' cbi-input-invalid';
						alert(errmsg);
						return false;			
					}
				}else{
					var password2 = document.getElementById("key2");
					password2.className = password2.className.replace(/ cbi-input-invalid/g, '');
					password.value = password2.value;	
					if (password2.value == ""){
						password2.className += ' cbi-input-invalid';
						alert(errmsg);
						return false;			
					}		
				}		
			}
            break;
        case "dhcp":
            var check_dhcp = new CheckDHCP(nameObj,vlanObj);
            if(!check_dhcp.checkVlan(errmsg)){
                return false;
            }
            if(!check_dhcp.checkBindPort(errmsg)){
                return false;
            }
            break;
        case "static":
            var check_static = new CheckStatic(nameObj,vlanObj);
            if(!check_static.checkIP(errmsg)){
                return false;
            }
            if(!check_static.checkMask(errmsg)){
                return false;
            }
            if(!check_static.checkGateway(errmsg)){
                return false;
            }
            if(!check_static.checkVlan(errmsg)){
                return false;
            }
            if(!check_static.checkBindPort(errmsg)){
                return false;
            }
            break;
        case "none":
        default:
            var check_wan = new Check_WAN(nameObj,vlanObj);
            if(!check_wan.checkVlan(errmsg)){
                return false;
            }
            if(!check_wan.checkBindPort(errmsg)){
                return false;
            }
            break;
    }
    //check wifi
	alert(222222);
	return false
}

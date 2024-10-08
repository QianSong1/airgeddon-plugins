#!/usr/bin/env bash

#Global shellcheck disabled warnings
#shellcheck disable=SC2034,SC2154

#Start modifying below this line. You can safely remove comments but be pretty sure to know what you are doing!

###### QUICK SUMMARY ######

#How it works? This system allows to modify functionality of airgeddon to create a custom behavior based on a system of prehooking, overriding and posthooking functions
#This can be done without any modification in the main script. All you need is to do modifications at plugins directory
#Ready? Three simple steps!
#1. Set some generic vars and some requirements vars to set some validations
#2. Check airgeddon main script code and choose a function to work with (you need to be sure which function is doing the part you want to modify. Debug mode can help here)
#3. Code your own stuff. You can set as much functions to prehook, override or posthook as you want. You can also create your own functions to be called from a hooked function

#Bear in mind that this plugin template is ignored by airgeddon and is not executed because of its special filename which is an exception for the system
#To use this template just rename the file to any other filename keeping .sh extension
#Example: my_super_pr0_plugin.sh
#If you have any doubt about plugins development check our Wiki: https://github.com/v1s1t0r1sh3r3/airgeddon/wiki/Plugins%20Development

###### GENERIC PLUGIN VARS ######

plugin_name="Https Web Server"
plugin_description="Enable ssl for web server"
plugin_author="QianSong1"

#Enabled 1 / Disabled 0 - Set this plugin as enabled - Default value 1
plugin_enabled=1

###### PLUGIN REQUIREMENTS ######

#Set airgeddon versions to apply this plugin (leave blank to set no limits, minimum version recommended is 10.0 on which plugins feature was added)
plugin_minimum_ag_affected_version="10.0"
plugin_maximum_ag_affected_version=""

#Set only one element in the array "*" to affect all distros, otherwise add them one by one with the name which airgeddon uses for that distro (examples "BlackArch", "Parrot", "Kali")
plugin_distros_supported=("*")

###################### USER CONFIG VARS ######################
# NOTE: init enable_ssl_web value ensure clean up function won't show any wornning
enable_ssl_web=0
################## END OF USER CONFIG VARS ###################

###### CUSTOM FUNCTIONS ######

#Just create here new custom functions if they are needed
#They can be called from the plugin itself. They are different than the "hooked" functions (explained on the next section)

###### FUNCTION HOOKING: OVERRIDE ######

#To override airgeddon functions, just define them following this nomenclature name: <plugin_short_name>_override_<function_name>
#plugin_short_name: This is the name of the plugin filename without extension (.sh)
#function_name: This is the name of the airgeddon function you want to rewrite with new content

#Overridden function example
#This will replace an existing function in main airgeddon script to change its behavior in order to execute this content instead of the original
#In this template the existing function is called "somefunction" but of course this is not existing in airgeddon. You should replace "somefunction" with the real name of the function you want to override
#Remember also to modify the starting part of the function "plugin_template" to set your plugin short name (filename without .sh) "my_super_pr0_plugin" if you renamed this template file to my_super_pr0_plugin.sh
#Example name: function my_super_pr0_plugin_override_set_chipset() { <- this will override the content of the chosen function
function https_web_server_override_et_prerequisites() {

	debug_print

	if [ "${retry_handshake_capture}" -eq 1 ]; then
		return
	fi

	clear
	if [ -n "${enterprise_mode}" ]; then
		current_menu="enterprise_attacks_menu"
		case ${enterprise_mode} in
			"smooth")
				language_strings "${language}" 522 "title"
			;;
			"noisy")
				language_strings "${language}" 523 "title"
			;;
		esac
	else
		current_menu="evil_twin_attacks_menu"
		case ${et_mode} in
			"et_onlyap")
				language_strings "${language}" 270 "title"
			;;
			"et_sniffing")
				language_strings "${language}" 291 "title"
			;;
			"et_sniffing_sslstrip2")
				language_strings "${language}" 292 "title"
			;;
			"et_sniffing_sslstrip2_beef")
				language_strings "${language}" 397 "title"
			;;
			"et_captive_portal")
				language_strings "${language}" 293 "title"
			;;
		esac
	fi

	print_iface_selected
	if [ -n "${enterprise_mode}" ]; then
		print_all_target_vars
	else
		print_et_target_vars
		print_iface_internet_selected
	fi

	if [ "${dos_pursuit_mode}" -eq 1 ]; then
		language_strings "${language}" 512 "blue"
	fi
	print_hint ${current_menu}
	echo

	if [ "${et_mode}" != "et_captive_portal" ]; then
		language_strings "${language}" 275 "blue"
		echo
		language_strings "${language}" 276 "yellow"
		print_simple_separator
		ask_yesno 277 "yes"
		if [ "${yesno}" = "n" ]; then
			if [ -n "${enterprise_mode}" ]; then
				return_to_enterprise_main_menu=1
			else
				return_to_et_main_menu=1
				return_to_et_main_menu_from_beef=1
			fi
			return
		fi
	fi

	if [[ -z "${mac_spoofing_desired}" ]] || [[ "${mac_spoofing_desired}" -eq 0 ]]; then
		ask_yesno 419 "no"
		if [ "${yesno}" = "y" ]; then
			mac_spoofing_desired=1
		fi
	fi

	if [ "${et_mode}" = "et_captive_portal" ]; then

		language_strings "${language}" 315 "yellow"
		echo
		language_strings "${language}" 286 "pink"
		print_simple_separator
		if [ "${retrying_handshake_capture}" -eq 0 ]; then
			ask_yesno 321 "no"
		fi

		local msg_mode
		msg_mode="showing_msgs_checking"

		if [[ "${yesno}" = "n" ]] || [[ "${retrying_handshake_capture}" -eq 1 ]]; then
			msg_mode="silent"
			capture_handshake_evil_twin
			case "$?" in
				"2")
					retry_handshake_capture=1
					return
				;;
				"1")
					return_to_et_main_menu=1
					return
				;;
			esac
		else
			ask_et_handshake_file
		fi
		retry_handshake_capture=0
		retrying_handshake_capture=0

		if ! check_bssid_in_captured_file "${et_handshake}" "${msg_mode}" "also_pmkid"; then
			return_to_et_main_menu=1
			return
		fi

		echo
		language_strings "${language}" 28 "blue"

		echo
		language_strings "${language}" 26 "blue"

		echo
		language_strings "${language}" 31 "blue"
	else
		if ! ask_bssid; then
			if [ -n "${enterprise_mode}" ]; then
				return_to_enterprise_main_menu=1
			else
				return_to_et_main_menu=1
				return_to_et_main_menu_from_beef=1
			fi
			return
		fi

		if ! ask_channel; then
			if [ -n "${enterprise_mode}" ]; then
				return_to_enterprise_main_menu=1
			else
				return_to_et_main_menu=1
			fi
			return
		else
			if [[ "${dos_pursuit_mode}" -eq 1 ]] && [[ -n "${channel}" ]] && [[ "${channel}" -gt 14 ]] && [[ "${interfaces_band_info['secondary_wifi_interface','5Ghz_allowed']}" -eq 0 ]]; then
				echo
				language_strings "${language}" 394 "red"
				language_strings "${language}" 115 "read"
				if [ -n "${enterprise_mode}" ]; then
					return_to_enterprise_main_menu=1
				else
					return_to_et_main_menu=1
				fi
				return
			fi
		fi
		ask_essid "noverify"
	fi

	if [ -n "${enterprise_mode}" ]; then
		manage_enterprise_log
	elif [ "${et_mode}" = "et_sniffing" ]; then
		manage_ettercap_log
	elif [[ "${et_mode}" = "et_sniffing_sslstrip2" ]] || [[ "${et_mode}" = "et_sniffing_sslstrip2_beef" ]]; then
		manage_bettercap_log
	elif [ "${et_mode}" = "et_captive_portal" ]; then
		manage_captive_portal_log
		language_strings "${language}" 115 "read"
		if set_captive_portal_language; then
			language_strings "${language}" 319 "blue"
			ask_yesno 710 "no"
			if [ "${yesno}" = "y" ]; then
				advanced_captive_portal=1
			fi
			ask_yesno "https_web_server_text_1" "no"
			if [ "${yesno}" = "y" ]; then
				enable_ssl_web=1
				create_ssl_cert
			else
				enable_ssl_web=0
			fi

			prepare_captive_portal_data

			echo
			language_strings "${language}" 711 "blue"
		else
			return
		fi
	fi

	if [ -n "${enterprise_mode}" ]; then
		return_to_enterprise_main_menu=1
	else
		return_to_et_main_menu=1
		return_to_et_main_menu_from_beef=1
	fi

	if [ "${is_docker}" -eq 1 ]; then
		echo
		if [ -n "${enterprise_mode}" ]; then
			language_strings "${language}" 528 "pink"
		else
			language_strings "${language}" 420 "pink"
		fi
		language_strings "${language}" 115 "read"
	fi

	region_check

	if [ "${channel}" -gt 14 ]; then
		echo
		if [ "${country_code}" = "00" ]; then
			language_strings "${language}" 706 "blue"
		else
			language_strings "${language}" 392 "blue"
		fi
	fi

	echo
	language_strings "${language}" 296 "yellow"
	language_strings "${language}" 115 "read"
	prepare_et_interface

	if [ -n "${enterprise_mode}" ]; then
		exec_enterprise_attack
	else
		case ${et_mode} in
			"et_onlyap")
				exec_et_onlyap_attack
			;;
			"et_sniffing")
				exec_et_sniffing_attack
			;;
			"et_sniffing_sslstrip2")
				exec_et_sniffing_sslstrip2_attack
			;;
			"et_sniffing_sslstrip2_beef")
				exec_et_sniffing_sslstrip2_beef_attack
			;;
			"et_captive_portal")
				exec_et_captive_portal_attack
			;;
		esac
	fi
}

function create_ssl_cert() {

	debug_print

	rm -rf "${tmpdir}ag.server.pem" > /dev/null 2>&1

	xterm -bg "#000000" -fg "#CCCCCC" \
	-title "Generating Self-Signed SSL Certificate" -e openssl req \
	-subj '/CN=captive.gateway.lan/O=CaptivePortal/OU=Networking/C=US' \
	-new -newkey rsa:2048 -days 365 -nodes -x509 \
	-keyout "${tmpdir}ag.server.pem" \
	-out "${tmpdir}ag.server.pem"
	# Details -> https://www.openssl.org/docs/manmaster/apps/openssl.html
	chmod 400 "${tmpdir}ag.server.pem"
}

function https_web_server_override_set_webserver_config() {

	debug_print

	rm -rf "${tmpdir}${webserver_file}" > /dev/null 2>&1

	if [ "${enable_ssl_web}" -eq 1 ]; then
		{
		echo -e "server.document-root = \"${tmpdir}${webdir}\"\n"
		echo -e "server.modules = ("
		echo -e "\"mod_auth\","
		echo -e "\"mod_cgi\","
		echo -e "\"mod_redirect\","
		echo -e "\"mod_openssl\""
		echo -e ")\n"
		echo -e "\$HTTP[\"host\"] != \"captive.gateway.lan\" {"
		echo -e "url.redirect = ( \"^/(.*)$\" => \"http://captive.gateway.lan/\")"
		echo -e "url.redirect-code = 302"
		echo -e "}"
		echo -e "\$HTTP[\"host\"] =~ \"gstatic.com\" {"
		echo -e "url.redirect = ( \"^/(.*)$\" => \"http://connectivitycheck.google.com/\")"
		echo -e "url.redirect-code = 302"
		echo -e "}"
		echo -e "\$HTTP[\"host\"] =~ \"captive.apple.com\" {"
		echo -e "url.redirect = ( \"^/(.*)$\" => \"http://connectivitycheck.apple.com/\")"
		echo -e "url.redirect-code = 302"
		echo -e "}"
		echo -e "\$HTTP[\"host\"] =~ \"msftconnecttest.com\" {"
		echo -e "url.redirect = ( \"^/(.*)$\" => \"http://connectivitycheck.microsoft.com/\")"
		echo -e "url.redirect-code = 302"
		echo -e "}"
		echo -e "\$HTTP[\"host\"] =~ \"msftncsi.com\" {"
		echo -e "url.redirect = ( \"^/(.*)$\" => \"http://connectivitycheck.microsoft.com/\")"
		echo -e "url.redirect-code = 302"
		echo -e "}"
		echo -e "server.port = ${www_port}\n"
		echo -e "index-file.names = ( \"${indexfile}\" )\n"
		echo -e "server.error-handler-404 = \"/\"\n"
		echo -e "mimetype.assign = ("
		echo -e "\".css\" => \"text/css\","
		echo -e "\".js\" => \"text/javascript\""
		echo -e ")\n"
		echo -e "cgi.assign = ( \".htm\" => \"/bin/bash\" )\n"
		echo -e "\$SERVER[\"socket\"] == \":443\" {"
		echo -e "ssl.engine = \"enable\""
		echo -e "ssl.pemfile = \"${tmpdir}ag.server.pem\""
		echo -e "}"
		} >> "${tmpdir}${webserver_file}"
	else
		{
		echo -e "server.document-root = \"${tmpdir}${webdir}\"\n"
		echo -e "server.modules = ("
		echo -e "\"mod_auth\","
		echo -e "\"mod_cgi\","
		echo -e "\"mod_redirect\""
		echo -e ")\n"
		echo -e "\$HTTP[\"host\"] =~ \"(.*)\" {"
		echo -e "url.redirect = ( \"^/index.htm$\" => \"/\")"
		echo -e "url.redirect-code = 302"
		echo -e "}"
		echo -e "\$HTTP[\"host\"] =~ \"gstatic.com\" {"
		echo -e "url.redirect = ( \"^/(.*)$\" => \"http://connectivitycheck.google.com/\")"
		echo -e "url.redirect-code = 302"
		echo -e "}"
		echo -e "\$HTTP[\"host\"] =~ \"captive.apple.com\" {"
		echo -e "url.redirect = ( \"^/(.*)$\" => \"http://connectivitycheck.apple.com/\")"
		echo -e "url.redirect-code = 302"
		echo -e "}"
		echo -e "\$HTTP[\"host\"] =~ \"msftconnecttest.com\" {"
		echo -e "url.redirect = ( \"^/(.*)$\" => \"http://connectivitycheck.microsoft.com/\")"
		echo -e "url.redirect-code = 302"
		echo -e "}"
		echo -e "\$HTTP[\"host\"] =~ \"msftncsi.com\" {"
		echo -e "url.redirect = ( \"^/(.*)$\" => \"http://connectivitycheck.microsoft.com/\")"
		echo -e "url.redirect-code = 302"
		echo -e "}"
		echo -e "server.port = ${www_port}\n"
		echo -e "index-file.names = ( \"${indexfile}\" )\n"
		echo -e "server.error-handler-404 = \"/\"\n"
		echo -e "mimetype.assign = ("
		echo -e "\".css\" => \"text/css\","
		echo -e "\".js\" => \"text/javascript\""
		echo -e ")\n"
		echo -e "cgi.assign = ( \".htm\" => \"/bin/bash\" )"
		} >> "${tmpdir}${webserver_file}"
	fi

	sleep 2
}

function https_web_server_override_clean_tmpfiles() {

	debug_print

	rm -rf "${tmpdir}bl.txt" > /dev/null 2>&1
	rm -rf "${tmpdir}target.txt" > /dev/null 2>&1
	rm -rf "${tmpdir}handshake"* > /dev/null 2>&1
	rm -rf "${tmpdir}pmkid"* > /dev/null 2>&1
	rm -rf "${tmpdir}nws"* > /dev/null 2>&1
	rm -rf "${tmpdir}clts"* > /dev/null 2>&1
	rm -rf "${tmpdir}wnws.txt" > /dev/null 2>&1
	rm -rf "${tmpdir}hctmp"* > /dev/null 2>&1
	rm -rf "${tmpdir}jtrtmp"* > /dev/null 2>&1
	rm -rf "${tmpdir}${aircrack_pot_tmp}" > /dev/null 2>&1
	rm -rf "${tmpdir}${et_processesfile}" > /dev/null 2>&1
	rm -rf "${tmpdir}${hostapd_file}" > /dev/null 2>&1
	rm -rf "${tmpdir}${hostapd_wpe_file}" > /dev/null 2>&1
	rm -rf "${tmpdir}${hostapd_wpe_log}" > /dev/null 2>&1
	rm -rf "${scriptfolder}${hostapd_wpe_default_log}" > /dev/null 2>&1
	rm -rf "${tmpdir}${dhcpd_file}" > /dev/null 2>&1
	rm -rf "${tmpdir}${dnsmasq_file}" >/dev/null 2>&1
	rm -rf "${tmpdir}${control_et_file}" > /dev/null 2>&1
	rm -rf "${tmpdir}${control_enterprise_file}" > /dev/null 2>&1
	rm -rf "${tmpdir}parsed_file" > /dev/null 2>&1
	rm -rf "${tmpdir}${ettercap_file}"* > /dev/null 2>&1
	rm -rf "${tmpdir}${bettercap_file}"* > /dev/null 2>&1
	rm -rf "${tmpdir}${bettercap_config_file}" > /dev/null 2>&1
	rm -rf "${tmpdir}${bettercap_hook_file}" > /dev/null 2>&1
	rm -rf "${tmpdir}${beef_file}" > /dev/null 2>&1
	if [ "${beef_found}" -eq 1 ]; then
		rm -rf "${beef_path}${beef_file}" > /dev/null 2>&1
	fi
	rm -rf "${tmpdir}${webserver_file}" > /dev/null 2>&1
	rm -rf "${tmpdir}${webdir}" > /dev/null 2>&1
	rm -rf "${tmpdir}${certsdir}" > /dev/null 2>&1
	rm -rf "${tmpdir}${enterprisedir}" > /dev/null 2>&1
	rm -rf "${tmpdir}${asleap_pot_tmp}" > /dev/null 2>&1
	if [ "${dhcpd_path_changed}" -eq 1 ]; then
		rm -rf "${dhcp_path}" > /dev/null 2>&1
	fi
	rm -rf "${tmpdir}wps"* > /dev/null 2>&1
	rm -rf "${tmpdir}${wps_attack_script_file}" > /dev/null 2>&1
	rm -rf "${tmpdir}${wps_out_file}" > /dev/null 2>&1
	rm -rf "${tmpdir}${wep_attack_file}" > /dev/null 2>&1
	rm -rf "${tmpdir}${wep_key_handler}" > /dev/null 2>&1
	rm -rf "${tmpdir}${wep_data}"* > /dev/null 2>&1
	rm -rf "${tmpdir}${wepdir}" > /dev/null 2>&1
	rm -rf "${tmpdir}dos_pm"* > /dev/null 2>&1
	rm -rf "${tmpdir}${channelfile}" > /dev/null 2>&1
	if [ "${enable_ssl_web}" -eq 1 ]; then
		rm -rf "${tmpdir}ag.server.pem" > /dev/null 2>&1
	fi
}

###### FUNCTION HOOKING: PREHOOK ######

#To prehook airgeddon functions, just define them following this nomenclature name: <plugin_short_name>_prehook_<function_name>
#plugin_short_name: This is the name of the plugin filename without extension (.sh)
#function_name: This is the name of the airgeddon function where you want to launch your stuff before

#Prehook function example
#This will execute this content before the chosen function
#In this template the existing function is called "somefunction" but of course this is not existing in airgeddon. You should replace "somefunction" with the real name of the function you want to prehook
#Remember also to modify the starting part of the function "plugin_template" to set your plugin short name (filename without .sh) "my_super_pr0_plugin" if you renamed this template file to my_super_pr0_plugin.sh
#Example name: function my_super_pr0_plugin_prehook_clean_tmpfiles() { <- this will execute the custom code just before executing the content of the chosen function
#function plugin_template_prehook_somefunction() {
#
#	echo "Here comes my custom code which will be executed just before starting to execute the content of the chosen function"
#}

###### FUNCTION HOOKING: POSTHOOK ######

#To posthook airgeddon functions, just define them following this nomenclature name: <plugin_short_name>_posthook_<function_name>
#plugin_short_name: This is the name of the plugin filename without extension (.sh)
#function_name: This is the name of the airgeddon function where you want to launch your stuff after

#Posthook function example
#This will execute this content just after the chosen function
#In this template the existing function is called "somefunction" but of course this is not existing in airgeddon. You should replace "somefunction" with the real name of the function you want to posthook
#Remember also to modify the starting part of the function "plugin_template" to set your plugin short name (filename without .sh) "my_super_pr0_plugin" if you renamed this template file to my_super_pr0_plugin.sh
#Example name: function my_super_pr0_plugin_posthook_clean_tmpfiles() { <- this will execute the custom code just after executing the content of the chosen function
#function plugin_template_posthook_somefunction() {
#
#	echo "Here comes my custom code which will be executed just after finish executing the content of the chosen function"
#}

#Important notes about returning codes on posthooking
#If the function you are posthooking has a returning code, that value is available on the posthook function as ${1}.
#The return done on the posthook function will be the final return value for the function overriding the original one.
#So if you are posthooking a function with return codes you must do mandatorily a return statement on the posthook function.

function initialize_https_web_server_language_strings() {

	debug_print

	arr["ENGLISH","https_web_server_text_1"]="\${yellow_color}Do you want to enable SSL type website services?\${normal_color}\${visual_choice}"
	arr["SPANISH","https_web_server_text_1"]="\${yellow_color}Do you want to enable SSL type website services?\${normal_color}\${visual_choice}"
	arr["FRENCH","https_web_server_text_1"]="\${yellow_color}Do you want to enable SSL type website services?\${normal_color}\${visual_choice}"
	arr["CATALAN","https_web_server_text_1"]="\${yellow_color}Do you want to enable SSL type website services?\${normal_color}\${visual_choice}"
	arr["PORTUGUESE","https_web_server_text_1"]="\${yellow_color}Do you want to enable SSL type website services?\${normal_color}\${visual_choice}"
	arr["RUSSIAN","https_web_server_text_1"]="\${yellow_color}Do you want to enable SSL type website services?\${normal_color}\${visual_choice}"
	arr["GREEK","https_web_server_text_1"]="\${yellow_color}Do you want to enable SSL type website services?\${normal_color}\${visual_choice}"
	arr["ITALIAN","https_web_server_text_1"]="\${yellow_color}Do you want to enable SSL type website services?\${normal_color}\${visual_choice}"
	arr["POLISH","https_web_server_text_1"]="\${yellow_color}Do you want to enable SSL type website services?\${normal_color}\${visual_choice}"
	arr["GERMAN","https_web_server_text_1"]="\${yellow_color}Do you want to enable SSL type website services?\${normal_color}\${visual_choice}"
	arr["TURKISH","https_web_server_text_1"]="\${yellow_color}Do you want to enable SSL type website services?\${normal_color}\${visual_choice}"
	arr["ARABIC","https_web_server_text_1"]="\${yellow_color}Do you want to enable SSL type website services?\${normal_color}\${visual_choice}"
	arr["CHINESE","https_web_server_text_1"]="\${yellow_color}你想要启用ssl类型的网站服务吗?\${normal_color}\${visual_choice}"
}

initialize_https_web_server_language_strings

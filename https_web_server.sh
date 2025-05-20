#!/usr/bin/env bash

#Global shellcheck disabled warnings
#shellcheck disable=SC2034,SC2154

plugin_name="Https Web Server"
plugin_description="Enable ssl for captive portal web server"
plugin_author="QianSong1"

#Enabled 1 / Disabled 0 - Set this plugin as enabled - Default value 1
plugin_enabled=1

plugin_minimum_ag_affected_version="11.50"
plugin_maximum_ag_affected_version=""
plugin_distros_supported=("*")

enable_ssl_web=0

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

function https_web_server_prehook_hookable_for_languages() {

	arr["ENGLISH","https_web_server_text_1"]="\${yellow_color}Do you want to enable SSL/TLS on captive portal web server? \${normal_color}\${visual_choice}"
	arr["SPANISH","https_web_server_text_1"]="\${yellow_color}¿Deseas habilitar el SSL/TLS en el portal cautivo del servidor web? \${normal_color}\${visual_choice}"
	arr["FRENCH","https_web_server_text_1"]="\${pending_of_translation} \${yellow_color}Voulez-vous activer SSL / TLS sur le serveur web captive portal? \${normal_color}\${visual_choice}"
	arr["CATALAN","https_web_server_text_1"]="\${pending_of_translation} \${yellow_color}Voleu habilitar SSL/TLS al servidor web del portal captiu? \${normal_color}\${visual_choice}"
	arr["PORTUGUESE","https_web_server_text_1"]="\${pending_of_translation} \${yellow_color}Deseja ativar o SSL/TLS no captive portal web server? \${normal_color}\${visual_choice}"
	arr["RUSSIAN","https_web_server_text_1"]="\${pending_of_translation} \${yellow_color}Вы хотите включить службы веб -сайта SSL/TLS? \${normal_color}\${visual_choice}"
	arr["GREEK","https_web_server_text_1"]="\${pending_of_translation} \${yellow_color}Θέλετε να ενεργοποιήσετε τις υπηρεσίες ιστοσελίδων τύπου SSL/TLS; \${normal_color}\${visual_choice}"
	arr["ITALIAN","https_web_server_text_1"]="\${pending_of_translation} \${yellow_color}Vuoi abilitare SSL/TLS sul server web portal captive? \${normal_color}\${visual_choice}"
	arr["POLISH","https_web_server_text_1"]="\${pending_of_translation} \${yellow_color}Czy chcesz włączyć SSL/TLS na serwerze web portalu w niewoli? \${normal_color}\${visual_choice}"
	arr["GERMAN","https_web_server_text_1"]="\${pending_of_translation} \${yellow_color}Möchten Sie SSL/TLS-Typ-Website-Dienste aktivieren? \${normal_color}\${visual_choice}"
	arr["TURKISH","https_web_server_text_1"]="\${pending_of_translation} \${yellow_color}Esir portal web sunucusunda SSL/TLS'yi etkinleştirmek mi istiyorsunuz? \${normal_color}\${visual_choice}"
	arr["ARABIC","https_web_server_text_1"]="\${pending_of_translation} \${normal_color}\${visual_choice} \${yellow_color}هل تريد تمكين خدمات موقع؟ SSL"
	arr["CHINESE","https_web_server_text_1"]="\${pending_of_translation} \${yellow_color}您要启用SSL类型网站服务吗？ \${normal_color}\${visual_choice}"
}


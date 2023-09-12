#!/usr/bin/env bash

#Global shellcheck disabled warnings
#shellcheck disable=SC2034,SC2154

plugin_name="Modify no to yes"
plugin_description="Plugin to modify no to yes for evil_twin_attacks_menu 9 option"
plugin_author="QianSong1"

#Enabled 1 / Disabled 0 - Set this plugin as enabled - Default value 1
plugin_enabled=1

plugin_minimum_ag_affected_version="10.0"
plugin_maximum_ag_affected_version=""

plugin_distros_supported=("*")

#Evil Twin attacks menu
function modify_no_to_yes_override_evil_twin_attacks_menu() {

	debug_print

	clear
	language_strings "${language}" 253 "title"
	current_menu="evil_twin_attacks_menu"
	initialize_menu_and_print_selections
	echo
	language_strings "${language}" 47 "green"
	print_simple_separator
	language_strings "${language}" 59
	language_strings "${language}" 48
	language_strings "${language}" 55
	language_strings "${language}" 56
	language_strings "${language}" 49
	language_strings "${language}" 255 "separator"
	language_strings "${language}" 256 et_onlyap_dependencies[@]
	language_strings "${language}" 257 "separator"
	language_strings "${language}" 259 et_sniffing_dependencies[@]
	language_strings "${language}" 261 et_sniffing_sslstrip2_dependencies[@]
	language_strings "${language}" 396
	language_strings "${language}" 262 "separator"
	language_strings "${language}" 263 et_captive_portal_dependencies[@]
	print_hint ${current_menu}

	read -rp "> " et_option
	case ${et_option} in
		0)
			return
		;;
		1)
			select_interface
		;;
		2)
			monitor_option "${interface}"
		;;
		3)
			managed_option "${interface}"
		;;
		4)
			explore_for_targets_option
		;;
		5)
			if contains_element "${et_option}" "${forbidden_options[@]}"; then
				forbidden_menu_option
			else
				current_iface_on_messages="${interface}"
				if check_interface_wifi "${interface}"; then
					if [ "${card_vif_support}" -eq 0 ]; then
						ask_yesno 696 "no"
						if [ "${yesno}" = "y" ]; then
							et_attack_adapter_prerequisites_ok=1
						fi
					else
						et_attack_adapter_prerequisites_ok=1
					fi

					if [ "${et_attack_adapter_prerequisites_ok}" -eq 1 ]; then

						declare -gA ports_needed
						ports_needed["tcp"]=""
						ports_needed["udp"]="${dhcp_port}"
						if check_busy_ports; then

							et_mode="et_onlyap"
							et_dos_menu
						fi
					fi
				else
					echo
					language_strings "${language}" 281 "red"
					language_strings "${language}" 115 "read"
				fi
			fi
		;;
		6)
			if contains_element "${et_option}" "${forbidden_options[@]}"; then
				forbidden_menu_option
			else
				current_iface_on_messages="${interface}"
				if check_interface_wifi "${interface}"; then
					if [ "${card_vif_support}" -eq 0 ]; then
						ask_yesno 696 "no"
						if [ "${yesno}" = "y" ]; then
							et_attack_adapter_prerequisites_ok=1
						fi
					else
						et_attack_adapter_prerequisites_ok=1
					fi

					if [ "${et_attack_adapter_prerequisites_ok}" -eq 1 ]; then

						declare -gA ports_needed
						ports_needed["tcp"]=""
						ports_needed["udp"]="${dhcp_port}"
						if check_busy_ports; then

							et_mode="et_sniffing"
							et_dos_menu
						fi
					fi
				else
					echo
					language_strings "${language}" 281 "red"
					language_strings "${language}" 115 "read"
				fi
			fi
		;;
		7)
			if contains_element "${et_option}" "${forbidden_options[@]}"; then
				forbidden_menu_option
			else
				current_iface_on_messages="${interface}"
				if check_interface_wifi "${interface}"; then
					get_bettercap_version
					if compare_floats_greater_or_equal "${bettercap_version}" "${bettercap2_version}" && ! compare_floats_greater_or_equal "${bettercap_version}" "${bettercap2_sslstrip_working_version}"; then
						echo
						language_strings "${language}" 174 "red"
						language_strings "${language}" 115 "read"
					else
						if [ "${card_vif_support}" -eq 0 ]; then
							ask_yesno 696 "no"
							if [ "${yesno}" = "y" ]; then
								et_attack_adapter_prerequisites_ok=1
							fi
						else
							et_attack_adapter_prerequisites_ok=1
						fi

						if [ "${et_attack_adapter_prerequisites_ok}" -eq 1 ]; then

							declare -gA ports_needed
							ports_needed["tcp"]="${bettercap_proxy_port}"
							ports_needed["udp"]="${dhcp_port} ${bettercap_dns_port}"
							if check_busy_ports; then

								et_mode="et_sniffing_sslstrip2"
								et_dos_menu
							fi
						fi
					fi
				else
					echo
					language_strings "${language}" 281 "red"
					language_strings "${language}" 115 "read"
				fi
			fi
		;;
		8)
			beef_pre_menu
		;;
		9)
			if contains_element "${et_option}" "${forbidden_options[@]}"; then
				forbidden_menu_option
			else
				current_iface_on_messages="${interface}"
				if check_interface_wifi "${interface}"; then
					if [ "${card_vif_support}" -eq 0 ]; then
						ask_yesno 696 "yes"
						if [ "${yesno}" = "y" ]; then
							et_attack_adapter_prerequisites_ok=1
						fi
					else
						et_attack_adapter_prerequisites_ok=1
					fi

					if [ "${et_attack_adapter_prerequisites_ok}" -eq 1 ]; then

						declare -gA ports_needed
						ports_needed["tcp"]="${dns_port} ${www_port}"
						ports_needed["udp"]="${dns_port} ${dhcp_port}"
						if check_busy_ports; then

							et_mode="et_captive_portal"
							echo
							language_strings "${language}" 316 "yellow"
							language_strings "${language}" 115 "read"

							if explore_for_targets_option "WPA"; then
								et_dos_menu
							fi
						fi
					fi
				else
					echo
					language_strings "${language}" 281 "red"
					language_strings "${language}" 115 "read"
				fi
			fi
		;;
		*)
			invalid_menu_option
		;;
	esac

	evil_twin_attacks_menu
}

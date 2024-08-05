#!/usr/bin/env bash

#Global shellcheck disabled warnings
#shellcheck disable=SC2034,SC2154

plugin_name="Custom ESSID"
plugin_description="Plugin to specify custom ESSID for hidden networks"
plugin_author="xpz3"

#Enabled 1 / Disabled 0 - Set this plugin as enabled - Default value 1
plugin_enabled=1

plugin_minimum_ag_affected_version="10.0"
plugin_maximum_ag_affected_version=""

plugin_distros_supported=("*")

function custom_essid_prehook_set_hostapd_config() {

	debug_print

	if [[ "${essid}" == "(Hidden Network)" ]] || [[ "${plugin_name}" != "" ]]; then
		language_strings "${language}" "custom_essid_text_2" "yellow"
		echo -e "------"
		echo -e "\033[1;32m1.)\033[0m yes"
		echo -e "\033[1;31m2.)\033[0m no"
		echo -e "------"
		read -rp "> " you_zl
		while true
		do
			if [[ "${you_zl}" != "1" ]] && [[ "${you_zl}" != "2" ]]; then
				echo -e "\033[31mInvalid input.\033[0m"
				read -rp "> " you_zl
			else
				break
			fi
		done
		case ${you_zl} in
			1)
				local regexp1="^([^x00-xff\!\@\#\$\%\^\&\*\:\;\,\.\_\+\~\=\ A-Z\-]|[0-9a-zA-Z])$|^([^x00-xff\!\@\#\$\%\^\&\*\:\;\,\.\_\+\~\=\ A-Z\-]|[0-9a-zA-Z])([^x00-xff\!\@\#\$\%\^\&\*\:\;\,\.\_\+\~\=\ A-Z\-]|[0-9a-zA-Z\_\-])*([^x00-xff\!\@\#\$\%\^\&\*\:\;\,\.\_\+\~\=\ A-Z\-]|[0-9a-zA-Z])$"
				language_strings "${language}" "custom_essid_text_1" "yellow"
				read -rp "> " essid
				while [[ ! "${essid}" =~ ${regexp1} ]]
				do
					echo -e "\033[31mInvalid ESSID.\033[0m"
					read -rp "> " essid
				done
				language_strings "${language}" "custom_essid_text_3"
				read -rp "> " channel
				while ! channel_check "${channel}"
				do
					echo -e "\033[31mInvalid channel number.\033[0m"
					read -rp "> " channel
				done
				;;
			2)
				true
				;;
			*)
				echo -e "\033[31mSome error...\033[0m"
				exit
				;;
		esac
	fi

	if [[ "${essid}" == "(Hidden Network)" ]] && [[ "${you_zl}" == "2" ]]; then
		local regexp1="^([^x00-xff\!\@\#\$\%\^\&\*\:\;\,\.\_\+\~\=\ A-Z\-]|[0-9a-zA-Z])$|^([^x00-xff\!\@\#\$\%\^\&\*\:\;\,\.\_\+\~\=\ A-Z\-]|[0-9a-zA-Z])([^x00-xff\!\@\#\$\%\^\&\*\:\;\,\.\_\+\~\=\ A-Z\-]|[0-9a-zA-Z\_\-])*([^x00-xff\!\@\#\$\%\^\&\*\:\;\,\.\_\+\~\=\ A-Z\-]|[0-9a-zA-Z])$"
		language_strings "${language}" "custom_essid_text_4" "yellow"
		read -rp "> " essid
		while [[ ! "${essid}" =~ ${regexp1} ]]
		do
			echo -e "\033[31mInvalid ESSID.\033[0m"
			read -rp "> " essid
		done
	fi
}

function channel_check() {
	local channel_list=(1 2 3 4 5 6 7 8 9 10 11 12 13 36 40 44 48 52 56 60 64 149 153 157 161 165)
	local check_channel="${1}"
	for iterm in "${channel_list[@]}"
	do
		if [[ "${iterm}" != "${check_channel}" ]]; then
			continue
		else
			return 0
		fi
	done
	return 1
}

function initialize_custom_essid_language_strings() {

	debug_print

	arr["ENGLISH","custom_essid_text_1"]="A hidden network has been chosen for Evil Twin attack. Please specify the SSID of the target AP to continue"
	arr["SPANISH","custom_essid_text_1"]="A hidden network has been chosen for Evil Twin attack. Please specify the SSID of the target AP to continue"
	arr["FRENCH","custom_essid_text_1"]="A hidden network has been chosen for Evil Twin attack. Please specify the SSID of the target AP to continue"
	arr["CATALAN","custom_essid_text_1"]="A hidden network has been chosen for Evil Twin attack. Please specify the SSID of the target AP to continue"
	arr["PORTUGUESE","custom_essid_text_1"]="A hidden network has been chosen for Evil Twin attack. Please specify the SSID of the target AP to continue"
	arr["RUSSIAN","custom_essid_text_1"]="A hidden network has been chosen for Evil Twin attack. Please specify the SSID of the target AP to continue"
	arr["GREEK","custom_essid_text_1"]="A hidden network has been chosen for Evil Twin attack. Please specify the SSID of the target AP to continue"
	arr["ITALIAN","custom_essid_text_1"]="A hidden network has been chosen for Evil Twin attack. Please specify the SSID of the target AP to continue"
	arr["POLISH","custom_essid_text_1"]="A hidden network has been chosen for Evil Twin attack. Please specify the SSID of the target AP to continue"
	arr["GERMAN","custom_essid_text_1"]="A hidden network has been chosen for Evil Twin attack. Please specify the SSID of the target AP to continue"
	arr["TURKISH","custom_essid_text_1"]="A hidden network has been chosen for Evil Twin attack. Please specify the SSID of the target AP to continue"
	arr["ARABIC","custom_essid_text_1"]="A hidden network has been chosen for Evil Twin attack. Please specify the SSID of the target AP to continue"
	arr["CHINESE","custom_essid_text_1"]="在这里您可以自定义钓鱼热点名称，这适用于隐藏网络，与名称乱码网络，也同样适用于正常名称网络，目的在于更加灵活定制钓鱼名称，请输入钓鱼热点名称以继续"

	arr["ENGLISH","custom_essid_text_2"]="Do you want to custom AP name and channel?"
	arr["SPANISH","custom_essid_text_2"]="Do you want to custom AP name and channel?"
	arr["FRENCH","custom_essid_text_2"]="Do you want to custom AP name and channel?"
	arr["CATALAN","custom_essid_text_2"]="Do you want to custom AP name and channel?"
	arr["PORTUGUESE","custom_essid_text_2"]="Do you want to custom AP name and channel?"
	arr["RUSSIAN","custom_essid_text_2"]="Do you want to custom AP name and channel?"
	arr["GREEK","custom_essid_text_2"]="Do you want to custom AP name and channel?"
	arr["ITALIAN","custom_essid_text_2"]="Do you want to custom AP name and channel?"
	arr["POLISH","custom_essid_text_2"]="Do you want to custom AP name and channel?"
	arr["GERMAN","custom_essid_text_2"]="Do you want to custom AP name and channel?"
	arr["TURKISH","custom_essid_text_2"]="Do you want to custom AP name and channel?"
	arr["ARABIC","custom_essid_text_2"]="Do you want to custom AP name and channel?"
	arr["CHINESE","custom_essid_text_2"]="你想要自定义钓鱼热点名称与信道吗?"

	arr["ENGLISH","custom_essid_text_3"]="\${yellow_color}Setting the AP working channel. \${green_color}This will be helpful for certain network cards that cannot enable AP on specific channels\${normal_color}"
	arr["SPANISH","custom_essid_text_3"]="\${yellow_color}Setting the AP working channel. \${green_color}This will be helpful for certain network cards that cannot enable AP on specific channels\${normal_color}"
	arr["FRENCH","custom_essid_text_3"]="\${yellow_color}Setting the AP working channel. \${green_color}This will be helpful for certain network cards that cannot enable AP on specific channels\${normal_color}"
	arr["CATALAN","custom_essid_text_3"]="\${yellow_color}Setting the AP working channel. \${green_color}This will be helpful for certain network cards that cannot enable AP on specific channels\${normal_color}"
	arr["PORTUGUESE","custom_essid_text_3"]="\${yellow_color}Setting the AP working channel. \${green_color}This will be helpful for certain network cards that cannot enable AP on specific channels\${normal_color}"
	arr["RUSSIAN","custom_essid_text_3"]="\${yellow_color}Setting the AP working channel. \${green_color}This will be helpful for certain network cards that cannot enable AP on specific channels\${normal_color}"
	arr["GREEK","custom_essid_text_3"]="\${yellow_color}Setting the AP working channel. \${green_color}This will be helpful for certain network cards that cannot enable AP on specific channels\${normal_color}"
	arr["ITALIAN","custom_essid_text_3"]="\${yellow_color}Setting the AP working channel. \${green_color}This will be helpful for certain network cards that cannot enable AP on specific channels\${normal_color}"
	arr["POLISH","custom_essid_text_3"]="\${yellow_color}Setting the AP working channel. \${green_color}This will be helpful for certain network cards that cannot enable AP on specific channels\${normal_color}"
	arr["GERMAN","custom_essid_text_3"]="\${yellow_color}Setting the AP working channel. \${green_color}This will be helpful for certain network cards that cannot enable AP on specific channels\${normal_color}"
	arr["TURKISH","custom_essid_text_3"]="\${yellow_color}Setting the AP working channel. \${green_color}This will be helpful for certain network cards that cannot enable AP on specific channels\${normal_color}"
	arr["ARABIC","custom_essid_text_3"]="\${yellow_color}Setting the AP working channel. \${green_color}This will be helpful for certain network cards that cannot enable AP on specific channels\${normal_color}"
	arr["CHINESE","custom_essid_text_3"]="\${yellow_color}设置AP工作信道，\${green_color}这对于某些网卡在特定信道无法开启AP将会很有帮助\${normal_color}"

	arr["ENGLISH","custom_essid_text_4"]="We have detected that you have selected a hidden network. You must specify the name of the hidden network to continue. Please enter a hidden network name"
	arr["SPANISH","custom_essid_text_4"]="We have detected that you have selected a hidden network. You must specify the name of the hidden network to continue. Please enter a hidden network name"
	arr["FRENCH","custom_essid_text_4"]="We have detected that you have selected a hidden network. You must specify the name of the hidden network to continue. Please enter a hidden network name"
	arr["CATALAN","custom_essid_text_4"]="We have detected that you have selected a hidden network. You must specify the name of the hidden network to continue. Please enter a hidden network name"
	arr["PORTUGUESE","custom_essid_text_4"]="We have detected that you have selected a hidden network. You must specify the name of the hidden network to continue. Please enter a hidden network name"
	arr["RUSSIAN","custom_essid_text_4"]="We have detected that you have selected a hidden network. You must specify the name of the hidden network to continue. Please enter a hidden network name"
	arr["GREEK","custom_essid_text_4"]="We have detected that you have selected a hidden network. You must specify the name of the hidden network to continue. Please enter a hidden network name"
	arr["ITALIAN","custom_essid_text_4"]="We have detected that you have selected a hidden network. You must specify the name of the hidden network to continue. Please enter a hidden network name"
	arr["POLISH","custom_essid_text_4"]="We have detected that you have selected a hidden network. You must specify the name of the hidden network to continue. Please enter a hidden network name"
	arr["GERMAN","custom_essid_text_4"]="We have detected that you have selected a hidden network. You must specify the name of the hidden network to continue. Please enter a hidden network name"
	arr["TURKISH","custom_essid_text_4"]="We have detected that you have selected a hidden network. You must specify the name of the hidden network to continue. Please enter a hidden network name"
	arr["ARABIC","custom_essid_text_4"]="We have detected that you have selected a hidden network. You must specify the name of the hidden network to continue. Please enter a hidden network name"
	arr["CHINESE","custom_essid_text_4"]="检测到你选择了一个隐藏网络，你必须指定该隐藏网络的名称才能继续，请输入隐藏网络名称"
}

initialize_custom_essid_language_strings


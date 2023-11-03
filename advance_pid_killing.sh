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

plugin_name="Advance Pid Killing"
plugin_description="Advance pid killing for evil twin attack"
plugin_author="QianSong1"

#Enabled 1 / Disabled 0 - Set this plugin as enabled - Default value 1
plugin_enabled=1

###### PLUGIN REQUIREMENTS ######

#Set airgeddon versions to apply this plugin (leave blank to set no limits, minimum version recommended is 10.0 on which plugins feature was added)
plugin_minimum_ag_affected_version="10.0"
plugin_maximum_ag_affected_version=""

#Set only one element in the array "*" to affect all distros, otherwise add them one by one with the name which airgeddon uses for that distro (examples "BlackArch", "Parrot", "Kali")
plugin_distros_supported=("*")

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
#function plugin_template_override_somefunction() {
#
#	echo "Here comes my custom code content which will replace the original source code of the overridden function"
#}

# override func set_et_control_script
function advance_pid_killing_override_set_et_control_script() {

	debug_print

	rm -rf "${tmpdir}${control_et_file}" > /dev/null 2>&1

	{
		echo  "#!/usr/bin/env bash"
		echo  "et_heredoc_mode=\"${et_mode}\""
		echo  "path_to_processes=\"${tmpdir}${et_processesfile}\""
		echo  "mdk_command=\"${mdk_command}\""
	} >> "${tmpdir}${control_et_file}"

	{
		echo  "function get_treepid() {"
		echo  ""
		echo  "        local pid sep"
		echo  "        sep=\${sep:-'\n'}"
		echo  "        pid=\${pid:-\$1}"
		echo  ""
		echo  "        if [[ -z \"\${pid}\" ]]; then"
		echo  "		       return 1"
		echo  "        fi"
		echo  ""
		echo  "        ps -eo ppid,pid --no-headers | awk -v root=\"\${pid}\" -v sep=\"\${sep}\" '"
		echo  "		       function dfs(u) {"
		echo  "			       if (pids)"
		echo  "				       pids = pids sep u;"
		echo  "			       else"
		echo  "				       pids = u;"
		echo  "			       if (u in edges)"
		echo  "				       for (v in edges[u])"
		echo  "				       dfs(v);"
		echo  "		       }"
		echo  "		       {"
		echo  "			       edges[\$1][\$2] = 1;"
		echo  "			       if (\$2 == root)"
		echo  "				       root_isalive = 1;"
		echo  "		       }"
		echo  "		       END {"
		echo  "			       if (root_isalive)"
		echo  "				       dfs(root);"
		echo  "			       if (pids)"
		echo  "				       print pids;"
		echo  "		       }'"
		echo  "}"
		echo  ""
	} >> "${tmpdir}${control_et_file}"

	{
		echo  'function kill_et_windows() {'
		echo  ''
		echo  '        readarray -t ET_PROCESSES_TO_KILL < <(cat < "${path_to_processes}" 2> /dev/null)'
		echo  '        for item in "${ET_PROCESSES_TO_KILL[@]}"; do'
		echo  '		       local mom_pid child_pid'
		echo  '		       mom_pid="${item}"'
		echo  '		       child_pid="$(get_treepid "${mom_pid}")"'
		echo  '		       for kill_pid in ${child_pid}; do'
		echo  '			       kill "${kill_pid}" &> /dev/null'
		echo  '		       done'
		echo  '		       kill "${item}" &> /dev/null'
		echo  '        done'
		echo  '}'
		echo  ''
		echo  'if [ "${et_heredoc_mode}" = "et_captive_portal" ]; then'
	} >> "${tmpdir}${control_et_file}"

	{
		echo  "        attempts_path=\"${tmpdir}${webdir}${attemptsfile}\""
		echo  "        attempts_text=\"${blue_color}${et_misc_texts[${language},20]}:${normal_color}\""
		echo  "        last_password_msg=\"${blue_color}${et_misc_texts[${language},21]}${normal_color}\""
	} >> "${tmpdir}${control_et_file}"

	if [ "${AIRGEDDON_WINDOWS_HANDLING}" = "tmux" ]; then
		{
		echo  "        function kill_tmux_windows() {"
		echo  ""
		echo  "		       local TMUX_WINDOWS_LIST=()"
		echo  "		       local current_window_name"
		echo  "		       readarray -t TMUX_WINDOWS_LIST < <(tmux list-windows -t \"${session_name}:\")"
		echo  "		       for item in \"\${TMUX_WINDOWS_LIST[@]}\"; do"
		echo  "			       [[ \"\${item}\" =~ ^[0-9]+:[[:blank:]](.+([^*-]))([[:blank:]]|\-|\*)[[:blank:]]?\([0-9].+ ]] && current_window_name=\"\${BASH_REMATCH[1]}\""
		echo  "			       if [ \"\${current_window_name}\" = \"${tmux_main_window}\" ]; then"
		echo  "				       continue"
		echo  "			       fi"
		echo  "			       if [ -n \"\${1}\" ]; then"
		echo  "				       if [ \"\${current_window_name}\" = \"\${1}\" ]; then"
		echo  "					       continue"
		echo  "				       fi"
		echo  "			       fi"
		echo  "			       tmux kill-window -t \"${session_name}:\${current_window_name}\""
		echo  "		       done"
		echo  "        }"
		} >> "${tmpdir}${control_et_file}"
	fi

	{
		echo  "        function finish_evil_twin() {"
		echo  ""
		echo  "		       echo \"\" > \"${et_captive_portal_logpath}\""
	} >> "${tmpdir}${control_et_file}"

	{
		echo  '		       date +%Y-%m-%d >>\'
	} >> "${tmpdir}${control_et_file}"

	{
		echo  "		       \"${et_captive_portal_logpath}\""
		echo  "		       {"
		echo  "		       echo \"${et_misc_texts[${language},19]}\""
		echo  "		       echo \"\""
		echo  "		       echo \"BSSID: ${bssid}\""
		echo  "		       echo \"${et_misc_texts[${language},1]}: ${channel}\""
		echo  "		       echo \"ESSID: ${essid}\""
		echo  "		       echo \"\""
		echo  "		       echo \"---------------\""
		echo  "		       echo \"\""
		echo  "		       } >> \"${et_captive_portal_logpath}\""
		echo  "		       success_pass_path=\"${tmpdir}${webdir}${currentpassfile}\""
		echo  "		       msg_good_pass=\"${et_misc_texts[${language},11]}:\""
		echo  "		       log_path=\"${et_captive_portal_logpath}\""
		echo  "		       log_reminder_msg=\"${pink_color}${et_misc_texts[${language},24]}: [${normal_color}${et_captive_portal_logpath}${pink_color}]${normal_color}\""
		echo  "		       done_msg=\"${yellow_color}${et_misc_texts[${language},25]}${normal_color}\""
		echo  "		       echo -e \"\t${blue_color}${et_misc_texts[${language},23]}:${normal_color}\""
		echo  "		       echo"
	} >> "${tmpdir}${control_et_file}"

	{
		echo  '		       echo "${msg_good_pass} $( (cat < ${success_pass_path}) 2> /dev/null)" >> "${log_path}"'
		echo  '		       attempts_number=$( (cat < "${attempts_path}" | wc -l) 2> /dev/null)'
		echo  '		       et_password=$( (cat < ${success_pass_path}) 2> /dev/null)'
		echo  '		       echo -e "\t${et_password}"'
		echo  '		       echo'
		echo  '		       echo -e "\t${log_reminder_msg}"'
		echo  '		       echo'
		echo  '		       echo -e "\t${done_msg}"'
		echo  '		       if [ "${attempts_number}" -gt 0 ]; then'
	} >> "${tmpdir}${control_et_file}"

	{
		echo  "			       {"
		echo  "			       echo \"\""
		echo  "			       echo \"---------------\""
		echo  "			       echo \"\""
		echo  "			       echo \"${et_misc_texts[${language},22]}:\""
		echo  "			       echo \"\""
		echo  "			       } >> \"${et_captive_portal_logpath}\""
		echo  "			       readarray -t BADPASSWORDS < <(cat < \"${tmpdir}${webdir}${attemptsfile}\" 2> /dev/null)"
	} >> "${tmpdir}${control_et_file}"

	{
		echo  '			       for badpass in "${BADPASSWORDS[@]}"; do'
		echo  '				       echo "${badpass}" >>\'
	} >> "${tmpdir}${control_et_file}"

	{
		echo  "				       \"${et_captive_portal_logpath}\""
		echo  "			       done"
		echo  "		       fi"
		echo  ""
		echo  "		       {"
		echo  "		       echo \"\""
		echo  "		       echo \"---------------\""
		echo  "		       echo \"\""
		echo  "		       echo \"${footer_texts[${language},0]}\""
		echo  "		       } >> \"${et_captive_portal_logpath}\""
		echo  ""
		echo  "		       sleep 2"
	} >> "${tmpdir}${control_et_file}"

	{
		echo  '		       kill_et_windows'
		echo  '		       #kill "$(ps -C hostapd --no-headers -o pid | tr -d ' ')" &> /dev/null'
		echo  '		       #kill "$(ps -C dhcpd --no-headers -o pid | tr -d ' ')" &> /dev/null'
		echo  '		       #kill "$(ps -C "${mdk_command}" --no-headers -o pid | tr -d ' ')" &> /dev/null'
		echo  '		       #kill "$(ps -C aireplay-ng --no-headers -o pid | tr -d ' ')" &> /dev/null'
		echo  '		       #kill "$(ps -C dnsmasq --no-headers -o pid | tr -d ' ')" &> /dev/null'
		echo  '		       #kill "$(ps -C lighttpd --no-headers -o pid | tr -d ' ')" &> /dev/null'
	} >> "${tmpdir}${control_et_file}"

	if [ "${AIRGEDDON_WINDOWS_HANDLING}" = "tmux" ]; then
		{
		echo  "		       kill_tmux_windows \"Control\""
		} >> "${tmpdir}${control_et_file}"
	fi

	{
		echo  "		       exit 0"
		echo  "        }"
		echo  "fi"
	} >> "${tmpdir}${control_et_file}"

	{
		echo  'date_counter=$(date +%s)'
		echo  'while true; do'
	} >> "${tmpdir}${control_et_file}"

	case ${et_mode} in
		"et_onlyap")
			local control_msg=${et_misc_texts[${language},4]}
		;;
		"et_sniffing"|"et_sniffing_sslstrip2")
			local control_msg=${et_misc_texts[${language},5]}
		;;
		"et_sniffing_sslstrip2_beef")
			local control_msg=${et_misc_texts[${language},27]}
		;;
		"et_captive_portal")
			local control_msg=${et_misc_texts[${language},6]}
		;;
	esac

	{
		echo  "        et_control_window_channel=\"${channel}\""
		echo  "        echo -e \"\t${yellow_color}${et_misc_texts[${language},0]} ${white_color}// ${blue_color}BSSID: ${normal_color}${bssid} ${yellow_color}// ${blue_color}${et_misc_texts[${language},1]}: ${normal_color}\${et_control_window_channel} ${yellow_color}// ${blue_color}ESSID: ${normal_color}${essid}\""
		echo  "        echo"
		echo  "        echo -e \"\t${green_color}${et_misc_texts[${language},2]}${normal_color}\""
	} >> "${tmpdir}${control_et_file}"

	{
		echo  '        hours=$(date -u --date @$(($(date +%s) - date_counter)) +%H)'
		echo  '        mins=$(date -u --date @$(($(date +%s) - date_counter)) +%M)'
		echo  '        secs=$(date -u --date @$(($(date +%s) - date_counter)) +%S)'
		echo  '        echo -e "\t${hours}:${mins}:${secs}"'
	} >> "${tmpdir}${control_et_file}"

	{
		echo  "        echo -e \"\t${pink_color}${control_msg}${normal_color}\n\""
	} >> "${tmpdir}${control_et_file}"

	{
		echo  '        if [ "${et_heredoc_mode}" = "et_captive_portal" ]; then'
	} >> "${tmpdir}${control_et_file}"

	{
		echo  "		       if [ -f \"${tmpdir}${webdir}${et_successfile}\" ]; then"
		echo  "			       clear"
		echo  "			       echo -e \"\t${yellow_color}${et_misc_texts[${language},0]} ${white_color}// ${blue_color}BSSID: ${normal_color}${bssid} ${yellow_color}// ${blue_color}${et_misc_texts[${language},1]}: ${normal_color}${channel} ${yellow_color}// ${blue_color}ESSID: ${normal_color}${essid}\""
		echo  "			       echo"
		echo  "			       echo -e \"\t${green_color}${et_misc_texts[${language},2]}${normal_color}\""
	} >> "${tmpdir}${control_et_file}"

	{
		echo  '			       echo -e "\t${hours}:${mins}:${secs}"'
		echo  '			       echo'
		echo  '			       finish_evil_twin'
		echo  '		       else'
		echo  '			       attempts_number=$( (cat < "${attempts_path}" | wc -l) 2> /dev/null)'
		echo  '			       last_password=$(grep "." ${attempts_path} 2> /dev/null | tail -1)'
		echo  '			       tput el && echo -ne "\t${attempts_text} ${attempts_number}"'
		echo  '			       if [ "${attempts_number}" -gt 0 ]; then'
	} >> "${tmpdir}${control_et_file}"

	{
		echo  "				       open_parenthesis=\"${yellow_color}(${normal_color}\""
		echo  "				       close_parenthesis=\"${yellow_color})${normal_color}\""
	} >> "${tmpdir}${control_et_file}"

	{
		echo  '				       echo -ne " ${open_parenthesis} ${last_password_msg} ${last_password} ${close_parenthesis}"'
		echo  '			       fi'
		echo  '		       fi'
		echo  '		       echo'
		echo  '		       echo'
		echo  '        fi'
	} >> "${tmpdir}${control_et_file}"

	{
		echo  "        echo -e \"\t${green_color}${et_misc_texts[${language},3]}${normal_color}\""
		echo  "        readarray -t DHCPCLIENTS < <(grep DHCPACK < \"${tmpdir}clts.txt\")"
		echo  "        client_ips=()"
	} >> "${tmpdir}${control_et_file}"

	{
		echo  '        if [[ -z "${DHCPCLIENTS[@]}" ]]; then'
	} >> "${tmpdir}${control_et_file}"

	{
		echo  "		       echo -e \"\t${et_misc_texts[${language},7]}\""
		echo  "        else"
	} >> "${tmpdir}${control_et_file}"

	{
		echo  '		       for client in "${DHCPCLIENTS[@]}"; do'
		echo  '			       [[ ${client} =~ ^DHCPACK[[:space:]]on[[:space:]]([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})[[:space:]]to[[:space:]](([a-fA-F0-9]{2}:?){5,6}).* ]] && client_ip="${BASH_REMATCH[1]}" && client_mac="${BASH_REMATCH[2]}"'
		echo  '			       if [[ " ${client_ips[*]} " != *" ${client_ip} "* ]]; then'
		echo  '				       client_hostname=""'
		echo  '				       [[ ${client} =~ .*(\(.+\)).* ]] && client_hostname="${BASH_REMATCH[1]}"'
		echo  '				       if [[ -z "${client_hostname}" ]]; then'
		echo  '					       echo -e "\t${client_ip} ${client_mac}"'
		echo  '				       else'
		echo  '					       echo -e "\t${client_ip} ${client_mac} ${client_hostname}"'
		echo  '				       fi'
		echo  '			       fi'
		echo  '			       client_ips+=(${client_ip})'
		echo  '		       done'
		echo  '        fi'
		echo  '        echo -ne "\033[K\033[u"'
		echo  '        sleep 0.3'
		echo  '        current_window_size="$(tput cols)x$(tput lines)"'
		echo  '        if [ "${current_window_size}" != "${stored_window_size}" ]; then'
		echo  '		       stored_window_size="${current_window_size}"'
		echo  '		       clear'
		echo  '        fi'
		echo  'done'
	} >> "${tmpdir}${control_et_file}"

	sleep 1
}

# func get all child pids by it's parent
function get_treepid() {

	local pid sep
	sep=${sep:-'\n'}
	pid=${pid:-$1}

	if [[ -z "${pid}" ]]; then
		return 1
	fi

	ps -eo ppid,pid --no-headers | awk -v root="${pid}" -v sep="${sep}" '
		function dfs(u) {
			if (pids)
				pids = pids sep u;
			else
				pids = u;
			if (u in edges)
				for (v in edges[u])
				dfs(v);
		}
		{
			edges[$1][$2] = 1;
			if ($2 == root)
				root_isalive = 1;
		}
		END {
			if (root_isalive)
				dfs(root);
			if (pids)
				print pids;
		}'
}

# override func kill_et_windows
function advance_pid_killing_override_kill_et_windows() {

	debug_print

	if [ "${dos_pursuit_mode}" -eq 1 ]; then
		kill_dos_pursuit_mode_processes
	fi

	for item in "${et_processes[@]}"; do
		local mom_pid child_pid
		mom_pid="${item}"
		child_pid="$(get_treepid "${mom_pid}")"
		for kill_pid in ${child_pid}; do
			kill "${kill_pid}" &> /dev/null
		done
		kill "${item}" &> /dev/null
	done

	if [ -n "${enterprise_mode}" ]; then
		kill "${enterprise_process_control_window}" &> /dev/null
	else
		kill "${et_process_control_window}" &> /dev/null
	fi

	if [ "${AIRGEDDON_WINDOWS_HANDLING}" = "tmux" ]; then
		kill_tmux_windows
	fi
}

# override func kill_dos_pursuit_mode_processes
function advance_pid_killing_override_kill_dos_pursuit_mode_processes() {

	debug_print

	for item in "${dos_pursuit_mode_pids[@]}"; do
		local mom_pid child_pid
		mom_pid="${item}"
		child_pid="$(get_treepid "${mom_pid}")"
		for kill_pid in ${child_pid}; do
			kill "${kill_pid}" &> /dev/null
		done
		kill -9 "${item}" &> /dev/null
		wait "${item}" 2> /dev/null
	done

	if ! stty sane > /dev/null 2>&1; then
		reset > /dev/null 2>&1
	fi
	dos_pursuit_mode_pids=()
	sleep 1
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

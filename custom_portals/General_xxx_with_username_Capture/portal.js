(function() {

	var onLoad = function() {
		var formElement = document.getElementById("loginform");
		if (formElement != null) {
			var username = document.getElementById("username");
			var password = document.getElementById("password");
			var showpass = function() {
				password.setAttribute("type", password.type == "text" ? "password" : "text");
			}
			document.getElementById("showpass").addEventListener("click", showpass);
			document.getElementById("showpass").checked = false;

			var validatepass = function() {
				if (username.value.length < 1) {
					alert("用户名不能为空");
				}
				else if (password.value.length < 8) {
					alert("密码最少为8个字符");
				}
				else {
					formElement.submit();
				}
			}
			document.getElementById("formbutton").addEventListener("click", validatepass);
		}
	};

	document.readyState != 'loading' ? onLoad() : document.addEventListener('DOMContentLoaded', onLoad);
})();

function redirect() {
	document.location = "${indexfile}";
}

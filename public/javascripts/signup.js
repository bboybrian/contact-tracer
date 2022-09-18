function signUp() {
	$.ajax({
		type: "post",
		url: "db/signup",
		data: {
			given_name: $('#given_name').val(),
			family_name: $("#family_name").val(),
			email: $('#email').val(),
			password: $("#password").val(),
		},
		success: function(res) {
			var response = JSON.parse(res);
			console.log(response);
			if (response == false) {
				$("#r5").show();
			} else {
				$("#r5").hide();
				if (!response['given_name']) {
					$("#r1").show();
				} else {
					$("#r1").hide();
				}
				if (!response['family_name']) {
					$("#r2").show();
				} else {
					$("#r2").hide();
				}
				if (!response['email']) {
					$("#r3").show();
				} else {
					$("#r3").hide();
				}
				if (!response['password']) {
					$("#r4").show();
				} else {
					$("#r4").hide();
				}
				if (response['given_name'] && response['family_name'] && response['email'] && response['password']) {
					$('#signup-form').submit();
					document.location.href = "/";
				}
			}
		}
	});
}

function onSignIn(googleUser) {
	var profile = googleUser.getBasicProfile();
	var id_token = googleUser.getAuthResponse().id_token;
	$.ajax({
		type: "post",
		url: "db/googlesignin",
		data: {
			idtoken: id_token,
		},
		success: function(res) {
			var response = JSON.parse(res);
			pagecontent.checkSession();
		}
	});
}
$('#google-signin-button').ready(function() {
	gapi.signin2.render('google-signin-button', {
		onsuccess: onSignIn,
	});
});
gapi.load('auth2', function() {
    auth2 = gapi.auth2.init({
        client_id: '1099048101998-stvtqj8odtghnq4262pem2php95d5dfr.apps.googleusercontent.com'
    });
});
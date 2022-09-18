const urlParams = new URLSearchParams(window.location.search);
var callback = urlParams.get('callback') ? urlParams.get('callback') : "";

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
		$.ajax({
            type: "get",
            url: "db/signout",
            success: function(res) {
                var response = JSON.parse(res);
                pagecontent.checkSession();
            }
        });
    });
}
function signIn() {
	$.ajax({
		type: "post",
		url: "db/signin",
		data: {
			email: $('#email').val(),
			password: $("#password").val(),
		},
		success: function(res) {
			var response = JSON.parse(res);
			if (response == false) {
				$("#r1").show();
			} else {
				$("#r1").hide();
				window.location.href = "/" + callback;
			}
			pagecontent.checkSession();
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
			window.location.href = "/" + callback;
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
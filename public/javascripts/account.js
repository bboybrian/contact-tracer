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
    window.location.reload();
}
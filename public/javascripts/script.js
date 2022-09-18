var pagecontent = new Vue({
	el: '#pagecontent',
	data: {
		pageReady: true,
		validSession: true,
		user: {
			user_id: '',
			exposed: false,
			given_name: '',
			family_name: '',
			email: '',
		},
	},
	created() {
		this.checkSession();
	},
	methods: {
		isMobile: function() {
			if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
				return true;
			} else {
				return false;
			}
		},
		checkSession: function() {
			$.ajax({
				type: "get",
				url: "../db/checksession",
				success: function(res) {
					var response = JSON.parse(res);
					pagecontent.validSession = response['valid'];
					Vue.set(pagecontent.user, 'user_id', response['user_id']);
					Vue.set(pagecontent.user, 'exposed', response['exposed']);
					Vue.set(pagecontent.user, 'given_name', response['given_name']);
					Vue.set(pagecontent.user, 'family_name', response['family_name']);
					Vue.set(pagecontent.user, 'email', response['email']);
				},
				statusCode: {
					500: function() {
						console.log("Error");
					}
				}
			});
		}
	},
});
function signOut() {
	$.ajax({
		type: "get",
		url: "db/signout",
		success: function(res) {
			var response = JSON.parse(res);
			pagecontent.checkSession();
		}
	});
}
$.ajax({
	type: "get",
	url: "header.html",
	success: function(res) {
		var header = document.createElement("nav");
		header.id = "header";
		header.innerHTML = res;
		document.body.insertBefore(header, document.body.childNodes[0]);
		window.addEventListener("click", function(e) {
			var elem = document.getElementById("venues");
			if ((e.target != elem && !elem.contains(e.target) && $("#venue_box").hasClass("show-bar")) || e.target.id == "burger") {
				toggleSidebar();
			}
		});
		$.ajax({
			type: "post",
			url: "db/getlocations",
			success: (res) => {
				var response = JSON.parse(res);
				if (response) {
					for (var i = 0; i < response.length; i++) {
						document.getElementById("locations").innerHTML += "<a href='./location_history.html?loc_id=" + response[i]['loc_id'] + "'>" + response[i]['loc_name'] + "</a>";
					}
				} else {
					document.getElementById("locations").innerHTML += "<a>No Venues Listed</a>";
				}
			}
		});
	},
});
function toggleSidebar() {
	if ($("#venue_box").hasClass("show-bar")) {
		$("#venue_box").removeClass("show-bar");
	} else {
		$("#venue_box").addClass("show-bar");
	}
}

if (document.getElementsByClassName('welcome-tab')) {
	var wt = document.getElementsByClassName('welcome-tab');
	for (var i in wt) {
		wt[i].innerHTML += "<div class='circle' id='wt" + i + "'></div>";
	}
}
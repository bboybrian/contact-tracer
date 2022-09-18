function search() {
    $.ajax({
		type: "post",
		url: "db/search",
		data: {
			query: $('#query').val(),
		},
		success: function(res) {
			var response = JSON.parse(res);
			if (response == false) {
				// empty query: do nothing
                document.getElementById("user-results").innerHTML = "";
                document.getElementById("venue-results").innerHTML = "";
				$('#user-count').html("(0 results)");
				$('#venue-count').html("(0 results)");
			} else {
				$(".code-wrapper").addClass("show-results");
                // display response
                var userArray = response["userArray"];
                var venueArray = response["venueArray"];
				var queryU = $('#query').val().toUpperCase();
                document.getElementById("user-results").innerHTML = "";
                document.getElementById("venue-results").innerHTML = "";
                var i = 0;
                var j = 0;
				for (i = 0; i < userArray.length; i++) {
					var name = (userArray[i]["given_name"].toUpperCase() + " " + userArray[i]['family_name'].toUpperCase()).replace(queryU, "<font color='red'>" + queryU + "</font>");
					var user_id = userArray[i]['user_id'].toUpperCase().replace(queryU, "<font color='red'>" + queryU + "</font>");
					document.getElementById("user-results").innerHTML += "<a class='list-item' href='/search_user.html?user_id=" + userArray[i]['user_id'] + "'><p class='name'>" + name + "</p><p class='id'>" + user_id + "</p></a>";
				}
				for (j = 0; j < venueArray.length; j++) {
					var venue = venueArray[j]["loc_name"].toUpperCase().replace(queryU, "<font color='red'>" + queryU + "</font>");
					var venue_id = venueArray[j]['loc_id'].toUpperCase().replace(queryU, "<font color='red'>" + queryU + "</font>");
					document.getElementById("venue-results").innerHTML += "<a class='list-item' href='/search_location.html?loc_id=" + venueArray[j]['loc_id'] + "'><p class='name'>" + venue + "</p><p class='id'>" + venue_id + "</p></a>";
				}
				$('#user-count').html("(" + i + " results)");
				$('#venue-count').html("(" + j + " results)");
			}
            pagecontent.checkSession();
		}
	});
}
function toggle(obj, elem) {
	if ($(elem).hasClass('show')) {
		$(elem).removeClass('show');
		obj.innerHTML = "Show";
	} else {
		$(elem).addClass('show');
		obj.innerHTML = "Hide";
	}
}
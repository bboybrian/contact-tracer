function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
		$.ajax({
            type: "get",
            url: "db/signout",
            success: function(res) {
                var response = JSON.parse(res);
                pagecontent.checkSession();
                window.location = "/";
            }
        });
    });
}
var toggle = false;
function updateInfo() {
    if (toggle) {
        $("#g_name").html(pagecontent.user['given_name']);
        $("#f_name").html(pagecontent.user['family_name']);
        // $("#email").html(pagecontent.user['email']);
        $("#update_info").html("<button class='btn2' onclick='updateInfo()'>Update Info</button>");
        toggle = false;
    } else {
        $("#g_name").html("<input id='given_name' value='" + pagecontent.user['given_name'] + "'>");
        $("#f_name").html("<input id='family_name' value='" + pagecontent.user['family_name'] + "'>");
        $("#update_info").html("<button class='btn2' onclick='confUpdate()'>Confirm Details</button>");
        toggle = true;
    }
}
function confUpdate() {
    $.ajax({
        type: "post",
        url: "db/updateinfo",
        data: {
            given_name: $("#given_name").val(),
            family_name: $("#family_name").val(),
        },
        success: function(res) {
            var response = JSON.parse(res);
            if (response) {
                pagecontent.checkSession();
                pagecontent.user['given_name'] = $("#given_name").val();
                pagecontent.user['family_name'] = $("#family_name").val();
                updateInfo();
                $("#update_info").html("<font color='#75c275'>Updated</font><br><button class='btn2' onclick='updateInfo()'>Update Info</button>");
            } else {
                pagecontent.checkSession();
                $("#update_info").html("<font color='#ff726f'>Failed to Update</font><br><button class='btn2' onclick='confUpdate()'>Save Info</button>");
            }
        }
    });
}
function parseTimestamp(timestamp) {
    var date = timestamp.split("T")[0];
    var time = timestamp.split("T")[1].split(".")[0];
    var new_date = new Date(date + " " + time + " " + "UTC");
    return new_date;
}

var map;

var template = ['<?xml version="1.0" encoding="utf-8"?>',
'<svg viewBox="0 0 200 352" width="200" height="352" xmlns="http://www.w3.org/2000/svg" xmlns:bx="https://boxy-svg.com">',
  '<g>',
    '<path d="M -99.887 -351.712 L -5.091 -132.224 L -194.684 -132.224 L -99.887 -351.712 Z" style="fill: {{ color 1 }};" transform="matrix(-1, 0, 0, -1, 0, 0)" bx:shape="triangle -194.684 -351.712 189.593 219.488 0.5 0 1@2a92344c"/>',
    '<circle style="fill: {{ color 2 }};" cx="100" cy="100" r="100"/>',
  '</g>',
  '<circle style="fill: {{ color 3 }};" cx="100" cy="100" r="25"/>',
'</svg>'].join('\n');

function markerSvg(c1, c2, c3) {
    return template.replace("{{ color 1 }}", c1).replace("{{ color 2 }}", c2).replace("{{ color 3 }}", c3);
}

function initMap() {
    var pos = {
        lat: -25.58492520028675,
        lng: 133.5283074984593
    };
    map = new google.maps.Map(document.getElementById("map"), {
        center: pos,
        zoom: 5,
    });
}

$.ajax({
    type: "post",
    url: "db/gethistory",
    data: {
        t: 7,
    },
    success: function(res) {
        var response = JSON.parse(res);
        if (response) {
            for (var i = 0; i < response.length; i++) {
                document.getElementById("checkin-records").innerHTML += "<div class='history-content'><div class='record-date'>" + parseTimestamp(response[i]['date_time']).toDateString() + "</div><div class='record-time'><h3>" + response[i]['address'] + "</h3>" + parseTimestamp(response[i]['date_time']).toTimeString() + "</div></div>";
                var mkr = markerSvg("red", "red", "white");
                new google.maps.Marker({
                    position: {
                        lat: parseFloat(response[i]['lat']),
                        lng: parseFloat(response[i]['lng']),
                    },
                    map,
                    title: response[i]['loc_name'],
                    icon: {
                        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(mkr),
                        scaledSize: new google.maps.Size(40, 40),
                    },
                    optimized: false,
                });
            }
        } else {
            document.getElementById("checkin-records").innerHTML += "<div class='history-empty'><div class='history-content'><div class='record-time'><h3>No Recorded Exposure History</h3></div></div></div>";
        }
    }
});

$.ajax({
    type: "get",
    url: "db/getexposures",
    success: function(res) {
        var response = JSON.parse(res);
        if (response) {
            for (var i = 0; i < response.length; i++) {
                document.getElementById("exposure-records").innerHTML += "<div class='history-content'><div class='record-date'>" + parseTimestamp(response[i]['date_time']).toDateString() + "</div><div style='background-color:pink' class='record-time'><h3>" + response[i]['address'] + "</h3>" + parseTimestamp(response[i]['date_time']).toString() + "</div></div>";
            }
        } else {
            document.getElementById("exposure-records").innerHTML += "<div class='history-empty'><div class='history-content'><div class='record-time'><h3>No Recorded Exposure History</h3></div></div></div>";
        }
    }
});
var popup = document.getElementsByClassName("popup");

function flagUser() {
    //Confirmation window
    popup[0].style.display = "block";
}

function cfmFlag() {
    //"This guy has covid"
    $.ajax({
        type: "post",
        url: "db/flaguser",
        data: {
            user_id: urlParams.get('user_id'),
        },
        success: (res) => {
            var response = JSON.parse(res);
            window.location.reload();
        }
    });
    //Show unflag button
    dispUnflag();
}

function unflag() {
    //Confirmation window
    popup[1].style.display = "block";
}

function cfmUnflag() {
    //This guy is healthy
    $.ajax({
        type: "post",
        url: "db/unflaguser",
        data: {
            user_id: urlParams.get('user_id'),
        },
        success: (res) => {
            var response = JSON.parse(res);
            window.location.reload();
        }
    });
    //Show flag button
    dispFlag();
}

function addAdmin() {
    //Confirmation window
    popup[2].style.display = "block";
}

function cfmAdmin() {
    //Grants user admin perms
    $.ajax({
        type: "post",
        url: "db/cfmAdmin",
        data: {
            user_id: urlParams.get('user_id'),
        },
        success: (res) => {
            var response = JSON.parse(res);
            window.location.reload();
        }
    });
}

function cancel() {
    //Close the popup
    for (var i in popup) {
        popup[i].style.display = "none";
    }
}

window.onclick = function(event) {
    //When the user clicks anywhere outside of the popup, close it
    for (var i in popup) {
        if (event.target == popup[i]) {
            popup[i].style.display = "none";
        }
    }
};

function dispFlag() {
    var flag = document.getElementsByClassName('flag-user')[0];
    flag.style.display = "block";
}

function dispUnflag() {
    var unflag = document.getElementsByClassName('unflag')[0];
    unflag.style.display = "block";
}

$.ajax({
    type: 'post',
    url: '../db/getaccount',
    data: {
        user_id: urlParams.get('user_id')
    },
    success: (res) => {
        var response = JSON.parse(res);
        if (response != false) {
            $(".g_name").html(response['given_name']);
            $(".f_name").html(response['family_name']);
            $(".email").html(response['email']);
            if (response['exposed']) {
                $(".exposed").html("<img style='width:100%' src='/images/covid-19.png'>");
                //Show unflag button
                dispUnflag();
            } else {
                $(".exposed").html("<img style='width:100%' src='/images/novid-19.png'>");
                //Show flag button
                dispFlag();
            }
        }
    }
});

function goTo(page) {
    window.location = "/" + page + "?" + urlParams.toString();
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
        user_id: urlParams.get('user_id'),
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
            document.getElementById("checkin-records").innerHTML += "<div class='history-empty'><div class='history-content'><div class='record-time'><h3>No Recorded Check-in History</h3></div></div></div>";
        }
    }
});

$.ajax({
    type: "post",
    url: "db/getexposures",
    data: {
        user_id: urlParams.get('user_id')
    },
    success: function(res) {
        var response = JSON.parse(res);
        if (response) {
            for (var i = 0; i < response.length; i++) {
                document.getElementById("exposure-records").innerHTML += "<div class='history-content'><div class='record-date'>" + parseTimestamp(response[i]['date_time']).toDateString() + "</div><div style='background-color:pink' class='record-time'><h3>" + response[i]['address'] + "</h3>" + parseTimestamp(response[i]['date_time']).toString() + "</div></div>";
            }
            dispUnflag();
        } else {
            document.getElementById("exposure-records").innerHTML += "<div class='history-empty'><div class='history-content'><div class='record-time'><h3>No Recorded Exposure History</h3></div></div></div>";
        }
    }
});
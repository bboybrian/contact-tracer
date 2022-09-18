var loc_id = urlParams.get('loc_id');
$.ajax({
    type: 'post',
    url: '../db/getlocation',
    data: {
        loc_id
    },
    success: (res) => {
        var response = JSON.parse(res);
        if (response != false) {
            $(".loc_name").attr('l_val', response['loc_name']);
            $(".loc_name").html(response['loc_name']);
            $(".address").attr('l_val', response['address']);
            $(".address").html(response['address']);
            $(".loc_id").attr('l_val', response['loc_id']);
            $(".loc_id").html(loc_id);
        }
    }
});

//Generate QR Code
var qr;
(function() {
    qr = new QRious({
        element: document.getElementById('qr-code'),
        size: 200,
        value: "https://ide-3dbd78d7954b4039bc86f26a45467b09-8080.cs50.ws/code.html?loc_id=" + loc_id
    });
})();

var toggle = false;
function updateInfo() {
    if (document.getElementById("l_name")) {
        $("#loc_name").attr('l_val', $("#l_name").val());
        $("#address").attr('l_val', $("#l_address").val());
    }
    if (toggle) {
        $("#loc_name").html($("#loc_name").attr('l_val'));
        $("#address").html($("#address").attr('l_val'));
        $("#update_info").html("<button class='btn2' onclick='updateInfo()'>Update Info</button>");
        toggle = false;
    } else {
        $("#loc_name").html("<input id='l_name' value='" + $("#loc_name").attr('l_val') + "' autocomplete='off'>");
        $("#address").html("<input id='l_address' value='" + $("#address").attr('l_val') + "' autocomplete='off'>");
        $("#update_info").html("<button class='btn2' onclick='confUpdate()'>Save Info</button>");
        toggle = true;
    }
}
function confUpdate() {
    $.ajax({
        type: "post",
        url: "db/updatelocinfo",
        data: {
            loc_id: loc_id,
            loc_name: $("#l_name").val(),
            address: $("#l_address").val(),
        },
        success: function(res) {
            var response = JSON.parse(res);
            console.log(response);
            if (response) {
                updateInfo();
                $("#update_info").html("<font color='#75c275'>Updated</font><br><button class='btn2' onclick='updateInfo()'>Update Info</button>");
            } else {
                $("#update_info").html("<font color='#ff726f'>Failed to Update</font><br><button class='btn2' onclick='confUpdate()'>Confirm Details</button>");
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
$.ajax({
    type: "post",
    url: "db/getlochistory",
    data: {
        loc_id: urlParams.get('loc_id')
    },
    success: function(res) {
        var response = JSON.parse(res);
        if (response) {
            for (var i = 0; i < response.length; i++) {
                document.getElementById("checkin-records").innerHTML += "<div class='history-content'><div class='record-date'>" + parseTimestamp(response[i]['date_time']).toDateString() + "</div><div class='record-time'><h3>" + response[i]['user_id'] + "</h3>" + parseTimestamp(response[i]['date_time']).toTimeString() + "</div></div>";
            }
        } else {
            document.getElementById("checkin-records").innerHTML += "<div class='history-empty'><div class='history-content'><div class='record-time'><h3>No Recorded Exposure History</h3></div></div></div>";
        }
    }
});


$.ajax({
    type: "post",
    url: "db/getlocexposures",
    data: {
        loc_id: urlParams.get('loc_id')
    },
    success: function(res) {
        var response = JSON.parse(res);
        if (response) {
            for (var i = 0; i < response.length; i++) {
                document.getElementById("exposure-records").innerHTML += "<div class='history-content'><div class='record-date'>" + parseTimestamp(response[i]['start_time']).toDateString() + "</div><div style='background-color:pink' class='record-time'>" + parseTimestamp(response[i]['start_time']).toString() + "<br>" + parseTimestamp(response[i]['end_time']).toString() + "</div></div>";
            }
        } else {
            document.getElementById("exposure-records").innerHTML += "<div class='history-empty'><div class='history-content'><div class='record-time'><h3>No Recorded Exposure History</h3></div></div></div>";
        }
    }
});
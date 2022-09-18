var popup = document.getElementsByClassName("popup");

function flagLoc(){
    //Adds a row to the "exposures" table: exposure_id | loc_id | start_time | end_time
    //Then, alerts users & shows up in their exposures
    popup[0].style.display = "block";
}

function cfmFlag() {
    //"This guy has covid"
    var start_time = new Date($("#start_date").val() + " " + $("#start_time").val()).toISOString().replace("T", " ").match(/.*(?=\.)/g)[0].match(/^([1-2]\d{3}-([0]?[1-9]|1[0-2])-([0-2]?[0-9]|3[0-1])) (20|21|22|23|[0-1]?\d{1}):([0-5]?\d{1}):([0-5]?\d{1})$/g)[0];
    var end_time = new Date($("#end_date").val() + " " + $("#end_time").val()).toISOString().replace("T", " ").match(/.*(?=\.)/g)[0].match(/^([1-2]\d{3}-([0]?[1-9]|1[0-2])-([0-2]?[0-9]|3[0-1])) (20|21|22|23|[0-1]?\d{1}):([0-5]?\d{1}):([0-5]?\d{1})$/g)[0];
    console.log(start_time + "\n" + end_time);
    $.ajax({
        type: "post",
        url: "db/flagloc",
        data: {
            loc_id: urlParams.get('loc_id'),
            start_time: start_time,
            end_time: end_time,
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
            $(".loc_name").html(response['loc_name']);
            $(".address").html(response['address']);
            $(".loc_id").html(loc_id);
        }
    }
});

var qr;
(function() {
    qr = new QRious({
        element: document.getElementById('qr-code'),
        size: 200,
        value: "https://ide-3dbd78d7954b4039bc86f26a45467b09-8080.cs50.ws/code.html?loc_id=" + loc_id
    });
})();

function goTo(page) {
    window.location = "/" + page + "?" + urlParams.toString();
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
                document.getElementById("exposure-records").innerHTML += "<div class='history-content'><div class='record-date'>" + parseTimestamp(response[i]['start_time']).toDateString() + " - " + parseTimestamp(response[i]['end_time']).toDateString() + "</div><div style='background-color:pink' class='record-time'><h3>" + response[i]['address'] + "</h3>" + parseTimestamp(response[i]['start_time']).toString() + "<br>" + parseTimestamp(response[i]['end_time']).toString() + "</div></div>";
            }
        } else {
            document.getElementById("exposure-records").innerHTML += "<div class='history-empty'><div class='history-content'><div class='record-time'><h3>No Recorded Exposure History</h3></div></div></div>";
        }
    }
});
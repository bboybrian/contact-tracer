function checkParams() {
    const urlParams = new URLSearchParams(window.location.search);
    var loc_id = urlParams.get('loc_id');
    if (loc_id) {
        var code = document.getElementById('code');
        code.value = loc_id;
    }
}

function checkin() {
    $.ajax({
        type: "post",
        url: "db/checkin",
        data: {
            loc_id: $("#code").val(),
        },
        success: function(res) {
            var response = JSON.parse(res);
            if (response) {
                $("#checkin-status").html("<font color='green'>Checkin Successful!</font>");
            } else {
                $("#checkin-status").html("<font color='red'>Checkin Failed! Invalid location id.</font>");
            }
        }
    });
}
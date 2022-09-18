$.ajax({
    type: "post",
    data: {
        t: 7,
    },
    url: "db/updates",
    success: function(res) {
        var response = JSON.parse(res);
        if (response) {
            var length = response.length ? response.length : 1;
            for (var i = 0; i < length; i++) {
                document.getElementById("updates").innerHTML += "<h3>" + response[i]['title'] + "</h3><p>" + response[i]['content'] + "</p>";
            }
        } else {
            document.getElementById("updates").innerHTML += "<h3>No Recent Updates</h3><p>Make sure to check regularly for any future updates!</p>";
        }
    }
});
$.ajax({
    type: "get",
    url: "db/getexposures",
    success: function(res) {
        var response = JSON.parse(res);
        if (response) {
            $("#alerts").show();
        } else {
            $("#alerts").hide();
        }
    }
});
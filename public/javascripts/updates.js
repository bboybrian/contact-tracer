function addUpdate() {
    var newUpdate = document.getElementById('newUpdate');
    newUpdate.style.display = "block";
}

function submit() {
    $.ajax({
        type: "post",
        url: "db/addUpdate",
        data: {
            header: document.getElementById('updateHeader').value,
            content: document.getElementById('updateContent').value,
        },
        success: function(res) {
            var response = JSON.parse(res);
            if (response) {
                document.getElementById("newUpdate").innerHTML = "<div class='update-wrapper'><div class='update-box2'>Update added successfully!</div></div>";
                window.location.reload();
            } else {
                document.getElementById("newUpdate").innerHTML = "<div class='update-wrapper'><div class='update-box2'>Error</div></div>";
            }
        }
    });
}

$.ajax({
    type: "post",
    url: "db/updates",
    success: function(res) {
        var response = JSON.parse(res);
        if (response) {
            var length = response.length ? response.length : 1;
            for (var i = 0; i < length; i++) {
                document.getElementById("updates").innerHTML += "<div id='update" + response[i]['update_id'] + "' class='update-wrapper'><h3 id='title" + response[i]['update_id'] + "'>" + response[i]['title'] + "</h3><p id='content" + response[i]['update_id'] + "'>" + response[i]['content'] + "</p><div id='update_info" + response[i]['update_id'] + "'><button class='btn2' onclick='editUpdate(" + response[i]['update_id'] + ")'>Edit</button><button class='btn2' onclick='delUpdate(" + response[i]['update_id'] + ")'>Delete</button></div></div>";
                document.getElementById("update" + response[i]['update_id']).setAttribute("l_title", response[i]['title']);
                document.getElementById("update" + response[i]['update_id']).setAttribute("l_content", response[i]['content']);
                document.getElementById("update" + response[i]['update_id']).setAttribute("l_edit", false);
            }
        }
    }
});

function editUpdate(index) {
    if (document.getElementById("t" + index)) {
        $("#update" + index).attr('l_title', $("#t" + index).val().replace(/[\n]/g, '<br>'));
        $("#update" + index).attr('l_content', $("#c" + index).val().replace(/[\n]/g, '<br>'));
    }
    if (document.getElementById("update" + index).getAttribute('l_edit') == "true") {
        $("#title" + index).html($("#update" + index).attr('l_title'));
        $("#content" + index).html($("#update" + index).attr('l_content'));
        $("#update_info" + index).html("<button class='btn2' onclick='editUpdate(" + index + ")'>Edit</button><button class='btn2' onclick='delUpdate(" + index + ")'>Delete</button>");
        document.getElementById("update" + index).setAttribute("l_edit", false);
    } else {
        $("#title" + index).html("<input id='t" + index + "' value='" + $("#update" + index).attr('l_title') + "'>");
        $("#content" + index).html("<textarea style='width:calc(100% - 10px)' rows='8' id='c" + index + "'>" + $("#update" + index).attr('l_content').replace(/(<br>)/g, '\n') + "</textarea>");
        $("#update_info" + index).html("<button class='btn2' onclick='confUpdate(" + index + ")'>Save</button><button class='btn2' onclick='delUpdate(" + index + ")'>Delete</button>");
        document.getElementById("update" + index).setAttribute("l_edit", true);
    }
}

function confUpdate(index) {
    $.ajax({
        type: "post",
        url: "db/confUpdate",
        data: {
            index: index,
            title: $("#t" + index).val(),
            content: $("#c" + index).val(),
        },
        success: function(res) {
            var response = JSON.parse(res);
            if (response) {
                //Toggle edit mode
                editUpdate(index);
            } else {
                console.log(err);
            }
        }
    });
}

function delUpdate(index) {
    $.ajax({
        type: "post",
        url: "db/delUpdate",
        data: {
            index: index,
        },
        success: function(res) {
            var response = JSON.parse(res);
            if (response) {
                // console.log("works");
                window.location.reload();
            } else {
                console.log("doesnt work");
            }
        }
    });
}
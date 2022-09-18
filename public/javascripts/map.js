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
    $.ajax({
        type: "get",
        url: "db/getlocations",
        success: function(res) {
            var response = JSON.parse(res);
            if (response) {
                if (response.length > 0) {
                    for (var i = 0; i < response.length; i++) {
                        var mkr = markerSvg("green", "lightgreen", "white");
                        if (response[i]['checkins'] < 10) {
                            mkr = markerSvg("green", "lightgreen", "white");
                        } else if (response[i]['checkins'] < 50) {
                            mkr = markerSvg("darkorange", "orange", "white");
                        } else if (response[i]['checkins'] > 49) {
                            mkr = markerSvg("darkred", "red", "white");
                        }
                        var marker = new google.maps.Marker({
                            position: {
                                lat: response[i]['lat'],
                                lng: response[i]['lng'],
                            },
                            map,
                            title: response[i]['loc_name'],
                            address: response[i]['address'],
                            loc_id: response[i]['loc_id'],
                            checkins: response[i]['checkins'],
                            icon: {
                                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(mkr),
                                scaledSize: new google.maps.Size(40, 40),
                            },
                            optimized: false,
                        });
                        marker.addListener("click", function(event) {
                            var marker = this;
                            $("#m-name").html(marker.title);
                            $("#m-address").html(marker.address);
                            $("#m-pos").html(marker.position.toString());
                            document.getElementById("checkinbtn").onclick = function() {
                                window.location = "/code.html?loc_id=" + marker.loc_id;
                            };
                        });
                    }
                } else {
                    new google.maps.Marker({
                        position: {
                            lat: response['lat'],
                            lng: response['lng'],
                        },
                        map,
                        title: response['loc_name'],
                    });
                }
            }
        }
    });
}
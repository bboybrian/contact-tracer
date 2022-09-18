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

var marker;
var geocoder;
var pos = {
    lat: -25.58492520028675,
    lng: 133.5283074984593
};

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: pos,
        zoom: 5,
    });
    geocoder = new google.maps.Geocoder();
    document.getElementById("register_venue").onclick = () => {
        geocodeAddress();
    };
    var mkr = markerSvg("red", "red", "white");
    marker = new google.maps.Marker({
        position: {
            lat: 0,
            lng: 0,
        },
        map,
        title: "New Venue",
        icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(mkr),
            scaledSize: new google.maps.Size(40, 40),
        },
        optimized: false,
    });
    marker.setVisible(false);
}

function geocodeAddress() {
    var address = $("#m-address").val();
    geocoder.geocode({
        address: address
    }, (results, status) => {
        if (status === "OK") {
            map.setCenter(results[0].geometry.location);
            map.setZoom(15);
            marker.setPosition(results[0].geometry.location);
            marker.setTitle($("#m-name").val());
            marker.setVisible(true);
            document.getElementById("register_venue").innerHTML = "Confirm Register Venue";
            document.getElementById("register_venue").onclick = () => {
                cfmRegister(results[0].geometry.location.toString());
            };
        } else {
            map.setCenter(pos);
            map.setZoom(5);
            marker.setVisible(false);
            alert("Invalid Address");
        }
    });
}

function cfmRegister(pos) {
    var lat = pos.match(/(?!\()[-]?[0-9]+\.[0-9]+(?=,)/g)[0];
    var lng = pos.match(/(?! )[-]?[0-9]+\.[0-9]+(?=\))/g)[0];
    $.ajax({
        type: "post",
        url: "db/createloc",
        data: {
            loc_name: $("#m-name").val(),
            address: $("#m-address").val(),
            lat: lat,
            lng: lng,
        },
        success: function(res) {
            var response = JSON.parse(res);
            if (response) {
                confirm("Venue Created!");
                window.location = "/";
            } else {
                confirm("Venue Name or Address Invalid!");
                document.getElementById("register_venue").innerHTML = "Register Venue";
                document.getElementById("register_venue").onclick = () => {
                    geocodeAddress();
                };
            }
        }
    });
}
var cafeMarker, pubMarker, foodMarker, cityMarker, map, markers;
var WebserverURL = "//193.63.200.53:8005";
//var WebserverURL = "//192.168.0.200:8005";
$(document).ready(function() {
    //init for map
    map = L.map('map1', {
        center: [51.505, -0.09],
        zoom: 13
    });
    var attrib = "Map data copyright OpenStreetMap contributors, Open Database Licence";
    L.tileLayer("//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {attribution: attrib}).addTo(map);
    map.locate({setView: true,maxZoom: 13});
	markers = L.layerGroup().addTo(map);
	
	var overlayMaps = {
    "markers": markers
};
	
L.control.layers(null,overlayMaps).addTo(map);
    // DECLARE CUSTOM MARKERS  - START
    cafeMarker = L.AwesomeMarkers.icon({
        icon: 'coffee',
        markerColor: 'red',
        prefix: 'fa'
    });
    pubMarker = L.AwesomeMarkers.icon({
        icon: 'beer',
        markerColor: 'blue',
        prefix: 'fa'
    });
    foodMarker = L.AwesomeMarkers.icon({
        icon: 'cutlery',
        markerColor: 'green',
        prefix: 'fa'
    });

    cityMarker = L.AwesomeMarkers.icon({
        icon: 'building',
        markerColor: 'orange',
        prefix: 'fa'
    });
    Marker = L.AwesomeMarkers.icon({
        markerColor: 'orange',
    });
    // DECLARE CUSTOM MARKERS  - END		

    //Map EVENTS
    map.on("click", mapClick);

    //Map End

    //Link Event Handlers
    $("#Search-Btn").on("click", ajaxSearch);
// ADD POI FORM DIALOG OPTIONS	
	$("#Dialogbox-add").dialog({
		autoOpen: false,
		modal: true,
		title: "Add a new POI",
		buttons: {
			"ok": addpoi,
			"cancel": function(){
				$("#addpoiform").trigger("reset");
				$("#Dialogbox-add").dialog("close");
				} 
		}
	});
});




function ajaxSearch() {
    var region = $("#Search-Region").val();
    var type = $("#Search-Type").val();
    console.log("Search......for Region of " + region + " and  type of " + type);
    $.ajax({
        method: "GET",
        dataType: 'json',
        url: WebserverURL + "/search",
        data: {
            'region': region,
            'type': type
        }
    }).done(function(data, textStatus, XHR) {
            $("#results").empty();
			markers.clearLayers();
            if (XHR.status == 204) {
                $("#results").append("<p>NO RESULTS FOUND</p>");
                return;
            }
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    $("#results").append("<p class='POI' id='" + data[i]["_id"] + "'>" +
                        data[i].name + " - " + data[i].type + "<br/>" +
                        data[i].country + " - [ Lat " + data[i].lat + " / Lon " + data[i].lon + " ]" +
                        "</p>");
                    //What Marker to use	
					var markertype;					
                    switch (data[i].type) {
                        case "restaurant":
								markertype = foodMarker;
                            break;
                        case "pub":
								markertype = pubMarker;
                            break;
                        case "city":
                          markertype = cityMarker;
                            break;
						case "town":
                          markertype = cityMarker;
                            break;
                        case "cafe":
                           markertype = cafeMarker;
                            break;
                        default:
                           markertype = Marker; 
				}
					var marker = L.marker([data[i].lat, data[i].lon], {icon: markertype}).bindPopup(data[i].name);
					markers.addLayer(marker);
			}};
			$("#results > p").on("click", [this], viewDetails);
            }).fail(function(XHR, textStatus, err) {
            if (XHR.status == 503) {
                $("#results").html("<p>Sorry There Was a Server Error</p>");
            } else if (XHR.status == 400) {
                $("#results").html("<p>You Need to enter at least a Region or Select a Type</p>");
            }
        });
    };


    function mapClick(e) {
        var lat = e.latlng.lat;
        var lon = e.latlng.lng;
		$("#POI_lat").val(lat);
		$("#POI_lon").val(lon);
		$("#Dialogbox-add").dialog("open");
		
    }


    function viewDetails(e) {
        console.log("The Link for the id of " + e.target.id + " Has Been Clicked");
    }
	
function addpoi(){
	var name = $("#POI_name").val();
	var type = $("#POI_type").val();
	var country = $("#POI_country").val();
	var region = $("#POI_region").val();
	var lon = $("#POI_lon").val();
	var lat = $("#POI_lat").val();
	var desc = $("#POI_Description").val();
	$.ajax({
        method: "POST",
        url: WebserverURL + "/add",
        data: {
            'name': name,
            'lat': lat,
            'lon': lon,
            'type': type,
            'region': region,
            'country': country,
            'desc': desc
		}
	}).done(function(data, textStatus, XHR) {
		$("#addpoiform").trigger("reset");
		$("#Dialogbox-add").dialog("close");
		alert("POI added");
		var markertype;					
			switch (type) {
				case "restaurant":
						markertype = foodMarker;
					break;
				case "pub":
						markertype = pubMarker;
					break;
				case "city":
				  markertype = cityMarker;
					break;
				case "town":
				  markertype = cityMarker;
					break;
				case "cafe":
				   markertype = cafeMarker;
					break;
				default:
				   markertype = Marker; 
		}
			var marker = L.marker([lat, lon], {icon: markertype}).bindPopup(name);
			markers.addLayer(marker);

	}).error(function(XHR, textStatus, err) {
		alert("Please check the details entered and try again. ");
	});
}
let cafeMarker, pubMarker, foodMarker, cityMarker, map, markers;
const WebserverURL = "//localhost:8005";

const ajaxSearch = () =>  {
    let region = $("#Search-Region").val();
    let type = $("#Search-Type").val();
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
            $("#results").innerHTML("<p>NO RESULTS FOUND</p>");
            return;
        }
        let arrayOfLatLngs = [];
        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                $("#results").append("<p class='POI' id='" + data[i]["_id"] + "' data-lat='" + data[i].lat + "' data-long='" + data[i].lon + "' data-name='" + data[i].name +"'>" +
                    data[i].name + " - " + data[i].type + "<br/>" +
                    data[i].country + " - [ Lat " + data[i].lat + " / Lon " + data[i].lon + " ]" +
                    "</p>");
                //What Marker to use	
                let markertype;					
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
                const marker = L.marker([data[i].lat, data[i].lon], {icon: markertype}).bindPopup(data[i].name);
                markers.addLayer(marker);
                arrayOfLatLngs.push([data[i].lat, data[i].lon]);

        }};
        var bounds = new L.LatLngBounds(arrayOfLatLngs);
        map.fitBounds(bounds);
        $("#results > p").on("click", [this], viewDetails);
        }).fail(function(XHR, textStatus, err) {
        if (XHR.status == 503) {
            $("#results").html("<span>Sorry There Was a Server Error</span>");
        } else if (XHR.status == 400) {
            $("#results").html("<span>You Need to enter at least a Region or Select a Type</span>");
        }
    });
};

const mapClick = (e) =>  {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;
    $("#POI_lat").val(lat);
    $("#POI_lon").val(lon);
    $("#Dialogbox-add").dialog("open");
    
}

const viewDetails = (e) => {
    const {lat, long} = e.target.dataset;
    map.setView([lat, long], 15, { animate:true });
}
	
const addpoi = () => {
	const name = $("#POI_name").val();
	const type = $("#POI_type").val();
	const country = $("#POI_country").val();
	const region = $("#POI_region").val();
	const lon = $("#POI_lon").val();
	const lat = $("#POI_lat").val();
	const desc = $("#POI_Description").val();
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
		let markertype;					
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
			let marker = L.marker([lat, lon], {icon: markertype}).bindPopup(name);
			markers.addLayer(marker);

	}).error(function(XHR, textStatus, err) {
		alert("Please check the details entered and try again. ");
	});
}


//init for map
map = L.map('map1', {
    center: [51.505, -0.09],
    zoom: 13
});
let attrib = "Map data copyright OpenStreetMap contributors, Open Database Licence";
L.tileLayer("//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: attrib }).addTo(map);
map.locate({ setView: true, maxZoom: 13 });
markers = L.layerGroup().addTo(map);

let overlayMaps = {
    "markers": markers
};

L.control.layers(null, overlayMaps).addTo(map);
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
        "cancel": function () {
            $("#addpoiform").trigger("reset");
            $("#Dialogbox-add").dialog("close");
        }
    }
});
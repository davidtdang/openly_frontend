var source   = $("#search-results-template").html();
var searchResultsTemplate = Handlebars.compile(source);
var featureLayers = [];

// Provide your access token
L.mapbox.accessToken = 'pk.eyJ1IjoiZGF2aWRkYW5nIiwiYSI6Ikh0OXhteVUifQ.Ub2aDG7dWw0Hu3ytuDEg-g';
// Create a map in the div #map
map = L.mapbox.map('map', 'daviddang.ljfi6cpf').setView([37.767, -122.436], 13);


$("#search-results").on("click", ".venue", function() {
  var divCoords = $(this).data("coordinates").split(',');
  var name = $(this).data("name");
  var address = $(this).data("address");
  var phone = $(this).data("phone");
  var rating = $(this).data("rating");

  var venue = {
    coords: [parseFloat(divCoords[0]), parseFloat(divCoords[1])],
    name: name,
    address: address,
    phone: phone
  };

  addMarker(venue);
});

$("#search-form").on("submit", function (e) {
  e.preventDefault();
  searchAction($("#search-form input").val());
});

function searchAction(searchTerm) {
  var query = searchTerm.replace(/\s/g, "+");
  var url = "http://localhost:3000/search_yelp";
  var req = {
    url: url,
    method: "post",
    data:{
      "s":query
    }
  };

  $.ajax(req)
    .done(function (res) {
      // append to list
      setSearchResultsTemplate({venues:res});
    })
    .fail(function () {
      throw "Search AJAX Failed";
    });
}

function setSearchResultsTemplate(context) {
  var html = searchResultsTemplate(context);
  $("#search-results").html(html);
  $('.ui.accordion').accordion("close others");
  featureLayers.forEach(function (featureLayer) {
    map.removeLayer(featureLayer);
  });
  featureLayers = [];
}



function addMarker(venue) {
  var featureLayer = L.mapbox.featureLayer({
    // this feature is in the GeoJSON format: see geojson.org
    // for the full specification
    type: 'Feature',
    geometry: {
        type: 'Point',
        // coordinates here are in longitude, latitude order because
        // x, y is the standard for GeoJSON and many formats
        coordinates: venue.coords
    },
    properties: {
        title: venue.name,
        description: "<div>"+ venue.address +"</div>" + "<div>"+ venue.phone +"</div>",
        // description: venue.address,
        // one can customize markers by adding simplestyle properties
        // https://www.mapbox.com/guides/an-open-platform/#simplestyle
        'marker-size': 'large',
        'marker-color': '#FC3A57',
        // 'marker-symbol': 'cafe'

    }
  });
  featureLayer.addTo(map);
  featureLayers.push(featureLayer);
}

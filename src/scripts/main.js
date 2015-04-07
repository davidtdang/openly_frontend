


$('#search-results').on("click", ".user_tip_modal_popup_button",function(){
  var $venue = $(this).closest(".venue");

  var id = $venue.data("id");
  var tips = $venue.data("userTips");

  $("#tipModal").data("id", id);
  $("#tipModal").data("tips", tips);
  console.log($("#tipModal").data());

  $('.ui.modal').modal('show');
});




var source   = $("#search-results-template").html();
var searchResultsTemplate = Handlebars.compile(source);
// var source_two   = $("#user-tips-template").html();
// var tipsTemplate = Handlebars.compile(source_two);
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
  var opening = $(this).data("opening");
  var closing = $(this).data("closing");
  var hours_left = $(this).data("hours_left");
  console.log(">>", $(this).data());
  // var userTip = $('active.title .user-tip-indicator').text();


  var venue = {
    coords: [parseFloat(divCoords[0]), parseFloat(divCoords[1])],
    name: name,
    address: address,
    phone: phone,
    opening: opening,
    closing: closing
  };

  addMarker(venue);
});

$("#search-results").on("click", ".category", function () {
  var category = $(this).text().trim();
  $("#search-form input").val(category);
  searchAction(category);
});

$("#search-form").on("submit", function (e) {
  e.preventDefault();
  searchAction($("#search-form input").val());
});

//////// CREATE TRIGGERING ACTION METHOD TO SUBMIT TIP
$("#tipModal").on("submit", " form", function (e) {
  e.preventDefault();
  // var userTip = $(".content.active .userTipForm input").val();
  // if (userTip === "") {
  //   return;
  // }
  var id = $("#tipModal").data("id");
  var text = $("#tipModal :input").val();
  console.log(id);
  addUserTipAction(text, id);
  // removeUserTipForm($(this));
});


function searchAction(searchTerm) {
  var query = searchTerm.replace(/\s/g, "+");
  var url = "http://localhost:3000/find_venues";
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
      // console.log(res)
      setSearchResultsTemplate({venues:res});
      res.forEach(function(venue){
        addMarker(venue);
      });
      setSearchResultsData();
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

function setSearchResultsData() {
  $(".venue[data-db='true']").each(function (i, el) {
    var $el = $(el);
    var id = $el.data("id");
    $.ajax({
      url: "http://localhost:3000/user_tips/"+id,
      method: 'get'
    }).done(function (res) {
      $el.data("userTips", res)
    })
  })
}

function addMarker(venue) {
  // console.log(venue)
  var featureLayer = L.mapbox.featureLayer({
    // this feature is in the GeoJSON format: see geojson.org
    // for the full specification
    type: 'Feature',
    geometry: {
        type: 'Point',
        // coordinates here are in longitude, latitude order because
        // x, y is the standard for GeoJSON and many formats
        // coordinates: venue.coords
        coordinates: [venue.geocoords[0], venue.geocoords[1]]
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



// $('#example2').progress({
//   percent: 22
// });


function addUserTipAction(userTip, id){
  console.log(id)
  var payload = {
    user_tip:userTip,
    venue_id:id
  };

  var url = "http://localhost:3000/user_tips";
  // var url = "http://openly.herokuapp.com";

  var req ={
    url: url,
    method: "post",
    data:payload
  };

  $.ajax(req)
    .done(function(res){
      $('ul').append("<li>" + userTip + "</li>")
      // setActiveVenue(userTip);
    })
    .fail(function(){
      throw "Search AJAX Failed"
    });

}

function removeUserTipForm($form) {
  $form.fadeOut("fast", function () {
    $form.remove();
  });
}

// function setActiveVenue(userTip) {
//   $('.active.title .user-tip-indicator').html(userTip + '<i class="wait icon"></i>');
// }








// $('.ui.label.tip').on('click', function(){
//   $('.ui.modal').modal('show');
// });






//
// $("#search-results").on("click", ".title", function(){
//   map.featureLayer.eachLayer(function(marker){
//     if (marker.feature.properties.title == ?????){
//       marker.openPopup();
//     }
//   })
// })



//   map.featureLayer.eachLayer(function(marker){
//     if (marker.feature.properties.name == venue.name){
//       marker.openPopup();
//     }
// });
// }
//

// var source   = $("#search-results-template").html();
// var searchResultsTemplate = Handlebars.compile(source);
// var featureLayers = [];
//
// // Provide your access token
// L.mapbox.accessToken = 'pk.eyJ1IjoiZGF2aWRkYW5nIiwiYSI6Ikh0OXhteVUifQ.Ub2aDG7dWw0Hu3ytuDEg-g';
// // Create a map in the div #map
// map = L.mapbox.map('map', 'daviddang.ljfi6cpf').setView([37.767, -122.436], 13);
//
//
// $("#search-results").on("click", ".venue", function() {
//   var divCoords = $(this).data("coordinates").split(",");
//   var geocoords = [parseFloat(divCoords[0]), parseFloat(divCoords[1])]
//   var name = $(this).data("name");
//   var address = $(this).data("address");
//   var phone = $(this).data("phone");
//   // var rating = $(this).data("rating");
//
//   var venue = {
//     coords: geocoords,
//     name: name,
//     address: address,
//     phone: phone
//   };
//
//   addMarker(venue);
// });
//
// $("#search-form").on("submit", function (e) {
//   e.preventDefault();
//   searchAction($("#search-form input").val());
// });
//
// function searchAction(searchTerm) {
//   var query = searchTerm.replace(/\s/g, "+");
//   var url = "http://localhost:3000/search";
//   var req = {
//     url: url,
//     method: "post",
//     data:{
//       "s":query
//     }
//   };
//
//   $.ajax(req)
//     .done(function (res) {
//       // append to list
//       console.log(res);
//       setSearchResultsTemplate({venues:res});
//     })
//     .fail(function () {
//       throw "Search AJAX Failed";
//     });
// }
//
// function setSearchResultsTemplate(context) {
//   var html = searchResultsTemplate(context);
//   $("#search-results").html(html);
//   $('.ui.accordion').accordion("close others");
//   featureLayers.forEach(function (featureLayer) {
//     map.removeLayer(featureLayer);
//   });
//   featureLayers = [];
// }
//
//
//
// function addMarker(venue) {
//   var featureLayer = L.mapbox.featureLayer({
//     // this feature is in the GeoJSON format: see geojson.org
//     // for the full specification
//     type: 'Feature',
//     geometry: {
//         type: 'Point',
//         // coordinates here are in longitude, latitude order because
//         // x, y is the standard for GeoJSON and many formats
//         coordinates: venue.coords
//     },
//     properties: {
//         title: venue.name,
//         description: "<div>"+ venue.address +"</div>" + "<div>"+ venue.phone +"</div>",
//         // description: venue.address,
//         // one can customize markers by adding simplestyle properties
//         // https://www.mapbox.com/guides/an-open-platform/#simplestyle
//         'marker-size': 'large',
//         'marker-color': '#FC3A57',
//         // 'marker-symbol': 'cafe'
//
//     }
//   });
//   featureLayer.addTo(map);
//   featureLayers.push(featureLayer);
// }

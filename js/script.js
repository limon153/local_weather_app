$(function() {

  var long, lat,
      temp;
      
  var measure = $("#measure");

  measure.on('click', function(e) {
    e.preventDefault();
    if (measure.text() == 'C') {
      measure.text('F');
      temp = Math.round(temp * 9 / 5 + 32);
      $("#temp").text(temp);
    } else {
      measure.text('C');
      temp = Math.round((temp - 32) * 5 / 9);
      $("#temp").text(temp);
    }

  });

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      long = position.coords.longitude;
      lat = position.coords.latitude;
      displayLocation(lat, long, function(returnValue) {
        $("#location").html(returnValue);
      });
      getWeather(long, lat);
    });
  }

  function displayLocation(lat, long, callback) {
    var request = new XMLHttpRequest();
    var method = 'GET';
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+long+'&sensor=true';
    var async = true;
    request.open(method, url, async);
    request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200) {
        var data = JSON.parse(request.responseText);
        var addressComponents = data.results[0].address_components;
        for (var i = 0; i < addressComponents.length; i++) {
          var types = addressComponents[i].types;
          if (types == "administrative_area_level_1,political") {
            if (typeof callback === 'function') {
              callback(addressComponents[i].long_name);
            }
          }
        }
      }
    }
    request.send();
  }

  function getWeather(long, lat) {
    $.getJSON("https://fcc-weather-api.glitch.me/api/current?lat=" + lat + "&lon=" + long, function(data) {
      var status = data.weather[0].main;
      var iconUrl = data.weather[0].icon;
      temp = data.main.temp;
      temp = Math.round(temp);
      $("#status").html(status);
      $("#logo").attr('src', iconUrl);
      $("#temp").text(temp);
    });
  }

});

var geocoder;
var mylocation;
var woeid;

function doGetGeoLocation(){
    if(navigator.geolocation)
        geocoder = new google.maps.Geocoder();
        navigator.geolocation.getCurrentPosition(handleGetCurrentPosition);
}

function handleGetCurrentPosition(position){
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    codeLatLng(lat, lon);
}


  function codeLatLng(lat, lng) {
    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
      mylocation = results[0].address_components[2].short_name
      
      getPlaceFromFlickr(mylocation, 'output')
      }
    });
  }

function errorFunction(){
    alert("Geocoder failed");
}

 function getPlaceFromFlickr(location ,callback){
   // the YQL statement
   var yql = 'select woeid from geo.places where text="'+location+'"';

   // assembling the YQL webservice API
   var url = 'http://query.yahooapis.com/v1/public/yql?q='+
              encodeURIComponent(yql)+'limit 1&format=json&diagnostics='+
              'true&callback='+callback;

   // create a new script node and add it to the document
   var s = document.createElement('script');
   s.setAttribute('src',url);
   document.getElementsByTagName('head')[0].appendChild(s);
 };

 // callback in case there is a place found
 function output(json){
   if(typeof(json.query.results.place.woeid) != 'undefined'){
       woeid = json.query.results.place.woeid;
       $("<div class='weather weer'><input type='button' name='vandaag' id='vandaag' class='ui-icon ui-icon-carat-1-w' /><span class='weatherspan'>Vandaag</span><input type='button' name='morgen' id='morgen' class='ui-icon ui-icon-carat-1-e'/></div>").insertAfter(".weather");
        
       $("#morgen").bind("click", doMorgen);
       $("#vandaag").bind("click", weather);
       weather(woeid);
   }
 }

 function weather() {
     $.simpleWeather({
         woeid: woeid,
         unit: 'c',
         success: function (weather) {
             html = '<img class="weatherImage" src="' + weather.image + '"><h2 class="weatherHeader">' + weather.temp + '&deg;' + weather.units.temp + '</h2>';
             html += '<ul class="weatherItems"><li>' + weather.city + ', ' + weather.country + '</li>';
             html += '<li class="currently">' + weather.currently + '</li>';
             html += '<li>Humidity: ' + weather.humidity + '</li></ul>';

             $(".weatherspan").html("Vandaag");
             $("#forecast").html(html);
             $("#vandaag").hide();
             $("#morgen").show();
             setCss();
         },
         error: function (error) {
             $("#forecast").html('<p>' + error + '</p>');
         }
     });
 }

 function doMorgen() {
     $.simpleWeather({
         woeid: woeid,
         unit: 'c',
         success: function (weather) {
             html = '<img class="weatherImage" src="' + weather.tomorrow.image + '"><h2 class="weatherHeader">' + weather.tomorrow.low + '&deg;' + weather.units.temp + '</h2>';
             html += '<ul class="weatherItems"><li>' + weather.city + ', ' + weather.country + '</li>';
             html += '<li class="currently">' + weather.tomorrow.forecast + '</li>';
             html += '<li>Max: ' + weather.tomorrow.high + '&deg;' + weather.units.temp + '</li></ul>';

             $(".weatherspan").html("Morgen");
             $("#forecast").html(html);
             $("#morgen").hide();
             $("#vandaag").show();
             setCss();
         },
         error: function (error) {
             $("#forecast").html('<p>' + error + '</p>');
         }
     });

 }

 function setCss() {
     var height = $("#forecast").css("height");
     var width = $("#forecast").css("width");
     var hoogte = "";
     var breedte = "";
     if (height.length == 5) {
         hoogte = height.substr(0, 3);
     }
     else {
         hoogte = height.substr(0, 2);
     }
     if (width.length == 5) {
         breedte = width.substr(0, 3);
     }
     else {
         breedte = width.substr(0, 2);
     }

     $(".weatherImage").css("width", breedte / 3 + "px");
     $(".weatherImage").css("margin-left", "-10%");
     $(".weatherImage").css("height", hoogte /1.5 + "px");
     $(".weatherHeader").css("font-size", hoogte/2+"px");
     $(".weatherItems li").css("font-size", hoogte/12+"px");

 }



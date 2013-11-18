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
   	 weather(woeid);
   }
 }

function weather(woeid){
     $.simpleWeather({
  	 woeid: woeid ,
     unit: 'c',
     success: function(weather) {
      html = '<img src="'+weather.image+'"><h2>'+weather.temp+'&deg;'+weather.units.temp+'</h2>';
      html += '<ul><li>'+weather.city+', '+weather.country+'</li>';
      html += '<li class="currently">'+weather.currently+'</li>';
      html += '<li>Humidity: '+weather.humidity+'</li></ul>';
      
      $("#weather").html(html);
    },
    error: function(error) {
      $("#weather").html('<p>'+error+'</p>');
    }
  });
}

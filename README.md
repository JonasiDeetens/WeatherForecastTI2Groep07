![simpleweather.js logo](http://fc03.deviantart.net/fs70/i/2011/010/4/d/simple_weather_by_dijaysazon-d36unip.png)

#### Simpel weerbericht voor op jouw site #####

## Beschrijving
GeolocationandWeather.js is een javascript bestandje die via geolocatie jouw plaats bepaald en daarna het weer 
terug geeft gebaseerd op die locatie. Het doel is eigenlijk vlug en simpel een weerbericht te kunnen plaatsen 
op gelijk welke site, door middel van simpele addities. Het is zo makkelijk als een paar script tags toe voegen 
en een simpele `<div>` aan te maken.

## Bevat
* simpleWeather API
* geolocation van html5
* GeolocationandWeather.js
* GeolocationandWeather.css

## Hoe implementeren ?
Eerst voeg je een simpele link toe naar je css file.

```
<link href="./GeolocationandWeather.css" rel="Stylesheet">
```

Daarna voegen we ook de noodzakelijke scripts toe.

```
<script src="./lib/jquery.js"></script>
<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=false"></script> 
<script src="./lib/jquery.simpleWeather-2.3.min.js"></script>
<script src="./GeolocationandWeather.js"></script>
```

Als we deze zaken hebben toegevoegd is het alleen nog maar noodzakelijk om een simpele `<div>` toe te voegen waarin
het weerbericht wordt teruggegeven.

```
<div id="weather"></div>
```

## Hoe werkt dit ?
Wat doen deze scripts nu eigenlijk ?

### simpleWeather-2.3.min.js
Deze is simpelweg een JavaScript framework die gebruikt wordt door de simpleWeather API om gegevens van het weer terug
te krijgen via een ajax call.

### GeolocationandWeather.js
Hier gebeurt eigenlijk al de "magie".

Eerst wordt er gebruik gemaakt van de ingebouwde geolocation van html5:

```
function doGetGeoLocation(){
    if(navigator.geolocation)
    	
    	geocoder = new google.maps.Geocoder();
        navigator.geolocation.getCurrentPosition(handleGetCurrentPosition);
}
```

Deze bepaald de positie die nodig is om jouw locatie te berekenen.
Daarna roept hij de functie handleGetCurrentPosition op waaraan hij de positie meegeeft.

```
function handleGetCurrentPosition(position){
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    codeLatLng(lat, lon);
}
```

Deze gebruikt deze positie om de longitude en latitude (breedtegraad en lengtegraad) te berekenen.
Dit zijn de coördinaten die gebruikt worden op de wereldkaart.

Daarna stuurt hij deze coördinaten door om de plaatsnaam te bepalen.

```
  function codeLatLng(lat, lng) {
    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
      mylocation = results[0].address_components[2].short_name
      
      getPlaceFromFlickr(mylocation, 'output')
      }
    });
  }
```

Dit gebeurt via de implementatie van het 
`<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=false"></script>`
Dit is een library die alle locaties heeft met hun longitude en latitude.

Vanuit deze locatie bepalen we de WOEID (Where on Earth IDentifier) die we later nodig hebben.
Hierbij geven we ook de functie mee die de json output zal opvangen.

```
  function getPlaceFromFlickr(location ,callback){
   // de YQL statement
   var yql = 'select woeid from geo.places where text="'+location+'"';

   // assembling the YQL webservice API
   var url = 'http://query.yahooapis.com/v1/public/yql?q='+
              encodeURIComponent(yql)+'limit 1&format=json&diagnostics='+
              'true&callback='+callback;

   var s = document.createElement('script');
   s.setAttribute('src',url);
   document.getElementsByTagName('head')[0].appendChild(s);
 };
 ```

Volgende functie zal dan een callback krijgen als er een woeid gevonden is en die dan doorsturen naar de weather call
om het weerbericht te verkrijgen.

```
 function output(json){
   if(typeof(json.query.results.place.woeid) != 'undefined'){
     woeid = json.query.results.place.woeid;
   	 weather(woeid);
   }
 }
```

Volgende functie zal dus zoals gezegd een ajax call versturen naar de simpleWeather API met de bepaalde WOEID.
Deze zal dan bij succes een html string aanmaken waarin de temperatuur, foto en andere zaken over het huidige
weerbericht worden weergegeven.

```
function weather(woeid){
     $.simpleWeather({
  	 woeid: woeid ,
     location: '' ,
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
```

[Klik hier voor een tabel met alle mogelijke opties van de API](http://simpleweatherjs.com)

![simpleweather.js logo](http://fc03.deviantart.net/fs70/i/2011/010/4/d/simple_weather_by_dijaysazon-d36unip.png)

#### Simpel weerbericht voor op jouw site #####
[Voorbeeldwebsite](https://rawgithub.com/JonasiDeetens/WeatherForecastTI2Groep07/master/GeolocationandWeather.html)

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
Ook voegen we een link toe naar de stylesheet pagina van de jqueri icons.
Deze wordt dan gebruikt voor de layout van de buttons aan te passen (gebeurt automatisch in onze script).

```
<link href="./GeolocationandWeather.css" rel="Stylesheet">
<link rel="stylesheet" href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" />
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
<div class="weather" id="forecast"></div>
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
Hier binden we ook een click event aan de buttons die we hebben aangemaakt in onze `<div class="weather weer">` die we boven de `<div id="forecast">`
kleven die zorgt voor buttons om van dag te verwisselen (huidig is alleen vandaag en morgen) en de dag van het weerbericht.
De functie `doMorgen` die we hierin zullen binden is ook een call naar de simpleWeatherAPI maar dan met de parameters van tomorrow.

```
  function output(json){
   if(typeof(json.query.results.place.woeid) != 'undefined'){
       woeid = json.query.results.place.woeid;
       $("<div class='weather weer'><input type='button' name='vandaag' id='vandaag' class='ui-icon ui-icon-carat-1-w' /><span class='weatherspan'>Vandaag</span><input type='button' name='morgen' id='morgen' class='ui-icon ui-icon-carat-1-e'/></div>").insertAfter(".weather");
        
       $("#morgen").bind("click", doMorgen);
       $("#vandaag").bind("click", weather);
       weather(woeid);
   }
 }
```

Volgende functies zullen dus zoals gezegd een ajax call versturen naar de simpleWeather API met de bepaalde WOEID.
Deze zal dan bij succes een html string aanmaken waarin de temperatuur, foto en andere zaken over het huidige
weerbericht worden weergegeven.
Ook zal hierbij een button gehide worden die verwijsd naar morgen (als hij op morgen staat) of als hij op
vandaag staat zal de button vandaag gehide worden.

```
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
```

Er is dan nog één functie aanwezig binnen deze functies en dat is de functie `setCss()`.
Deze functie zorgt ervoor dat de grootte van de image en de tekst items zullen aangepast worden naarmate de grootte van 
de `<div id="forecast">`.(Niet failproof)

De beste optie hiervoor is dat de div een width heeft die dubbel zo groot is al zijn height.

[Klik hier voor een tabel met alle mogelijke opties van de API](http://simpleweatherjs.com)

## Aanpassingen
De aanpassingen zijn zeer simpel voor mensen met wat kennis van css.
Je kunt alles vinden in het css bestand GeolocationandWeahter.css, die de div met het id Weather aanpast naar het gewenste
uiterlijk.
Je kunt ook je eigen css eraan toevoegen bij voorwaarde dat je de volgende tekst uit het meegeleverd css bestand verwijderdt.

```
.weather {
  border: solid #B0B0B0;
  border-radius: 5px;
  width:500px;
  height:150px;
  position:absolute;
  margin: -100px 0 0 -250px;
  left:50%;
  top:50%;
  text-align: center;
  background-color: #fffacd; /*LemonChiffon*/
  background-repeat: no-repeat;
}
```

Veel succes en bij enige fouten gelieve mij deze te melden.

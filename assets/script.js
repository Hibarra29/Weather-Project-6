var APIKey = "2c6bc92aef79d306a19b0e97f71db073" 
var city;
var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

fetch(queryURL)
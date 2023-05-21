var APIKey = "2c6bc92aef79d306a19b0e97f71db073" 
var city;
var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

$(document).ready(function () {
    //search button
    $(".searchBtn").on("click", function () {
        var searchCity = $("#citySearch").val();
        //empty input
        $("#citySearch").val("");
        weatherFunction(searchCity);
        weatherForcast(searchCity);
    });

    //search button click feature
    $(".searchBtn").keypress(function (event) {
        var keycode = (event.keycode ? event.keycode : event.which);
        if (keycode === 13) {
            weatherFunction(searchCity);
            weatherForcast(searchCity);
        }
    });

    //previous searches 
    var history = JSON.parse(localStorage.getItem("history")) || [];

    //sets array length
    if (history.length > 0) {
        weatherFunction(history[history.length - 1]);
    }

    //Creates rows 
    for (var i = 0; i < history.length; i++) {
        createRow(history[i]);
    }

    //Search history placement
    function createRow(text) {
        var listItem = $("<li>").addClass("list-group-item").text(text);
        $(".history").append(listItem);
    }

    //When history is clicked
    $(".history").on("click", "li", function () {
        weatherFunction($(this).text());
        weatherForcast($(this).text());
    });



});
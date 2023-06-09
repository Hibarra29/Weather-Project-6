$(document).ready(function () {
var city;
    //search button
    $("#searchBtn").on("click", function () {
        city = $("#citySearch").val();
        //empty input
        $("#citySearch").val("");
        weatherFunction(city);
        weatherForcast(city);
    });

    //search button click feature
    $("#searchBtn").keypress(function (event) {
        if (event.key === "Enter")
        var keycode = (event.keycode ? event.keycode : event.which);
        if (keycode === 13) {
            weatherFunction(city);
            weatherForcast(city);
        }
    });

        //function forcast
        function weatherForcast(city) {
            $.ajax({
                type: "GET",
                url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=2c6bc92aef79d306a19b0e97f71db073&units=imperial",
            }).then(function (data) {
                console.log(data);
                $("#forecast").html("<h3 class =\"mt-4\">5-day forecast:</h3>").append("<div class=\"row\">");
    
                //For Loop through 5 day forecast
                for (var i = 0; i < data.list.length; i++) {
                    if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
    
                        var forTitle = $("<h5>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
                        var forImg = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
                        var forCol = $("<div>").addClass("col-sm-2");
                        var forCard = $("<div>").addClass(".card bg-primary text-white");
                        var forBody = $("<div>").addClass(".card-body p-2");
                        var forHumidity = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
                        var forTemp = $("<p>").addClass("card-text").text("Temperature: " + data.list[i].main.temp + " °F");
              
                        forCol.append(forCard.append(forBody.append(forTitle, forImg, forTemp, forHumidity)));
                        $("#forecast .row").append(forCol);
                    }
    
                }
            })
        }


    function weatherFunction(city) {
      $.ajax({
        type: "GET",
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=2c6bc92aef79d306a19b0e97f71db073",

      }).then(function (data){
        if (history.indexOf(city) === -1) {
            history.push(city);
            localStorage.setItem("history", JSON.stringify(history));
            createRow(city);
        }
        // Clear out
        $(".today").empty();

        var title = $("<h2>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
        var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
        var card = $("<div>").addClass("card-body");
        var cardBody = $("<div>").addClass("card-body");
        var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
        var humidity = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + " %");
        var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + "°F");

        console.log(data)

        var lon = data.coord.lon;
        var lat = data.coord.lat;

        //merge all together
        title.append(img);
        cardBody.append(title,temp,humidity,wind);
        card.append(cardBody);
        $(".today").append(card);
        console.log(data);
      });
    }

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
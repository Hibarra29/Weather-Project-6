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

    function weatherFunction(city) {
      $.ajax({
        type: "GET",
        url: "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=2c6bc92aef79d306a19b0e97f71db073",

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
        var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " K");

        console.log(data)

        var lon = data.coord.lon;
        var lat = data.coord.lat;

        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/uvi?appid=2c6bc92aef79d306a19b0e97f71db073&lat=" + lat + "&lon=" + lon,

        }).then(function (response) {
            console.log(response);

            var uvColor;
            var uvResponse = response.value;
            var uvIndex = $("<p>").addClass("card-text").text("UV Index:");
            var btn = $("<span>").addClass("btn btn-sm").text(uvResponse);

            if (uvResponse < 3) {
                btn.addClass("btn-success");
            } else if (uvResponse < 7) {
                btn.addClass("btn-warning");
            } else {
                btn.addClass("btn-danger");
            }

            cardBody.append(uvIndex);
            $(".today . card-body").append(uvIndex.append(btn));
        });

        //merge all together
        title.append(img);
        cardBody.append(title,temp,humidity,wind);
        card.append(cardBody);
        $(".today").append(card);
        console.log(data);
      });
    }
    //function forcast
    function weatherForcast(city) {
        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=2c6bc92aef79d306a19b0e97f71db073&units=imperial",
        }).then(function (data) {
            console.log(data);
            $("#forecast").html("<h4 class =\"mt-3\">5-day forecast:</h4>").append("<div class=\"row\">");

            //For Loop through 5 day forecast
            for (var i = 0; i < data.list.length; i++) {
                if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {

                    var titleFive = $("<h3>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
                    var imgFive = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
                    var colFive = $("<div>").addClass("col-md-2.5");
                    var cardFive = $("<div>").addClass("card bg-primary text-white");
                    var cardBodyFive = $("<div>").addClass("card-body p-2");
                    var humidFive = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
                    var tempFive = $("<p>").addClass("card-text").text("Temperature: " + data.list[i].main.temp + " °F");
          
                    colFive.append(cardFive.append(cardBodyFive.append(titleFive, imgFive, tempFive, humidFive)));
                    $("#forecast .row").append(colFive);
                }

            }
        })
    }
});
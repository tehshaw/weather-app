// var searchButton = $("#searchBtn");

async function getLocation(url){
    let myObject = await fetch(url);
    let myLocation = await myObject.json();
    console.log("This is the getLocation function");
    console.log(myLocation);
    $("#cityName").text(myLocation[0].name + ", " + myLocation[0].state);
    let lat = myLocation[0].lat;
    let lon = myLocation[0].lon;
    let weatherLoc = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely,alerts&units=imperial&appid=bbf99ce475f76e1bf9b246ed351667b6"
    $("#savedCities").append($("<div>").attr({
        class: "p-md-1"
    }))

    $("#savedCities").children().last().append($("<button>").attr({
        type: "button",
        id: myLocation[0].name,
        class: "btn btn-grey btn-block pastCity"
    }))

    $("#"+myLocation[0].name).text(myLocation[0].name);

    getWeather(weatherLoc)
}


async function getWeather(url){
    let myObject = await fetch(url);
    let myLocation = await myObject.json();
    console.log("This is the getWeather function");
    console.log(myLocation);

    let currentWeather = myLocation.current.weather[0].icon;
    let weatherIcon = "http://openweathermap.org/img/wn/" + currentWeather +"@2x.png"

    $("#cityName").append($("<img>").attr({
        src: weatherIcon,
        width: "50px"
    })
    );


    $("#theTemp").text(myLocation.current.temp + "°F");
    $("#theWind").text(myLocation.current.wind_speed + " MPH");
    $("#theHumidity").text(myLocation.current.humidity + "%");

    var theUV = myLocation.current.uvi
    $("#UVIndex").text(theUV)
    theUV < 3 ? $("#UVIndex").addClass("uv uv-green") :
    theUV < 6 ? $("#UVIndex").addClass("uv uv-yellow") :
    theUV < 8 ? $("#UVIndex").addClass("uv uv-orange") :
    $("#UVIndex").addClass("uv uv-red");

    for (let day = 0; day < 5; day ++){
        let theForecast = myLocation.daily;
        let theDay = $("#day" + day);
        theDay.children("h5").text(moment.unix(theForecast[day].dt).format("MM/DD/YYYY"));
        let details = theDay.children("p");
        console.log(details);
        
        currentWeather = myLocation.daily[day].weather[0].icon
        weatherIcon = "http://openweathermap.org/img/wn/" + currentWeather +"@2x.png";
        let theIcon = document.createElement("img");
        theIcon.setAttribute("src", weatherIcon)
        //remove last weather icon here
        details[0].append(theIcon)
        details[1].textContent = "Temp: " + myLocation.daily[day].feels_like.day + "°F"
        details[2].textContent = "Wind: " + myLocation.daily[day].wind_speed + " MPH"
        details[3].textContent = "Humidity: " + myLocation.daily[day].humidity + "%"

    }

}



$("#searchBtn").on("click", function(){
    let userLoc = $("#searchBox-City").val();
    let testLocation = 'http://api.openweathermap.org/geo/1.0/direct?q=' + userLoc + ',,us&limit=1&appid=bbf99ce475f76e1bf9b246ed351667b6';
    getLocation(testLocation)
});


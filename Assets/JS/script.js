


//takes the city enterd by the user
//this is called AFTER the eventlistner does input validatioon
//gets the city location from the api
//returns to the function that will see if there are more than one result
function getCity(userLoc) {

    let locationLink = 'https://api.openweathermap.org/geo/1.0/direct?q=' + userLoc + ',,us&limit=5&appid=bbf99ce475f76e1bf9b246ed351667b6';
    let cityDetials = locationAPI(locationLink);
    cityDetials.then((data) => {
        console.log(data);
        confirmCity(data);
    })

}

//takes the lat and lon based on the entered city (could be entered or from a previous location)
//returns the weather to the fucntion that will render it on the screen
function getWeather(lat, lon){
    let weatherLoc = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely,alerts&units=imperial&appid=bbf99ce475f76e1bf9b246ed351667b6"
    let theWeather = weatherAPI(weatherLoc);
    theWeather.then((data) => {
        console.log(data);
        showForecast(data);
    })
}

//location API, gets the desired location
async function locationAPI(url){
    let myObject = await fetch(url);
    let myLocation = await myObject.json();
    return myLocation;
}

//weather API, gets the actual weather
async function weatherAPI(url){
    let myObject = await fetch(url);
    let myWeather = await myObject.json();
    return myWeather;
}


//when more than one city of the same name returns from the API
//this function will load a modal and show up to 5 returned cities
// and ask the user to choose one
//if there is only one match it will go right to showing the weather
function confirmCity(data){

    //if the api length is greater than 1, meaning more than one return
    if (data.length > 1) {


        //clear the modal of any buttons that may have been there already
        $("#selectacity").empty();

        //step through each city and build a button in the modal to present to the user
        for (let city of data){
            //create a var to be used as the ID when creating the button
            //since IDs can not have spaces, this will remove any from cities with
            //more than one word in them
            var newID = city.name.replace(" ","")+city.state

            var cityName = city.name + ", " + city.state;
            $("#selectacity").append($("<button>").attr({
                type: "button",
                id: newID,
                lat: city.lat,
                lon: city.lon,
                state: city.state,
                city: city.name,
                class: "btn btn-grey btn-block"
            }))
            $("#"+newID).text(cityName);
            
        }
        //unhide the modal to show the user
        $("#myModal").modal("show");
    }  else{
        //just run the weather if there is only one city
        buildCIty(data[0].name, data[0].state, data[0].lat, data[0].lon);
    }

}

//this is called by either the confimCity function or the eventlistner for the previous cities
//takes the city name, state, lat and lon and prefills the city name on the site
//returns to the get weather to get the actual weather details for the selected city
function buildCIty(cityName, state, lat, lon) {  


    $("#cityName").text(cityName+ ", " + state);
    $("#searchBox-City").val('');
    if($("#"+cityName.replace(" ","")+state).length===0){
        makeAButton(cityName, state, lat, lon);
    }

    getWeather(lat, lon);
}

//this is the last function to fire in the order
//based on the selected city entered by the user and the weather returned from the API
//display the info in the elements already on screen
function showForecast(theWeather){

    let currentWeather = theWeather.current.weather[0].icon;
    let weatherIcon = "http://openweathermap.org/img/wn/" + currentWeather +"@2x.png"

    //adds the current weather icon next to the city name in the current weather box
    $("#cityName").append($("<img>").attr({
        src: weatherIcon,
        width: "50px"
    })
    );

    //loads current weather details
    $("#theTemp").text(theWeather.current.temp + "°F");
    $("#theWind").text(theWeather.current.wind_speed + " MPH");
    $("#theHumidity").text(theWeather.current.humidity + "%");

    //loads the current UV index and color codes the box based on the current index
    var theUV = theWeather.current.uvi
    $("#UVIndex").text(theUV)
    theUV < 3 ? $("#UVIndex").addClass("uv uv-green") :
    theUV < 6 ? $("#UVIndex").addClass("uv uv-yellow") :
    theUV < 8 ? $("#UVIndex").addClass("uv uv-orange") :
    $("#UVIndex").addClass("uv uv-red");

    //clear the icon for the weather in the 4 day forecast
    $(".small-img").empty();

    //load the weather for each of the 5 future days, cards are static and not build
    for (let day = 1; day < 6; day ++){
        let theForecast = theWeather.daily;
        let theDay = $("#day" + day);
        theDay.children("h5").text(moment.unix(theForecast[day].dt).format("MM/DD/YYYY"));
        let details = theDay.children("p");
        
        currentWeather = theWeather.daily[day].weather[0].icon
        weatherIcon = "http://openweathermap.org/img/wn/" + currentWeather +"@2x.png";
        let theIcon = document.createElement("img");
        theIcon.setAttribute("src", weatherIcon)

        details[0].append(theIcon)
        details[1].textContent = "Temp: " + theWeather.daily[day].feels_like.day + "°F"
        details[2].textContent = "Wind: " + theWeather.daily[day].wind_speed + " MPH"
        details[3].textContent = "Humidity: " + theWeather.daily[day].humidity + "%"

    }

    
}

//when a user enters a city this will take the details from the location search
//checks to see if there is already a button with the same locatiob anme
//if this is a unqiue search, generate a button in the previous serach field
//log this city to local storage to the buttons will load next time the page loads
function makeAButton(cityName, state, lat, lon){

    var newID = cityName.replace(" ","")+state;
    $("#savedCities").append($("<div>").attr({
        class: "p-md-1"
        }))

        $("#savedCities").children().last().append($("<button>").attr({
            type: "button",
            id: newID,
            city: cityName,
            state: state,
            class: "btn btn-grey btn-block pastCity",
            lat: lat,
            lon: lon
        }))

        localStorage.setItem(cityName, JSON.stringify({city: cityName, state: state, lat: lat, lon: lon}))

        $("#"+newID).text(cityName+ ", " + state);

}


//listener for the search field where the user enters a city
//checks to see if input is empty or not before submitting input
$("#searchBtn").on("click", event => {
    event.preventDefault()
    let userLoc = $("#searchBox-City").val();
    userLoc ? getCity(userLoc) : alert("Please enter a city name.");

});


//lisner for the saved cities buttons
//gets the details for the selected cities that are saved in the attr on the selected button
//skips the city search method and goes right to building the weather
$("#savedCities").on("click", "button", function () {  
    let buttonLat = $(this).attr("lat");
    let buttonLon = $(this).attr("lon");
    let buttonState = $(this).attr("state");
    let buttonCity = $(this).attr("city");
    buildCIty(buttonCity,buttonState,buttonLat,buttonLon);

});

//listner for the duplicate city modal box
//gets the details for the selected cities that are saved in the attr on the selected button
//skips the city search method and goes right to building the weather
$("#selectacity").on("click", "button", function () {  
    let buttonLat = $(this).attr("lat");
    let buttonLon = $(this).attr("lon");
    let buttonState = $(this).attr("state");
    let buttonCity = $(this).attr("city");
    $("#myModal").modal("hide");
    $("#selectacity").empty();
    buildCIty(buttonCity,buttonState,buttonLat,buttonLon);
    
});

//this will load all previous searched cities from localStorage when the page loads
$( function(){
    let keys = Object.keys(localStorage);
    for (let key of keys){
        cityInfo = JSON.parse(localStorage.getItem(key));
        makeAButton(cityInfo.city, cityInfo.state, cityInfo.lat, cityInfo.lon )
    }
});


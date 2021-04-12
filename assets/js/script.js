// LIVE DATE AND TIME DISPLAY ELEMENT
// reference to important DOM custom elements
var timeDisplayEl = $('#currentDay');

// adding the current day, date and time in the jubotron
function displayTime (){
    var liveDay = moment().format('dddd');
    var liveDateTime = moment().format('MMMM Do YYYY, h:mm:ss a');
    timeDisplayEl.text(liveDay + ", " + liveDateTime);
}
// updating seconds every second
setInterval(displayTime, 1000);

// function for dispaly screen
function displayScreen() {
    var enterCity = document.getElementById("enter-city")
    var searchButton = document.getElementById("search-button")
    var clearButton = document.getElementById("clear-history")
    var history = document.getElementById("history");
    var cityName = document.getElementById("city-name")
    var liveIcon = document.getElementById("live-icon");
    var temperature = document.getElementById("temp");
    var windSpeed = document.getElementById("wind-speed");
    var humidity = document.getElementById("humidity");
    var uvIndex = document.getElementById("uv-index");
    var apiKey = "8f4926c0803cbcf21b36ee114402072b";
    var todayWeather = document.getElementById("today-weather")
    var searchHistory = JSON.parse(localStorage.getItem("search")) || []

    function getWeather(cityDisplayName) {
        // Execute a current weather get request from open weather api
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityDisplayName + "&appid=" + apiKey;
        fetch(queryURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data)
                
                // removing no display to display
                todayWeather.classList.remove("d-none");
                                
                // display city name, method: string interpolation
                cityName.innerHTML = `${data.name} ${" (Today's weather)"}`
                    
                // display current situation iconx
                var weatherIcon = data.weather[0].icon;
                liveIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
                liveIcon.setAttribute("alt", data.weather[0].description);
                    
                // display current temperature, method: string interpolation
                temperature.innerHTML = `${"Temperature: "} ${Kelvin2Celsius(data.main.temp)} ${" &#176C"}`           

                // display current wind speed conditions, method: string interpolation
                windSpeed.innerHTML = `${"Wind Speed: "} ${mS2KmH(data.wind.speed)} ${" Km/h"}`

                // display current humidity, method: string interpolation
                humidity.innerHTML =  `${"Humidity: "} ${data.main.humidity} ${"%"}`
                
                // display current UV index, method: string interpolation
                uvIndex.innerHTML =  `${"UV Index: "} ${data.current.uvi}`
                currentUVIndex(data.current.uvi, uvIndex);
            });
        }
    
        function currentUVIndex(index, uvIndex) {
            // Updates the UV Index indicator
            // When UV Index is good (<4): this will shows green box;
            if (index < 4) {
                uvIndex.setAttribute("class", "badge badge-success");
            } 
            // when UV index is OK (between 4 and 9, exlusive): it will show yellow box;
            else if (index < 8) {
                uvIndex.setAttribute("class", "badge badge-warning");
            } 
            // when UV index is bad (more than 8): it will show in red box;
            else {
                uvIndex.setAttribute("class", "badge badge-danger");
            }
        }
        
    // converting kelvin (default) to celsius
    function Kelvin2Celsius(K) {
        return Math.floor(K - 273.15);
    }

    // converting meter/sec (default) to km per hour 
    function mS2KmH(M) {
        return Math.floor(M * 3.6);
    }
            
    // accessing the city name from search button
    searchButton.addEventListener("click", function () {
        var searchTerm = enterCity.value;
        getWeather(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        renderSearchHistory();
        })

    function renderSearchHistory(){
    }
    
    // LOCAL STORAGE
        // store data in local storage 
        // Display Storage on screen
        // display weather for city from history list 
        // Clear history
 
}

displayScreen();
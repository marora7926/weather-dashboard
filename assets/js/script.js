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
    var clearHistory = document.getElementById("clear-history")
    var history = document.getElementById("history");
    var cityName = document.getElementById("city-name")
    var weatherDescription = document.getElementById("weather-description")
    var liveIcon = document.getElementById("live-icon");
    var temperature = document.getElementById("temp");
    var windSpeed = document.getElementById("wind-speed");
    var humidity = document.getElementById("humidity");
    var uvIndex = document.getElementById("uv-index");
    var apiKey = "8f4926c0803cbcf21b36ee114402072b";
    var todayWeather = document.getElementById("today-weather")
    var fiveDayHeader = document.getElementById("fiveday-header");
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
                
                // removing "no display" to "display"
                todayWeather.classList.remove("d-none");
                                
                // display city name, method: string interpolation
                cityName.innerHTML = `${data.name} ${" (Today's weather)"}`
                 
                // display weather description
                weatherDescription.innerHTML = data.weather[0].description;

                // display current situation icon
                var weatherIcon = data.weather[0].icon;
                liveIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
                                    
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
        
            // Get 5 day forecast for this city
            var forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + data.id + "&appid=" + APIKey;
            fetch(forecastQueryURL)
                .then(function (response) {
                return response.json();
                })
                .then(function (data) {
                    fiveDayHeader.classList.remove("d-none");
                    
                    //  Parse response to display forecast for next 5 days
                    var forecast5Days = document.querySelectorAll(".forecast");
                    for (i = 0; i < forecast5Days.length; i++) {
                        forecast5Days[i].innerHTML = "";
                        var forecastIndex = i * 8 + 4;
                        var forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                        var forecastDay = forecastDate.getDate();
                        var forecastMonth = forecastDate.getMonth() + 1;
                        var forecastYear = forecastDate.getFullYear();
                        var forecastDate = document.createElement("p");
                        forecastDate.setAttribute("class", "mt-3 mb-0 forecast-date");
                        forecastDate.innerHTML = forecastDay + "/" + forecastMonth + "/" + forecastYear;
                        forecast5Days[i].append(forecastDate);

                        // Icon for current weather
                        var forecastWeather = document.createElement("img");
                        forecastWeather.setAttribute("src", "https://openweathermap.org/img/wn/" + data.list[forecastIndex].weather[0].icon + "@2x.png");
                        forecastWeather.setAttribute("alt", data.list[forecastIndex].weather[0].description);
                        forecast5Days[i].append(forecastWeather);
                        
                        // forecast temperature
                        var forecastTemp = document.createElement("p");
                        forecastTemp.innerHTML = "Temp: " + Kelvin2Celsius(data.list[forecastIndex].main.temp) + " &#176C";
                        forecast5Days[i].append(forecastTemp);
                        
                        // forecast humidity
                        var forecastHumidity = document.createElement("p");
                        forecastHumidity.innerHTML = "Humidity: " + data.list[forecastIndex].main.humidity + "%";
                        forecast5Days[i].append(forecastHumidity);
                    }
                })
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
    
    // Clear history
    clearHistory.addEventListener("click", function () {
        localStorage.clear();
        searchHistory = [];
        renderSearchHistory();
    })

    // defining the rederSearchHistory function
    function renderSearchHistory() {
        history.innerHTML = "";
        for (let i = 0; i < searchHistory.length; i++) {
            var historyEntry = document.createElement("input");
            historyEntry.setAttribute("type", "text");
            historyEntry.setAttribute("readonly", true);
            historyEntry.setAttribute("class", "form-control d-block bg-dark text-light");
            historyEntry.setAttribute("value", searchHistory[i]);
            historyEntry.addEventListener("click", function () {
                getWeather(historyEntry.value);
            })
            history.append(historyEntry);
        }
    } 
}

displayScreen();
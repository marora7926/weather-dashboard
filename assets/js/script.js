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
        // Execute a current weather get request from open weather api, Note ALTERNATE way of fetching
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityDisplayName + "&appid=" + apiKey;
        axios.get(queryURL)
            .then(function (response) {
                console.log(response)
                                
                // removing "no display" to "display"
                todayWeather.classList.remove("d-none");
                                
                // display city name, method: string interpolation
                cityName.innerHTML = `${response.data.name} ${" (Current weather)"}`
                 
                // display weather description
                weatherDescription.innerHTML = response.data.weather[0].description;

                // display current situation icon
                var weatherIcon = response.data.weather[0].icon;
                liveIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
                                    
                // display current temperature, method: string interpolation
                temperature.innerHTML = `${"Temperature: "} ${Kelvin2Celsius(response.data.main.temp)} ${" &#176C"}`           

                // display current wind speed conditions, method: string interpolation
                windSpeed.innerHTML = `${"Wind Speed: "} ${mS2KmH(response.data.wind.speed)} ${" Km/h"}`

                // display current humidity, method: string interpolation
                humidity.innerHTML =  `${"Humidity: "} ${response.data.main.humidity} ${"%"}`
            
                // display current UV index
                let lat = response.data.coord.lat;
                let lon = response.data.coord.lon;
                let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
                axios.get(UVQueryURL)
                .then(function (response) {
                                        
                    let uvIndexVar = document.createElement("span");
                    
                    // Updates the UV Index indicator
                    // When UV Index is good (<4): this will shows green box;
                    if (response.data[0].value < 4 ) {
                       uvIndexVar.setAttribute("class", "badge badge-success");
                    }
                    // when UV index is OK (between 4 and 9, exlusive): it will show yellow box;
                    else if (response.data[0].value < 8) {
                        uvIndexVar.setAttribute("class", "badge badge-warning");
                    } 
                    // when UV index is bad (more than 8): it will show in red box;
                    else {
                        uvIndexVar.setAttribute("class", "badge badge-danger");
                    }
                    console.log(response.data[0].value)
                    uvIndexVar.innerHTML = response.data[0].value;
                    uvIndex.innerHTML = "UV Index: ";
                    uvIndex.append(uvIndexVar);
                });
               
                // Get 5 day forecast for this city; Note ALternate way for fetch from API\
                var cityId = response.data.id;
                var forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityId + "&appid=" + apiKey;
                axios.get(forecastQueryURL)
                    .then(function (response) {
                        fiveDayHeader.classList.remove("d-none");
                        console.log(response);
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
                            forecastWeather.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
                            forecastWeather.setAttribute("alt", response.data.list[forecastIndex].weather[0].description);
                            forecast5Days[i].append(forecastWeather);
                                
                            // forecast temperature
                            var forecastTemp = document.createElement("p");
                            forecastTemp.innerHTML = "Temp: " + Kelvin2Celsius(response.data.list[forecastIndex].main.temp) + " &#176C";
                            forecast5Days[i].append(forecastTemp);
                                
                            // forecast humidity
                            var forecastHumidity = document.createElement("p");
                            forecastHumidity.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
                            forecast5Days[i].append(forecastHumidity);
                        }
                    });
            });
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
    
    renderSearchHistory();
    if (searchHistory.length > 0) {
        getWeather(searchHistory[searchHistory.length - 1]);
    }
}

displayScreen();
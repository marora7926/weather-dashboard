// LIVE DATE AND TIME DISPLAY ELEMENT
// reference to important DOM custom elements
var timeDisplayEl = $('#currentDay');

// adding the current day, date and time in the jubotron
function displayTime (){
    var liveDay = moment().format('dddd');
    var liveDateTime = moment().format('MMMM Do YYYY, h:mm:ss a');
    timeDisplayEl.text(liveDay + ", " + liveDateTime + " AEDT");
}
// updating seconds every second
setInterval(displayTime, 1000);

// function for dispaly screen
function displayScreen() {
    var cityName = document.getElementById("#enter-city")
    var searchButton = document.getElementById("#search-button")
    var clearButton = document.getElementById("#clear-history")
    

    // DISPLAY TODAYS WEATHER
        // display city name
        // display icon
        // display temperature
        // display wind speed
        // display humidity
        // display uv index

    // FORECAST FIVE-DAYS WEATHER
        // display date
        // display icon
        // display temperature
        // display wind speed
        // display humidity

    // LOCAL STORAGE
        // store data in local storage 
        // Display Storage on screen
        // display weather for city from history list 
        // Clear history

}

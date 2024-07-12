const searchButton = document.getElementById("searchBtn");
const citySearched = document.getElementById("citySearch");
const cityHistory = document.getElementById("citiesHistory");
const todayWeather = document.getElementById("todaysWeather");
const weekWeather = document.getElementById("weeksWeather");
const APIKey = "2bba1f2c6cde0db83b53acad088f3259";

 // Function to get past cities from localStorage or make an empty array if there are none
function getSearchedCities() {
    const cities = localStorage.getItem('searchedCities');
   return cities ? JSON.parse(cities) : [];
}

// Saves the searched cities to localStorage
 function saveCities(city) {
    let searchedCities = getSearchedCities();
    // Makes sure that we are not creating a duplicate of the same city by searching through the past cities that were saved to local storage. 
   if (!searchedCities.includes(city)) {
        searchedCities.push(city);
       localStorage.setItem('searchedCities', JSON.stringify(searchedCities));
      // After the new city is added to the local storage we will render the visual for the forcast 
       searchHistory();
    }}

 function searchHistory() {
    //Creates the place where the little buttons for each of the cities in localStorage 
    cityHistory.innerHTML = "";
     const searchedCities = getSearchedCities();
     //creates a button for each city in the localStorage that has a class of city-btn and is able to be clicked
    searchedCities.forEach(city => {
        const cityBtn = document.createElement("button");
        cityBtn.textContent = city;
        cityBtn.classList.add("city-btn");
        cityBtn.addEventListener("click", () => {
            //when the city is clicked the weather on the page will be changed to that cities
            getTodayWeather(city);
         });
         //places the buttons for each city into the place we created for them in the HTML
         cityHistory.appendChild(cityBtn);
    });
 }

// gets current weather for the city
function getTodayWeather(city) {
    //Url for the API that will get the data for the current day
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=imperial`;
    fetch(URL)
    .then(response => response.json())
    //the resposnse will give us the data we want to use for the current day display. 
    .then(data => {
        showWeather(data);
        getForecast(city);
    })
    .catch(error => {
        console.error('Error! Can not get the weather for today', error);
    });
}

// Function to render current weather data
function showWeather(data) {
    //this gets the weather icon code from the weather data 
    iconcode = data.weather[0].icon
    //console.log(iconcode);
    // this uses the icon code and gets the image coresponding to the code
    var iconURL = "http://openweathermap.org/img/w/" + iconcode + ".png"
    todayWeather.innerHTML = `
        <h2>${data.name}, ${data.sys.country}(${new Date().toLocaleDateString()})</h2>
        <p><img id="icon" src="${iconURL}" alt="Weather icon"></p>
        <p>Temp: ${data.main.temp} °F</p>
        <p>Wind: ${data.wind.speed} mph</p>
        <p>Humidity: ${data.main.humidity}%</p>
        
    `;
}

// gets forecast data for a city
function getForecast(city) {
    const URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}&units=imperial`;
    fetch(URL)
    .then(response => response.json())
    .then(data => {
        weekForecast(data);
    })
    .catch(error => {
        console.error('Error! Can not get the weather for the week', error);
    });
}

// gets weather forecast data for the 'week'
function weekForecast(data) {
    weekWeather.innerHTML = "<h3>5-dayForcast:</h3>";
    const forecastList = data.list.filter((item, index) => index % 8 === 0); // Gets forecast for every 24 hours (8 forecasts per day)
    forecastList.forEach(item => {
    iconcode = item.weather[0].icon
    console.log(iconcode);
    var iconURL = "http://openweathermap.org/img/w/" + iconcode + ".png"
        const forecastItem = document.createElement("div");
        forecastItem.classList.add("forecast-item");
        forecastItem.innerHTML = `
            <h3>${new Date(item.dt * 1000).toLocaleDateString()}</h3>
            <p><img id="icon" src="${iconURL}" alt="Weather icon"></p>
            <p>Temp: ${item.main.temp} °F</p>
            <p>Wind: ${item.wind.speed} mph</p>
            <p>Humidity: ${item.main.humidity}%</p>
            `;
        weekWeather.appendChild(forecastItem);
    });
}

// Event listener for form submission
searchButton.addEventListener("submit", function(event){
    event.preventDefault();
    const cityName = citySearched.value.trim();
    if (cityName) {
        saveCities(cityName);
        getTodayWeather(cityName);
    } else {
        alert('Error! Please enter a City to see the Weather.');
    }
});

//Gets the past searched cities from the local storage and makes buttons for them even if a new city isn't searched
searchHistory();

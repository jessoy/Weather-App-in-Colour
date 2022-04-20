// imports
import {
  getDay,
  getSunlightHTML,
  getSunlightHTMLLessLight,
  calculateSunEvent,
  getAndWriteWeatherHTML,
  validateInput,
} from "./utils.js";
import { apiSearchableLocationUrl } from "./config.js";
import { apiCityUrl, apiDailyUrl } from "./config.js";

// DOM elements selection
export const weatherContainer = document.getElementById("weather-container");
const title = document.getElementById("title");
const searchButton = document.getElementById("searchButton");
const searchLocation = document.getElementById("searchLocation");
const weatherContainerHTML = document.getElementById("weather-container");

// get users location on app starting
navigator.geolocation.getCurrentPosition(success, showErrorMessage);

//
searchButton.addEventListener("click", function () {
  getCoords(document.getElementById("inputValue").value);
});

// gets coordinates from a city input
async function getCoords(userInputCity) {
  // quit early functionailty if an invalid city is entered
  if (!validateInput(userInputCity)) {
    error.message = "Failed Validation, please enter a valid location";
    showErrorMessage(error);
    return;
  }

  // gets required data (long and lat) from API + gets weather data
  try {
    let {
      data: {
        coord: { lat, lon },
      },
    } = await axios.get(apiSearchableLocationUrl(userInputCity));

    if (lat === undefined || lon === undefined)
      throw new Error("Data undefined");

    getWeather(lat, lon);
  } catch (error) {
    showErrorMessage(error);
  }
}

function success(result) {
  const { latitude, longitude } = result.coords;

  getWeather(latitude, longitude);
}

// returns error message and re-writes heading to explain issue
function showErrorMessage(error) {
  weatherContainerHTML.style.display = "none";
  searchLocation.style.display = "none";
  title.innerHTML = error.message;

  // if error contains a error code, returns cat image of error code, else nothing
  try {
    let errorCode = error.response.status;
    let img = `<img src="https://http.cat/${errorCode}" alt="image showing cat and error code ${errorCode}">`;
    title.insertAdjacentHTML("afterend", img);
  } catch (error) {}
}

// gets weather from coordinates + destructures
async function getWeather(latitude, longitude) {

  try {
    let {
      data: { city, list },
    } = await axios.get(apiCityUrl(latitude, longitude));
    let {
      data: { daily },
    } = await axios.get(apiDailyUrl(latitude, longitude));

    if (city === undefined || list === undefined || daily === undefined)
      throw new Error("Data undefined");

    // writes city name into heading
    setTitleText(city.name);

    // converts data
    let weatherData = { item: list };
    convertWeatherData(weatherData.item);

    let sunlightData = { sunrise: daily };
    calculateDaylight(sunlightData.sunrise);
  } catch (error) {
    // if error message contians network - says netwrok error
    if (error.toString().includes("Network")) {
      error.message = "Network Error";
    }

    // function to display errors to user
    showErrorMessage(error);
  }
}

// writes city name into heading
function setTitleText(text) {
  title.textContent = `What's the outlook like in ${text}?`;
}

// checks if data exists already in app HTML, and overwrites it
function convertWeatherData(weatherData) {
  if (weatherContainer.innerHTML === "") {
    getAndWriteWeatherHTML(weatherData);
  } else {
    weatherContainer.innerHTML = "";
    getAndWriteWeatherHTML(weatherData);
  }
}

// calculates increase or decrease in minutes of sunlight per day
function calculateDaylight(sunlightData) {
  let i = 0;
  const { dt: timestamp, sunset, sunrise } = sunlightData[i];
  let yesterday = getDay(timestamp, "weekday");
  let minutesOfSunYesterday = (sunset - sunrise) / 60;

  for (let i = 1; i < sunlightData.length - 2; i++) {
    const { dt: timestamp, sunset, sunrise } = sunlightData[i];
    const today = getDay(timestamp, "weekday");

    const minutesOfSunToday = (sunset - sunrise) / 60;
    const difference = (minutesOfSunToday - minutesOfSunYesterday).toFixed(2);
    const sunsetTime = calculateSunEvent(sunset);
    const sunriseTime = calculateSunEvent(sunrise);

    updateDOM(today, difference, yesterday, sunsetTime, sunriseTime);

    minutesOfSunYesterday = minutesOfSunToday;
    yesterday = today;
  }
}

// if there is a positive change in minutes of sunlight prints positive message, else prints negative message
function updateDOM(today, difference, yesterday, sunset, sunrise) {
  let firstInDayCard = document.getElementsByClassName(
    `weather-card ${today}`
  )[0];
  const sunriseInfoHtml =
    difference > 0
      ? getSunlightHTML(today, difference, yesterday, sunset, sunrise)
      : getSunlightHTMLLessLight(today, difference, yesterday, sunset, sunrise);
  firstInDayCard.insertAdjacentHTML("beforebegin", sunriseInfoHtml);
}

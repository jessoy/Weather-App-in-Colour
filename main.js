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


export const weatherContainer = document.getElementById("weather-container");
const title = document.getElementById("title");
const searchButton = document.getElementById("searchButton");
const searchLocation = document.getElementById("searchLocation");
const weatherContainerHTML = document.getElementById("weather-container");

navigator.geolocation.getCurrentPosition(success, error);

searchButton.addEventListener("click", function () {
  getCoords(document.getElementById("inputValue").value);
});

async function getCoords(userInputCity) {
  if (!validateInput(userInputCity)) {
    error.message = "Failed Validation, please enter a valid location";
    showErrorMessage(error);
    return;
  }

  try {
    let {
      data: {
        coord: { lat, lon },
      },
    } = await axios.get(apiSearchableLocationUrl(userInputCity));

    // lat = undefined;

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

function error(error) {
  // console.log(error);
  showErrorMessage(error);
}

function showErrorMessage(error) {
  weatherContainerHTML.style.display = "none";
  searchLocation.style.display = "none";
  title.innerHTML = error.message;

  try {
    let errorCode = error.response.status;
    let img = `<img src="https://http.cat/${errorCode}" alt="image showing cat and error code ${errorCode}">`;
    title.insertAdjacentHTML("afterend", img);
  } catch (error) {}
}

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

    setTitleText(city.name);

    let weatherData = { item: list };
    convertWeatherData(weatherData.item);

    let sunlightData = { sunrise: daily };
    calculateDaylight(sunlightData.sunrise);
  } catch (error) {
    // console.log("an error occured: " + error);

    if (error.toString().includes("Network")) {
      error.message = "Network Error";
    }

    showErrorMessage(error);
  }
}

function setTitleText(text) {
  title.textContent = `What's the outlook like in ${text}?`;
}

function convertWeatherData(weatherData) {
  if (weatherContainer.innerHTML === "") {
    getAndWriteWeatherHTML(weatherData);
  } else {
    weatherContainer.innerHTML = "";
    getAndWriteWeatherHTML(weatherData);
  }
}

function calculateDaylight(sunlightData) {
  // console.log(sunlightData);
  let i = 0;
  const { dt: timestamp, sunset, sunrise } = sunlightData[i];
  let yesterday = getDay(timestamp, "weekday");
  let minutesOfSunYesterday = (sunset - sunrise) / 60;

  for (let i = 1; i < sunlightData.length - 2; i++) {
    const { dt: timestamp, sunset, sunrise } = sunlightData[i];
    //console.log(i); // running 5 times
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

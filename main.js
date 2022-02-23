import {
  getDay,
  getHTML,
  getSunlightHTML,
  calculateSunEvent,
} from "./utils.js";

let locationCoords;
const weatherContainer = document.getElementById("weather-container");
const title = document.getElementById("title");
const searchButton = document.getElementById("searchButton");

searchButton.addEventListener("click", function getUserInputCity() {
  getCoords(document.getElementById("inputValue").value.toLowerCase());
});

async function getCoords(userInputCity) {
  const url3 = `http://api.openweathermap.org/data/2.5/weather?q=${userInputCity}&appid=3d7c4f7a94f03f1bc72f4928c291ae0d&units=metric`;

  try {
    let locationInfo = await axios.get(url3);

    getWeather(locationInfo.data.coord.lat, locationInfo.data.coord.lon);
  } catch (error) {
    console.log("please enter a city" + error);
  }
}

navigator.geolocation.getCurrentPosition(success, error);

function success(result) {
  locationCoords = result.coords;

  const latitude = locationCoords.latitude;
  const longitude = locationCoords.longitude;

  getWeather(latitude, longitude);
}

function error(error) {
  console.log(error);
}

async function getWeather(latitude, longitude) {
  const url1 = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=3d7c4f7a94f03f1bc72f4928c291ae0d&units=metric
  `;
  const url2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,current&appid=3d7c4f7a94f03f1bc72f4928c291ae0d&units=metric
  `;

  try {
    let weatherData = await axios.get(url1);
    let sunlightData = await axios.get(url2);

    setTitleText(weatherData.data.city.name);

    weatherData = { item: weatherData.data.list };
    convertWeatherData(weatherData.item);

    sunlightData = sunlightData.data.daily;
    sunlightData = { sunrise: sunlightData };
    calculateDaylight(sunlightData.sunrise);
  } catch (error) {
    console.log("an error occured: " + error);
  }
}

function setTitleText(text) {
  title.textContent = `What's the outlook like in ${text}?`;
}

function convertWeatherData(weatherData) {
  let weather;

  for (let i = 0; i < weatherData.length; i++) {
    //console.log(i); // runs 40 times
    weather = weatherData[i];
    const day = getDay(weatherData[i].dt, "weekday");
    const time = getDay(weatherData[i].dt, "time");

    const html = getHTML(weather, day, time);
    weatherContainer.insertAdjacentHTML("beforeend", html);

    // i = i + 1;
  }
}

function calculateDaylight(sunlightData) {
  let minutesOfSunToday;
  let minutesOfSunYesterday = (
    (sunlightData[0].sunset - sunlightData[0].sunrise) /
    60
  ).toFixed(2);
  let yesterday = getDay(sunlightData[0].dt, "weekday");

  for (let i = 1; i < sunlightData.length - 2; i++) {
    //console.log(i); // running 5 times
    const today = getDay(sunlightData[i].dt, "weekday");

    minutesOfSunToday = (
      (sunlightData[i].sunset - sunlightData[i].sunrise) /
      60
    ).toFixed(2);
    const difference = (minutesOfSunToday - minutesOfSunYesterday).toFixed(2);
    const sunsetTime = calculateSunEvent(sunlightData[i].sunset);
    const sunriseTime = calculateSunEvent(sunlightData[i].sunrise);

    updateDOM(today, difference, yesterday, sunsetTime, sunriseTime);

    minutesOfSunYesterday = minutesOfSunToday;
    yesterday = today;
  }
}

function updateDOM(today, difference, yesterday, sunset, sunrise) {
  let firstInDayCard = document.getElementsByClassName(
    `weather-card ${today}`
  )[0];
  const sunriseInfoHtml = getSunlightHTML(
    today,
    difference,
    yesterday,
    sunset,
    sunrise
  );
  firstInDayCard.insertAdjacentHTML("beforebegin", sunriseInfoHtml);
}

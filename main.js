import {
  getDay,
  getHTML,
  getSunlightHTML,
  calculateSunEvent,
  getAndWriteWeatherHTML,
} from "./utils.js";

// let locationCoords;
export const weatherContainer = document.getElementById("weather-container");
const title = document.getElementById("title");
const searchButton = document.getElementById("searchButton");
let userInputCity;

navigator.geolocation.getCurrentPosition(success, error);

searchButton.addEventListener("click", function getUserInputCity() {
  userInputCity = document.getElementById("inputValue").value.toLowerCase();
  getCoords(userInputCity);
});

async function getCoords(userInputCity) {
  const url3 = `http://api.openweathermap.org/data/2.5/weather?q=${userInputCity}&appid=3d7c4f7a94f03f1bc72f4928c291ae0d&units=metric`;

  try {
    let locationInfo = await axios.get(url3);

    const { lat: latitude, lon: longitude } = locationInfo.data.coord;

    getWeather(latitude, longitude);
  } catch (error) {
    console.log("please enter a city" + error);
  }
}

function success(result) {
  const { latitude, longitude } = result.coords;

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
  if (weatherContainer.innerHTML === "") {
    console.log("no data yet");
    getAndWriteWeatherHTML(weatherData);
  } else {
    console.log("writing new data");
    weatherContainer.innerHTML = "";
    getAndWriteWeatherHTML(weatherData);
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

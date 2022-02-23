import { getDay, getHTML, getSunlightHTML, calculateSunEvent } from "./utils.js";

let locationCoords;
const weatherContainer = document.getElementById("weather-container");
const title = document.getElementById("title");

navigator.geolocation.getCurrentPosition(success, error);

function success(result) {
  locationCoords = result.coords;

  getWeather();
}

function error(error) {
  console.log(error);
}

async function getWeather() {
  const url1 = `http://api.openweathermap.org/data/2.5/forecast?lat=${locationCoords.latitude}&lon=${locationCoords.longitude}&appid=3d7c4f7a94f03f1bc72f4928c291ae0d&units=metric
  `;
  const url2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${locationCoords.latitude}&lon=${locationCoords.longitude}&exclude=minutely,hourly,current&appid=3d7c4f7a94f03f1bc72f4928c291ae0d&units=metric
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
  let minutesOfSunYesterday = ((sunlightData[0].sunset - sunlightData[0].sunrise) /60).toFixed(2);
  let yesterday = getDay(sunlightData[0].dt, "weekday");

  for (let i = 1; i < sunlightData.length - 2; i++) {
    //console.log(i); // running 5 times
    const today = getDay(sunlightData[i].dt, "weekday");

    minutesOfSunToday = ((sunlightData[i].sunset - sunlightData[i].sunrise) / 60).toFixed(2);
    const difference = (minutesOfSunToday - minutesOfSunYesterday).toFixed(2);
    const sunsetTime = calculateSunEvent(sunlightData[i].sunset);
    const sunriseTime = calculateSunEvent(sunlightData[i].sunrise);

    updateDOM(
      today,
      difference,
      yesterday,
      sunsetTime,
      sunriseTime
    );

    minutesOfSunYesterday = minutesOfSunToday;
    yesterday = today;
  }
}

function updateDOM(today, difference, yesterday, sunset, sunrise) {

  let firstInDayCard = document.getElementsByClassName(`main-info ${today}`)[0];
  const sunriseInfoHtml = getSunlightHTML(today, difference, yesterday, sunset, sunrise);
  firstInDayCard.insertAdjacentHTML("beforebegin", sunriseInfoHtml) 
}

/*
https://openweathermap.org/weather-conditions
*/
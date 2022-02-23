import { getDay, getHTML, calculateSunEvent } from "./utils.js";

let locationCoords;
// let userLocation;
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
    weather = weatherData[i];
    const day = getDay(weatherData[i].dt * 1000, "weekday");
    const time = getDay(weatherData[i].dt * 1000, "time");

    const html = getHTML(weather, day, time);
    weatherContainer.insertAdjacentHTML("beforeend", html);

    // i = i + 1;
    // updateDOM()
  }
}

function calculateDaylight(sunlightData) {
  let minutesOfSunToday;
  let minutesOfSunYesterday = (
    (sunlightData[0].sunset - sunlightData[0].sunrise) /
    60
  ).toFixed(2);
  let yesterday = getDay(sunlightData[0].dt * 1000, "weekday");

  for (let i = 1; i < sunlightData.length - 2; i++) {
    const today = getDay(sunlightData[i].dt * 1000, "weekday");

    minutesOfSunToday = (
      (sunlightData[i].sunset - sunlightData[i].sunrise) /
      60
    ).toFixed(2);
    const difference = (minutesOfSunToday - minutesOfSunYesterday).toFixed(2);
    // console.log(`${today} has ${difference} minutes more sunlight than day ${yesterday}`);

    updateDOM(
      today,
      difference,
      yesterday,
      sunlightData[i].sunset,
      sunlightData[i].sunrise
    );

    minutesOfSunYesterday = minutesOfSunToday;
    yesterday = today;
  }
}

function updateDOM(today, difference, yesterday, sunset, sunrise) {
  let infoBanner = document.getElementsByClassName(
    `additional-info ${today}`
  )[0];
  infoBanner.innerHTML = `Welcome to <b>${today}</b>, \n 
  it's nice here, 
  we have ${difference} minutes more sunlight than ${yesterday}`;

  let sunsetDate = calculateSunEvent(sunset);
  let sunriseDate = calculateSunEvent(sunrise);

  const sunriseHtml = getSunlightHTML(sunriseDate, sunsetDate, today);
  infoBanner.insertAdjacentHTML("afterend", sunriseHtml);
}

function getSunlightHTML(sunriseDate, sunsetDate, today) {
  return `<div class="sunlightInformation"> 
              <div class="sunrise ${today}">Sunrise: ${sunriseDate}</div>
              <div class="sunset ${today}">Sunset: ${sunsetDate}</div>
          </div>`;
}

/*
https://openweathermap.org/weather-conditions
*/

import {
  getDay,
  getSunlightHTML,
  getSunlightHTMLLessLight,
  calculateSunEvent,
  getAndWriteWeatherHTML,
} from "./utils.js";

export const weatherContainer = document.getElementById("weather-container");
const title = document.getElementById("title");
const searchButton = document.getElementById("searchButton");

navigator.geolocation.getCurrentPosition(success, error);

searchButton.addEventListener("click", function () {
  getCoords(document.getElementById("inputValue").value.toLowerCase());
});

async function getCoords(userInputCity) {
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${userInputCity}&appid=3d7c4f7a94f03f1bc72f4928c291ae0d&units=metric`;

  try {
    let {
      data: {
        coord: { lat, lon },
      },
    } = await axios.get(url);

    getWeather(lat, lon);
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
    let {
      data: { city, list },
    } = await axios.get(url1);
    let {
      data: { daily },
    } = await axios.get(url2);

    setTitleText(city.name);

    let weatherData = { item: list };
    convertWeatherData(weatherData.item);

    let sunlightData = { sunrise: daily };
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
    getAndWriteWeatherHTML(weatherData);
  } else {
    weatherContainer.innerHTML = "";
    getAndWriteWeatherHTML(weatherData);
  }
}

function calculateDaylight(sunlightData) {
  let i = 0;
  const { dt, sunset, sunrise } = sunlightData[i];
  let yesterday = getDay(dt, "weekday");
  let minutesOfSunYesterday = (sunset - sunrise) / 60;

  for (let i = 1; i < sunlightData.length - 2; i++) {
    const { dt, sunset, sunrise } = sunlightData[i];
    //console.log(i); // running 5 times
    const today = getDay(dt, "weekday");

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
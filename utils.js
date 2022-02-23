import { days } from "./config.js";

export function getDay(unixTimestamp, mode) {
  if (mode === "weekday") {
    const date = new Date(unixTimestamp);
    const day = `${days[date.getDay()]}`;
    return day;
  } else {
    const date = new Date(unixTimestamp);
    const day = `${days[date.getDay()]} ${date.getHours()}:00`;
    return day;
  }
}

export function getHTML(weather, day, time) {
  return `<div class="weather-card">
              <div class="additional-info ${day}"></div>
              <div class="main-info ${day}">
                <h3>${time}</h3>
                <p>Temperature ${weather.main.temp}</p>
                <p>Feels Like: ${weather.main.feels_like}</p>
                <p>Humidity: ${weather.main.humidity}</p>
                <h4>Description: ${weather.weather[0].description}</h4>
                <p>
                  looks like: <br /><img
                    src="http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png"
                    alt=""
                  />
                </p>
              </div>  
          </div>`;
}

function padNumber(number) {
  if (number < 10) {
    return "0" + number;
  } else {
    return number;
  }
}

export function calculateSunEvent(sunEvent) {
  let sunEventDate = new Date(sunEvent * 1000);
  return `${sunEventDate.getHours()}:${sunEventDate.getMinutes()}:${padNumber(
    sunEventDate.getSeconds()
  )}`;
}

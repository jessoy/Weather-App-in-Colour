import { days } from "./config.js";

export function getDay(unixTimestamp, mode) {
  if (mode === "weekday") {
    const date = new Date(unixTimestamp*1000);
    const day = `${days[date.getDay()]}`;
    return day;
  } else {
    const date = new Date(unixTimestamp*1000);
    const day = `${days[date.getDay()]} ${date.getHours()}:00`;
    return day;
  }
}

export function getHTML(weather, day, time) {
  return `<div class="weather-card">
              <div class="main-info ${day}">
                <h3>${time}</h3>
                <p>Temperature ${weather.main.temp} &#x2103;</p>
                <p>Feels Like: ${weather.main.feels_like} &#x2103;</p>
                <p>Humidity: ${weather.main.humidity} %</p>
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

export function getSunlightHTML(today, difference, yesterday, sunset, sunrise) {
  return `<div class="additional-info ${today}">
          <p>Welcome to <b>${today}</b>, \n it's nice here, we have ${difference} minutes more sunlight than ${yesterday}</p>
            <div class="sunlightInformation"> 
                <div class="sunrise ${today}">Sunrise: ${sunrise}</div>
                <div class="sunset ${today}">Sunset: ${sunset}</div>
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
  return `${padNumber(sunEventDate.getHours())}:${padNumber(sunEventDate.getMinutes())}:${padNumber(
    sunEventDate.getSeconds()
  )}`;
}
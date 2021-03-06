import { days } from "./config.js";
import { weatherContainer } from "./main.js";

// gets the day from a timestamp
export function getDay(unixTimestamp, mode) {
  if (mode === "weekday") {
    const date = new Date(unixTimestamp * 1000);
    const day = `${days[date.getDay()]}`;
    return day;
  } else {
    const date = new Date(unixTimestamp * 1000);
    const day = `${days[date.getDay()]} ${date.getHours()}:00`;
    return day;
  }
}

// prints html for main weather card
export function getHTML(weather, day, time) {
  return `<div class="weather-card ${day}">
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

// prints html for daily sun update if positive
export function getSunlightHTML(today, difference, yesterday, sunset, sunrise) {
  return `<div class="additional-info">
          <div class="text-container ${today}">
            <p>Welcome to <span>${today}</span>, 
            \n it's nice here, we have ${difference} minutes more sunlight than ${yesterday}</p>
          </div>  
            <div class="sunlightInformation"> 
              <div class="sunrise ${today}">
              
                <img src="assets/sunrise.png" alt=""/><br>Sunrise: ${sunrise}
              </div>
              <div class="sunset ${today}">
              <img src="assets/sunset.png" alt=""/><br>Sunset: ${sunset}</div>
            </div>
          </div>`;
}

// prints html for main weather card if negative
export function getSunlightHTMLLessLight(today, difference, yesterday, sunset, sunrise) {
  return `<div class="additional-info">
          <div class="text-container ${today}">
            <p>Welcome to <span>${today}</span>, 
            \n it's not so great here, we have ${difference} minutes less sunlight than ${yesterday}</p>
          </div>  
            <div class="sunlightInformation"> 
              <div class="sunrise ${today}">
              
                <img src="assets/sunrise.png" alt=""/><br>Sunrise: ${sunrise}
              </div>
              <div class="sunset ${today}">
              <img src="assets/sunset.png" alt=""/><br>Sunset: ${sunset}</div>
            </div>
          </div>`;
}

// increases decimal point to two places
function padNumber(number) {
  return (number < 10 ? "0" + number : number);
}

// returns time of sun event in hour: minute: second format
export function calculateSunEvent(sunEvent) {
  let sunEventDate = new Date(sunEvent * 1000);
  return `${padNumber(sunEventDate.getHours())}:${padNumber(
    sunEventDate.getMinutes()
  )}:${padNumber(sunEventDate.getSeconds())}`;
}

// write card information
export function getAndWriteWeatherHTML(weatherData) {
  for (let i = 0; i < weatherData.length; i++) {
    //console.log(i); // runs 40 times
    const weather = weatherData[i];
    const day = getDay(weatherData[i].dt, "weekday");
    const time = getDay(weatherData[i].dt, "time");

    const html = getHTML(weather, day, time);
    weatherContainer.insertAdjacentHTML("beforeend", html);
  }
}

// regex validation
export function validateInput(input) {
  const regex = /^[a-z ]{3,}$/gi;
  return regex.test(input);
}
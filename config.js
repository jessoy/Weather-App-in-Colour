export const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const API_TOKEN = "3d7c4f7a94f03f1bc72f4928c291ae0d"

export const apiSearchableLocationUrl = (userInputCity) => {
  return `http://api.openweathermap.org/data/2.5/weather?q=${userInputCity}&appid=${API_TOKEN}&units=metric`;
};


export const apiCityUrl = (latitude, longitude) => {
  return `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_TOKEN}&units=metric`;
};

export const apiDailyUrl = (latitude, longitude) => {
  return `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,current&appid=${API_TOKEN}&units=metric`;
};

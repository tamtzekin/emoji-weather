/*
  WEATHER APP:
  4. Display the result of the users search on the DOM.
  5. Display the type of weather too (cloudy, sunny, etc -- check the response)

  --BONUS ROUND--
  6. Add a loading indicator until you're ready to display the information for the city.
  7. Make it pretty, ideas:
    * Change the background of the page to reflect the temperature
    * Add pictures to represent the type of weather -- clouds, the sun, etc.
    * Request a new temperature every few minutes (hint: setInterval)
    * Animate when the weather changes.
    *

*/

/* UTILS */
const mapsApi = 'https://maps.googleapis.com/maps/api/geocode/json?address='
const weatherUrl = "http://api.openweathermap.org/data/2.5/weather";
const apiKey = "72af66db614bf9fd03583352142dd7a7";
const input = document.querySelector("#searchbar");

// Digs into the DOM and pulls out the actual location from a Google Maps search
function getLatLng(location) { // build function called getLatLng, pass 'location' argument in
  return fetch(mapsApi + location)
  .then(res => res.json())
  .then(body => {
    return body.results[0].geometry.location
  })
}

/* MODEL */
const state = {
  lat: '',
  lng: '',
  temp: '',
  description: '',
}

/* VIEW */
const container = document.querySelector('#container') // declare variable called container, select the container id

function render(element, data) {
  element.innerHTML = `
    <center>
    <button id="button">What's the weather like today?</button>
    <p>🌡</p>
    <div class="weathermsg">It's going to be ${data.temp} with ${data.description}.</div>
    <p>${weatherEmojis(data.description)}</p>
  `
}

// getWeather performed on lat and lng arguments, returns the temperature value in Kelvin
function getWeather(lat, lng) {
  const url = `${weatherUrl}?lat=${lat}&lon=${lng}&APPID=${apiKey}`
  return fetch(url)
  .then(res => res.json())
  .then(body => {
    return {
      temp: Math.floor((body.main.temp) - 273.15),
      description: body.weather[0].description
    }
  })
}

/* CONTROLLER */
delegate('body', 'click', '#button', event => {
  state.temp = '...'
  state.description = '???'

  render(container, state)

    getLatLng(input.value)
    .then(latLng => getWeather(latLng.lat, latLng.lng))
    .then(weather => {
      state.temp = weather.temp // bug ?
      state.description = weather.description // bug ??

      render(container, state)
  })

  .catch(err => {
    state.lat = 'Something went wrong'
    state.lng = 'Something went wrong'

    render(container, state)
  })
})

/* Emoji string based on temperature */
function weatherEmojis(str) {
  if (str.indexOf('clear sky')) {
    return '☀️☀️☀️'
  } else if (str.indexOf('mist')) {
    return '🌫☁️🌫'
  } else if (str.indexOf('broken clouds')) {
    return '☁️🌤☁️'
  }
}

render(container, state)

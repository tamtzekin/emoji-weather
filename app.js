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
    <button id="button">GO!</button>
    <p>🌡</p>

    <div id="weathermsg">
    It's going to be about ${data.temp}° with ${data.description}.
    <p>${weatherEmojis(data.description)}</p>
    </div>
  `
}

// add class="hidden" above

// Gets the weather based on latitude / longitude parameters
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
  state.temp = '~~~'
  state.description = '~~~'

  revealText()

  render(container, state)

    getLatLng(input.value)
    .then(latLng => getWeather(latLng.lat, latLng.lng))
    .then(weather => {
      state.temp = weather.temp
      state.description = weather.description

      render(container, state)
  })

  .catch(err => {
    state.lat = 'Something went wrong' // fix
    state.lng = 'Something went wrong'// fix

    render(container, state)
  })
})

/* Displays string of emoijis based on weather descriptions (eg. clear sky, overcast clouds etc.) */
function weatherEmojis(str) {
  if (str.indexOf('clear sky') !== -1) {
  return '☀️☀️☀️'
  } else if (str.indexOf('few clouds') !== -1) {
  return '🌤️'
  } else if (str.indexOf('scattered clouds') !== -1) {
    return '☁️  ~  ☁️'
  } else if (str.indexOf('broken clouds') !== -1) {
  return '☁️🌤☁️'
  } else if (str.indexOf('overcast clouds') !== -1) {
    return '☁️☁️☁️☁️☁️'
  } else if (str.indexOf('light rain') !== -1) {
    return '☔'
  } else if (str.indexOf('light intensity drizzle') !== -1) {
    return '🌧️☔🌧️☔'
  } else if (str.indexOf('moderate rain') !== -1) {
    return '🌧️🌧️☔'
  } else if (str.indexOf('shower rain') !== -1) {
    return '🌧️🌧️☔🌧️🌧️'
  } else if (str.indexOf('heavy intensity rain') !== -1) {
    return '☔🌧️🌧️🌧️🌧️🌧️☔'
  } else if (str.indexOf('mist') !== -1) {
    return '🌫☁️🌫'
  } else if (str.indexOf('smoke') !== -1) {
    return '💨💨💨'
  } else if (str.indexOf('haze') !== -1) {
    return '🌫️🌫️🌫️🌫️'
  }
}

// Function to unhide div
function revealText() {
  const item = document.querySelector("#weathermsg")

  if (item) {
    item.className =
    (item.className == "hidden") ? "unhidden" : "hidden";
  }
}

render(container, state)

/*
  WEATHER APP:
  1. Log out the current temperature for Sydney's latitude and longitude
    (hint: complete the getWeather function, returning a promise with the result from the API call, use that promise to then log the result)
  2. Convert the temperature from kelvin to degrees celsius
  3. Add a form on index.html that allows a user to search for any city's weather and logs out the result.
    (hint: google maps api from previous example)
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

// Digs into the DOM and pulls out the actual location from a Google Maps search
function getLatLng(location) { // build function called getLatLng, pass 'location' argument in
  return fetch(mapsApi + location)
  .then(res => res.json())
  .then(body => {
    return body.results[0].geometry.location
  })
}


/* MODEL */
const state = { // declare variable called 'state' which leaves undefined lat and long
  lat: '', // a property of the object 'state'
  lng: '', // another property of the object 'state'
  temp: ''
}

/* VIEW */
const container = document.querySelector('#container') // declare variable called container, select the container id

function render(element, data) { // build function called render, which takes arguments element and data. it adds html to the element, concats the data
  element.innerHTML = `
    <center>
    <p>🌡</p>
    <div class="weathermsg">It's going to be ${data.temp}</div>
    <p>_display mood emojis here_</p>
    <button id="btn">What's it's like outside?</button>
  `
}

// getWeather performed on lat and lng arguments, returns the temperature value in Kelvin
function getWeather(lat, lng) {
  const url = `${weatherUrl}?lat=${lat}&lon=${lng}&APPID=${apiKey}`
  return fetch(url)
  .then(res => res.json())
  .then(body => {
    return Math.floor((body.main.temp) - 273.15) + "° today with " + (body.weather[0].description) + "."
  })
}

/* WEATHER OPTIONS */
//"clear sky"☀️☀️☀️
// "mist"🌫☁️🌫
// "broken clouds"☁️🌤☁️
// 🌧🌧🌧
// 🌩🌩🌩
// 🌨🌨🌨

/* CONTROLLER */
delegate('body', 'click', '#btn', event => {
  state.temp = '...'
  render(container, state)

    getLatLng('sydney') // how to take value of input field ??
    .then(latLng => getWeather(latLng.lat, latLng.lng))
    .then(temp => {
      state.temp = temp

      render(container, state)
  })

//mood state for emojis
  // .then(mood => {
  //   state.mood = mood
  //
  //   render(container, state)
  // })

  .catch(err => {
    state.lat = 'Something went wrong'
    state.lng = 'Something went wrong'

    render(container, state)                  // render the DOM
  })
})

/* Take search field */
// function searchCity() {
//   const input = document.querySelector("searchbar").value
//
// }


/* Emoji string based on temperature */
// function weatherEmojis() {
//   if (mood === "cloudy") {
//     console.log('worked')
// }

render(container, state)                     // render to the DOM



// declare the Lat and Lng each as variables
// pass the Lat and Lng variables into the ${} inside the API search
//

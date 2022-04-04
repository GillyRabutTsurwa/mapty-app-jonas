"use-strict";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

// NEW: introduction to the geolocation API. ni poa sana
/**
 * okay this is really cool:
 * the geolocation API is provided by the browser that provides us information based on location
 * in this case, we are working with the getCurrentPosition(), which is nested inside geolocation object...
 * ... which is nested inside the global parent navigator object (i'm assuming by reading the code, but i haven't verified)
 *
 * this method takes two callback functions as it's arguements:
 * the first one - which takes a position arguement (but can be called anything) is executed when the fetching of the current position is successful
 * this position argument is an object that will have more specific information we might need about location
 * the second one is executed when fetching the current position is unsuccessful
 * in our particular case, when the position is successfully acquired, we'll see a bunch of logs in the console (see below)
 * if it fails, we'll see that alert (see below)
 */
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log(position);

      const { latitude, longitude } = position.coords;
      console.log(`La latitude c'est ${latitude}`);
      console.log(`La longitude c'est ${longitude}`);
      console.log(`https://www.google.pt/maps/@${latitude},${longitude}`);
    },
    () => {
      alert("Could not get your position");
    }
  );
}

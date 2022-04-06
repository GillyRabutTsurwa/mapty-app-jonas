"use-strict";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      const coordinates = [latitude, longitude];
      const zoomLevel = 13;

      const map = L.map("map").setView(coordinates, zoomLevel); // ("map") signifie un element dans notre HTML ayant le ID de "map"

      L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // event listener unique to the leaflet library
      console.log(map); //STUDY:
      //   also just like javascript, leafletjs has an eventobject (so-to-speak) of its own
      map.on("click", (mapEvent) => {
        console.log(mapEvent);
        const { lat, lng } = mapEvent.latlng;

        /**
         * by moving the code that generates the marker to inside the event listener, a marker is made each time upon click
         * [lat, lng] signifies the location in the map where the click took place, which will be where the maker will be placed
         */
        L.marker([lat, lng])
          .addTo(map)
          .bindPopup(
            L.popup({
              maxWidth: 250,
              minWidth: 100,
              autoClose: false,
              closeOnClick: false,
              className: "running-popup",
            })
          )
          .setPopupContent("Custom Tings Settings")
          .openPopup();
      });
    },
    () => {
      alert("Could not get your position");
    }
  );
}

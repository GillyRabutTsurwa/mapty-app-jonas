"use-strict";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const DOMElements = (() => {
  const elements = {
    form: document.querySelector(".form"),
    containerWorkouts: document.querySelector(".workouts"),
    inputType: document.querySelector(".form__input--type"),
    inputDistance: document.querySelector(".form__input--distance"),
    inputDuration: document.querySelector(".form__input--duration"),
    inputCadence: document.querySelector(".form__input--cadence"),
    inputElevation: document.querySelector(".form__input--elevation"),
  };
  return elements;
})();

// NOTE: these two variables were created so to address scope issues of some of the values we need to use externally
let map;
let mapEvt;

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      const coordinates = [latitude, longitude];
      const zoomLevel = 13;

      // NOTE: this used to be a const, but changed it to a redeclarable variable to use outside it's initial scope
      map = L.map("map").setView(coordinates, zoomLevel);

      L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      map.on("click", (mapEvent) => {
        /**
         * NOTE:
         * we are assigning the mapEvent object to a variable in order to use outside this scope
         * secondly, we are removing the default "hidden" class from the form to display it
         * lastly, we are putting the focus on the distance field as soon as the form is displayed
         */
        mapEvt = mapEvent;
        DOMElements.form.classList.remove("hidden");
        DOMElements.inputDistance.focus();
      });
    },
    () => {
      alert("Could not get your position");
    }
  );
}

DOMElements.form.addEventListener("submit", (e) => {
  // NOTE: stop default form behaviour
  e.preventDefault();

  // NOTE: display the marker
  const { lat, lng } = mapEvt.latlng;
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

  /**
   * NOTE:
   * clear all values of the input
   * first filter the dom to get only input elements
   * then loop over all the input elements
   * and clear their values
   * differement par a rapport au moyen de Jonas
   */
  const inputFormsArr = Object.values(DOMElements).filter((currentDOMElement) => {
    return currentDOMElement.className.includes("form__input");
  });

  console.log(inputFormsArr);
  inputFormsArr.forEach((currentInputElement) => {
    currentInputElement.value = "";
  });
});

// input select change event
DOMElements.inputType.addEventListener("change", (e) => {
  console.log(e.target.value); // just looking around
  // NOTENEW: the closest() like an inverse query selector; selects PARENTS and not children
  DOMElements.inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
  DOMElements.inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
});

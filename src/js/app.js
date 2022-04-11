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

class App {
  #map;
  #mapEvt;

  constructor() {
    /**
     * IMPORTANTNOTE:
     * this note is intentionally left from the previous commit, but moving it to the top of the getPosition() for better code readability:
     *
     * remember, for an event listener, by default, the this keyword is set to the DOM element itself - in the form of an object
     * in this case, the this keyword would naturally be form. but we don't want this
     * we want the this keyword to equal the object that our class creates
     * there are two ways to solve this:
     *
     * the first way, which Jonas does, AND what i will do in this commit, is to bind the this keyword to the eventlistener newWorkout callback function:
     * DOMElements.form.addEventListener("submit", this._newWorkout.bind(this)
     * this way, the this keyword of the function will be set to the current object being instantiated
     *
     * the other way, which is what i did in the previous commit, is to use an arrow function instead of a regular function as the event callback function
     * and then call the newWorkout function from inside that callback function
     * this works because in javascript, the value of this, for an arrow function, equals undefined in and of itself...
     * ...but if there is a parent object in which the function is defined, the result of the this keyword will be that object
     *
     * in the previous commit, i make use of arrow functions instead of using the .bind()
     *
     */
    this._getPosition();
    DOMElements.form.addEventListener("submit", this._newWorkout.bind(this));
    DOMElements.inputType.addEventListener("change", this._toggleElevationField);
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), () => {
        alert("Could not get your position");
      });
    }
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;

    const coordinates = [latitude, longitude];
    const zoomLevel = 13;

    console.log(this);
    this.#map = L.map("map").setView(coordinates, zoomLevel);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on("click", this._showForm.bind(this));
  }

  _showForm(mapEvent) {
    this.#mapEvt = mapEvent;
    DOMElements.form.classList.remove("hidden");
    DOMElements.inputDistance.focus();
  }

  _toggleElevationField() {
    DOMElements.inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    DOMElements.inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }

  _newWorkout(e) {
    console.log(this);
    e.preventDefault();

    const inputFormsArr = Object.values(DOMElements).filter((currentDOMElement) => {
      return currentDOMElement.className.includes("form__input");
    });

    console.log(inputFormsArr);
    inputFormsArr.forEach((currentInputElement) => {
      currentInputElement.value = "";
    });

    const { lat, lng } = this.#mapEvt.latlng;
    L.marker([lat, lng])
      .addTo(this.#map)
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
  }
}

const app = new App();

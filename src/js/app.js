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

class Workout {
  /**
   * TODOIMPORTANT:
   * i knew this look weird (declaring these variables here)
   * jonas calls it "cutting edge javascript"
   * i need to look into this, because last time i checked this wasn't allowed in javascript
   */
  date = new Date();
  id = `${Date.now()} `.slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords; // array of latitude and longitude
    this.distance = distance; // in km
    this.duration = duration; // in m
  }
}

// subclasses to Workout class
class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calculatePace();
  }

  calculatePace() {
    this.pace = this.duration / this.distance;
  }
}

// subclasses to Workout class
class Cycling extends Workout {
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calculateSpeed();
  }

  calculateSpeed() {
    this.speed = this.distance / (this.duration / 60);
  }
}

const runOne = new Running([39, -12], 5.2, 24, 178);
const cycleOne = new Cycling([39, -12], 27, 95, 528);

console.log(runOne, cycleOne);

class App {
  #map;
  #mapEvt;

  constructor() {
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

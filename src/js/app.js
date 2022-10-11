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
  date = new Date();
  id = `${Date.now()}`.slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords; // array of latitude and longitude
    this.distance = distance; // in km
    this.duration = duration; // in min
  }
}

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
  #workoutsArr = [];

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
    e.preventDefault();
    /**
     * TODO:
     * 1. get data from form
     * 2. validate data
     *  a. if workout is running, create running object
     *  b. if workout is cycling, create cycling object
     * 3. add new object to object array
     * 4. render workout on map as a marker
     * 5. render workout on list
     * 6. clear input fields
     * 7. hide form
     */

    // 1.
    const type = DOMElements.inputType.value;
    const distance = +DOMElements.inputDistance.value; //NOTE: the "+" est pour convertir la chaîne à un chiffre
    const duration = +DOMElements.inputDuration.value; //NOTE: c'est le pareil ici
    const { lat, lng } = this.#mapEvt.latlng;
    let workout;

    // 2.
    /**
     * NOTE:
     * helper function to help validate inputs
     * first one to validate if inputs are actually numbers
     * second to validate if the numbers are positive numbers
     * this works fine, but reading the lines where we invoke the functions is a bit confusing to me
     * i am considering switching from every() to some()
     * which will then get rid of "!" during the function calls
     */
    const validateInputs = (...inputs) => inputs.every((currentInput) => Number.isFinite(currentInput));
    const allPositiveNums = (...inputs) => inputs.every((currentInput) => currentInput > 0);

    if (type === "running") {
      const cadence = +DOMElements.inputCadence.value;
      // a.

      // if (!Number.isFinite(distance) || !Number.isFinite(duration) || !Number.isFinite(cadence)) return alert("Inputs must be positive numbers");
      // the above is good and works, but is very long winded. much below is much preferable. commenting out above
      if (!validateInputs(distance, duration, cadence) || !allPositiveNums(distance, duration, cadence)) {
        alert("Inputs must be positive numbers");
        return;
      }

      workout = new Running([lat, lng], distance, duration, cadence);
      this.#workoutsArr.push(workout);
    }

    if (type === "cycling") {
      const elevation = +DOMElements.inputElevation.value;
      // b.
      if (!validateInputs(distance, duration, elevation) || !allPositiveNums(distance, duration)) {
        alert("Inputs must be positive numbers");
        return;
      }

      workout = new Cycling([lat, lng], distance, duration, elevation);
      this.#workoutsArr.push(workout); //TODO: essayer de bouger ce ligne hors du bloque "if" juste dessous
    }

    console.log(this.#workoutsArr);

    this.renderWorkoutMarker(workout);

    const inputFormsArr = Object.values(DOMElements).filter((currentDOMElement) => {
      return currentDOMElement.className.includes("form__input");
    });

    inputFormsArr.forEach((currentInputElement) => {
      currentInputElement.value = "";
    });
  }

  renderWorkoutMarker(workout) {
    // const { lat, lng } = this.#mapEvt.latlng; NOTE: moving this to the top so it can be use to add a new workout
    L.marker(workout.coords) //NOTE: workout.coords has the lat and lng values that we need
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${type}-popup`, //NOTE: based on the value of the select input: running or cycling
        })
      )
      .setPopupContent(`TEST: ${workout.distance}`)
      .openPopup();
  }
}

const app = new App();

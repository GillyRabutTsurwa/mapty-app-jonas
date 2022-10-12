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

  _setDescription() {
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${this.date.getDate()} ${months[this.date.getMonth()]}`;
  }
}

class Running extends Workout {
  type = "running";
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calculatePace();
    this._setDescription();
  }

  calculatePace() {
    this.pace = this.duration / this.distance;
  }
}

class Cycling extends Workout {
  type = "cycling";
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calculateSpeed();
    this._setDescription();
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

  _clearInputFields() {
    const inputFormsArr = Object.values(DOMElements).filter((currentDOMElement) => {
      return currentDOMElement.className.includes("form__input");
    });

    inputFormsArr.forEach((currentInputElement) => {
      currentInputElement.value = "";
    });
  }

  _hideForm() {
    DOMElements.form.style.display = "none";
    DOMElements.form.classList.add("hidden");
    setTimeout(() => {
      DOMElements.form.style.display = "grid";
    }, 1000);
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
    }

    if (type === "cycling") {
      const elevation = +DOMElements.inputElevation.value;
      // b.
      if (!validateInputs(distance, duration, elevation) || !allPositiveNums(distance, duration)) {
        alert("Inputs must be positive numbers");
        return;
      }

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    console.log(this.#workoutsArr);
    console.log(workout);
    // 3. add new object to object array
    this.#workoutsArr.push(workout);

    // 4. render workout on map as a marker
    this._renderWorkoutMarker(workout);

    // 5. render workout on list
    this._renderWorkout(workout);

    // 6. clear input fields
    this._clearInputFields();

    // 7. hide form
    this._hideForm();
  }

  _renderWorkoutMarker(workout) {
    // const { lat, lng } = this.#mapEvt.latlng; NOTE: moving this to the top so it can be use to add a new workout
    L.marker(workout.coords) //NOTE: workout.coords has the lat and lng values that we need
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`, //NOTE: based on the value of the select input: running or cycling
        })
      )
      .setPopupContent(`${workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"} ${workout.description}`)
      .openPopup();
  }

  // NOTE: code below is main focus of this commit. ie, this function right here
  _renderWorkout(workout) {
    let html = `
    <li class="workout workout--${workout.type}" data-id="${workout.id}">
      <h2 class="workout__title">${workout.description}</h2>
      <div class="workout__details">
        <span class="workout__icon">${workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"}</span>
        <span class="workout__value">${workout.distance}</span>
        <span class="workout__unit">km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">🕓</span>
        <span class="workout__value">${workout.duration}</span>
        <span class="workout__unit">min</span>
      </div>
    `;

    if (workout.type === "running") {
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.pace.toFixed(1)}</span>
          <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">🦶🏼</span>
          <span class="workout__value">${workout.cadence}</span>
          <span class="workout__unit">spm</span>
        </div>
      </li>
      `;
    }

    if (workout.type === "cycling") {
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.speed.toFixed(1)}</span>
          <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⛰</span>
          <span class="workout__value">${workout.elevationGain}</span>
          <span class="workout__unit">m</span>
        </div>
      </li>
      `;
    }

    DOMElements.containerWorkouts.insertAdjacentHTML("beforeend", html);
  }
}

const app = new App();

# Notes

## 1. Geolocation API

- i got my first introduction to the geolocation api. it's pretty cool.
- i will make a branch from this commit so that i can play with the API some more
  - i will do this for other lessons i find intruiging
- that's it. nothing else to add. we move

## 2. [LeafletJS](https://leafletjs.com)

- this library is so cool. i'm going to be using this in my web portfolio
- also, explore the differet tile layers options. doesn't seem too complicated and it seems there's many ways to customise your map using it

## 3. Displaying the Map Marker (Upon Click)

- went through the leaflet documentation and eventually learnt how to: 
  - customise the marker, with its many options (via making an object)
  - how to set custom text
  - and, how to add our custom css classes to the marker

## 4. Rendering Input Form
  
- in this commit, the goal was to render the input and start implementing standard functionality
- what the form does so far:
  - displayed the form
  - placing a marker and clearing the input values after submitting the form
  - when the select option changes from "running" to "cycling", the cadence input changes to the elevation input
    - we are doing this using the closest(). i need to look into this method more. it seems to be very useful
  
## 5. Managing Data With Classes

- this commit is a slight tweak of the previous one
- the tweak: i use .bind() instead of using arrow functions
- consult previous commit for more info
- also (and this is IMPORTANT) i have changed the gulp workflow once again:
  - instead of using the copyJS function from the previous commit, i am using [gulp-mode](https://www.npmjs.com/package/gulp-mode) to run certain gulp actions depending on the environment (development or production)
  - this [article](https://www.boag.online/blog/gulp-2021) was very helpful for me
  - this is the most important thing (arguably) that I did in this commit
  - i have more comments in the app.js file
const gulp = require("gulp");
const mode = require("gulp-mode")({
  modes: ["production", "development"],
  default: "development",
  verbose: false,
});
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();

const htmlMin = require("gulp-htmlmin");
const cleanCSS = require("gulp-clean-css");
const babel = require("gulp-babel");
const terser = require("gulp-terser");

const html = () => {
  return gulp
    .src("./src/*.html")
    .pipe(
      mode.production(
        htmlMin({
          collapseWhitespace: true,
          removeComments: true,
        })
      )
    )
    .pipe(gulp.dest("./dist/"));
};

const copyImages = () => {
  return gulp.src("./src/images/*").pipe(gulp.dest("./dist/images/"));
};

const copyIcons = () => {
  return gulp.src("./src/icons/*").pipe(gulp.dest("./dist/icons/"));
};

const style = () => {
  return gulp
    .src("./src/sass/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(mode.production(cleanCSS()))
    .pipe(gulp.dest("./dist/css/"))
    .pipe(browserSync.stream());
};

/**
 * IMPORTANTNOTE:
 * this is great. so instead of using the copyJS for better debugging...
 * ... i can choose what kind of javascript file i want to spit out in the dist directory
 * meaning, i can choose if app.js is suited for production (minified, console.log() removed etc)
 * or whether it should be suited for development, as i am working on the project
 * i can do this thanks to the gulp-mode package
 * gulp-mode allows the execution of gulp actions selectively based on the defined environment
 * meaning, we can choose gulp actions to run in development mode or production mode
 *
 * all we have to do is wrap the action we want to run in the mode.development() or mode.production() respectively
 * and define whether we want to run gulp in development mode or production mode in our package.json file
 * the script to run gulp is development is "gulp --development" (though i think "gulp" by itself runs development by default)
 * and the script to run gulp in production is "gulp --production"
 * this reminds me of colt's webpack crash course, when we wanted certain code to run in development or production
 * @returns
 */
const javascript = () => {
  return gulp
    .src("./src/js/**/*.js")
    .pipe(
      mode.production(
        babel({
          presets: ["@babel/preset-env"],
        })
      )
    )
    .pipe(mode.production(terser()))
    .pipe(gulp.dest("./dist/js/"));
};

const watch = () => {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
    browser: "google chrome",
  });

  gulp.watch(["./src/*.html", "./src/sass/**/*.scss", "./src/**/*.js"], gulp.parallel(html, style, javascript));

  gulp.watch("./src/*.html").on("change", browserSync.reload);
  gulp.watch("./src/js/app.js").on("change", browserSync.reload);
};

exports.default = gulp.series(gulp.parallel(html, style, javascript), watch);
exports.html = html;
exports.copyImages = copyImages;
exports.copyIcons = copyIcons;
exports.style = style;
exports.javascript = javascript;
exports.watch = watch;

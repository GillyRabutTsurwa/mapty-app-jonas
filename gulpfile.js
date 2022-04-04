const gulp = require("gulp");
const sass = require("gulp-sass");
sass.compilter = require("sass");
const htmlMin = require("gulp-htmlmin");
const cleanCSS = require("gulp-clean-css");
const browserSync = require("browser-sync");

const babel = require("gulp-babel");
const terser = require("gulp-terser");

const minifyHTML = () => {
  return gulp
    .src("./src/*.html")
    .pipe(
      htmlMin({
        collapseWhitespace: true,
        removeComments: true,
      })
    )
    .pipe(gulp.dest(".dist/"));
};

const style = () => {
  return gulp
    .src("./src/sass/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCSS())
    .pipe(gulp.dest("./dist/css/"))
    .pipe(browswerSync.stream());
};

const configureJS = () => {
  return gulp
    .src("./src/js/**/*.js")
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(terser())
    .pipe(gulp.dest("./dist/js/"));
};

const watch = () => {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
    browser: "chrome",
  });

  gulp.watch(["./src/*.html", "./src/sass/**/*.scss", "./src/js/app.js"], gulp.parallel(minifyHTML, style, configureJS));

  gulp.watch("./src/*.html").on("change", browserSync.reload);
  gulp.watch("./src/js/app.js").on("change", browserSync.reload);
};

exports.default = gulp.series(gulp.parallel(minifyHTML, style, configureJS), watch);
exports.minifyHTML = minifyHTML;
exports.style = style;
exports.configureJS = configureJS;
exports.watch = watch;

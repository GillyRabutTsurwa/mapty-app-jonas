const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const htmlMin = require("gulp-htmlmin");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const browserSync = require("browser-sync").create();

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
    .pipe(gulp.dest("./dist/")); // i initially had .pipe(gulp.dest(".dist/")); which is incorrect
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
    .pipe(cleanCSS())
    .pipe(gulp.dest("./dist/css/"))
    .pipe(browserSync.stream());
};

const configureJS = () => {
  return gulp
    .src("./src/js/**/*.js")
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(
      terser({
        compress: {
          drop_console: true,
        },
      })
    )
    .pipe(gulp.dest("./dist/js/"));
};

const copyJS = () => {
  return gulp.src("./src/js/**/*.js").pipe(rename("app.test.js")).pipe(gulp.dest("./dist/js/"));
};

const watch = () => {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
    browser: "chrome",
  });

  gulp.watch(["./src/*.html", "./src/sass/**/*.scss", "./src/js/app.js"], gulp.parallel(minifyHTML, style, configureJS, copyJS));

  gulp.watch("./src/*.html").on("change", browserSync.reload);
  gulp.watch("./src/js/app.js").on("change", browserSync.reload);
};

exports.default = gulp.series(gulp.parallel(minifyHTML, style, configureJS), watch);
exports.minifyHTML = minifyHTML;
exports.copyImages = copyImages;
exports.copyIcons = copyIcons;
exports.style = style;
exports.configureJS = configureJS;
exports.copyJS = copyJS;
exports.watch = watch;

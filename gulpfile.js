const gulp = require("gulp");
const babel = require("gulp-babel");
const minify = require("gulp-babel-minify");
const concat = require("gulp-concat");
const cleanCSS = require("gulp-clean-css");
const streamqueue = require("streamqueue");

gulp.task("minifyCss", () => {
  return gulp
    .src("public/assets/css/styles.css")
    .pipe(cleanCSS())
    .pipe(concat("bundle.css"))
    .pipe(gulp.dest("public/assets/css/"));
});
gulp.task("minifyJs", () => {
  return streamqueue(
    { objectMode: true },
    gulp.src("src/js/globals.js"),
    gulp.src("src/js/functions.js"),
    gulp.src("src/js/events.js"),
  )
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(
      minify({
        mangle: {
          keepClassName: true,
        },
      })
    )
    .pipe(concat("bundle.js"))
    .pipe(gulp.dest("src/js/"));
});

// gulp.task('default', function() {
//   gulp.watch('./styles/*.css', function(evt) {
//   gulp.task('minify-css');
//   });
// });

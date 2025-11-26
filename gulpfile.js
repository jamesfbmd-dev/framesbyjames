const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));

gulp.task('sass', function () {
  return gulp.src('scss/styles.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('css'));
});

gulp.task('watch', function () {
  gulp.watch('scss/**/*.scss', (done) => {
    gulp.series(['sass'])(done);
  });
});

gulp.task('default', gulp.series('sass', 'watch'));

const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const babel = require('gulp-babel');

const dist = 'dist';

gulp.task('default', ['js', 'css']);

gulp.task('js', () =>
  gulp.src('src/acc-pack-archiving.js')
    .pipe(babel({ presets: ['es2015-script'] }))
    .pipe(rename('opentok-archiving.js'))
    .pipe(gulp.dest(dist)));

gulp.task('js-min', () =>
  gulp.src('dist/opentok-archiving.js')
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min',
    }))
    .pipe(gulp.dest(dist)));

gulp.task('dist', ['js', 'js-min']);

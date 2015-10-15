var gulp = require('gulp'),
    inlinesource = require('gulp-inline-source'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-ruby-sass'),
    minifycss = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html');

gulp.task('styles', function(){
    sass('src/css/2048.scss', { sourcemap: true })
    .on('error', sass.logError)
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(minifycss())
    .pipe(sourcemaps.write())
    .pipe(sourcemaps.write('maps', {
      includeContent: false,
      sourceRoot: 'src/styles'
    }))
    .pipe(gulp.dest('dist/css/'))
});

gulp.task('scripts', function(){
    gulp.src('src/js/*.js')
    .pipe(uglify({compress:true}))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('html', function(){
    gulp.src('src/index.html')
    .pipe(inlinesource())
    .pipe(minifyHTML())
    .pipe(gulp.dest('dist'));
});


gulp.task('default', ['styles','scripts']);
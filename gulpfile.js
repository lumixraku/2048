var gulp = require('gulp'),
  inlinesource = require('gulp-inline-source'),
  //browserify===================
  browserify = require('browserify'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  //end===============

  browserifyGulp = require('gulp-browserify'),
  autoprefixer = require('gulp-autoprefixer'),
  sass = require('gulp-ruby-sass'),
  minifycss = require('gulp-minify-css'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify'),
  minifyHTML = require('gulp-minify-html')

gulp.task('styles', function() {
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

gulp.task('scripts', function() {

  //需要注意的是  使用sourcemaps 会在当域名的同级目录下生成一个source文件夹
  //并不是在当前域名的js目录下生成
  //---sourcemap
  //-----JSfileA
  //-----JSfileB
  //---localhost
  //------dist
  //------src
  //----------js
  //---------------main.js
  //PS 仅靠debug: true 是无法生成sourcemaps的

  /* gulp-browserify已经停止更新了
  gulp.src('src/js/main.js')
  .pipe(browserifyGulp({
    debug:true
  }))
  .pipe(sourcemaps.init({loadMaps: true}))

  //调试完毕才使用 uglify
  //.pipe(uglify())//.pipe(uglify({ compress: true }))
  .pipe(sourcemaps.write('./')) // writes .map file
  .pipe(gulp.dest('dist/js'));
  */

  /*建议使用vinyl的方式来处理browserify*/
  return browserify({
      entries: ['./src/js/main.js'],
      debug: true
    })
  .bundle()
  .pipe(source('bundle.js')) //将普通的流转为vinyl流
  .pipe(buffer()) //缓存文件数据
  .pipe(sourcemaps.init({ loadMaps: true })) // loads map from browserify file
  .pipe(uglify())
  .pipe(sourcemaps.write('./')) // writes .map file
  .pipe(gulp.dest('./dist/js'));
});

gulp.task('html', function() {
  gulp.src('src/index.html')
    //.pipe(inlinesource())
    .pipe(minifyHTML())
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch(['src/js/*.js'], ['scripts']);
});

gulp.task('default', ['watch', 'styles', 'scripts', 'html']);

'use strict';

var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var uglify = require('gulp-uglify');
var tsify = require('tsify');

var browserSync = require('browser-sync');
var reload = browserSync.reload;

// add custom browserify options here
var customOpts = {
  entries: ['./src/app.js'],
  debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts).plugin('tsify', {noImplicitAny: true})); 

// add transformations here
// i.e. b.transform(coffeeify);

gulp.task('js', bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
       // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./src/dist'));
}

gulp.task('browser-sync', [/*'nodemon'*/], function() {
	browserSync.init(null, {
    server: {
            baseDir: "./src"
        }
		//proxy: "http://localhost:5000",
     //   files: ["app/**/*.*"],
       // browser: "google chrome",
        //port: 7000,
       // baseDir: "./app"
	});
});


gulp.task('default', [/*'sass', */'js', 'browser-sync'], function () {
	//gulp.watch("app/scss/*.scss", ['sass']);
	gulp.watch(["src/dist/**/*.js"], reload);
});
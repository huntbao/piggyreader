'use strict'

var del = require('del')

var gulp = require("gulp");
var uglify = require("gulp-uglify")
var gulpif = require("gulp-if")
var minifyCss = require('gulp-minify-css')
var zip = require('gulp-zip')

gulp.task('clean-dist', function (cb) {
    del(['dist', 'dist.zip'], cb)
})

gulp.task('release', ['clean-dist'], function (cb) {
    var gulpJSFilter = function (file) {
        console.log(file.path)
        if (file.path.match(/\.js$/)) {
            return true
        }
    }
    var gulpCSSFilter = function (file) {
        if (file.path.match(/\.css$/)) {
            return true
        }
    }
    var stream = gulp.src(['reader/**/*.*'])
        .pipe(gulpif(gulpJSFilter, uglify()))
        .pipe(gulpif(gulpCSSFilter, minifyCss()))
        .pipe(gulp.dest('dist'))
        .pipe(zip('dist.zip'))
        .pipe(gulp.dest('.'))

    return stream
})

gulp.start('release')
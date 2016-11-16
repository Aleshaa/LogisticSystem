'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');

var jsLibs = [
    './public/bower_components/angular/angular.js',
    './public/bower_components/angular-ui-router/release/angular-ui-router.js',
    './public/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
    './node_modules/alertifyjs/build/alertify.js',
    './public/bower_components/angular-local-storage/dist/angular-local-storage.js'
];

var cssFiles = [];

gulp.task('concat-js-libs', function () {
    gulp.src(jsLibs)
        .pipe(concat('libs.js'))
        .pipe(gulp.dest('./public/dist/js'));
});

gulp.task('concat-css-libs', function () {
    gulp.src(cssFiles)
        .pipe(concat('libs.css'))
        .pipe(gulp.dest('./public/dist/css'));
});

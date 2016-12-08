'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');

var jsLibs = [
    './public/bower_components/angular/angular.js',
    './public/bower_components/angular-ui-router/release/angular-ui-router.js',
    './public/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
    './node_modules/alertifyjs/build/alertify.js',
    './public/bower_components/angular-local-storage/dist/angular-local-storage.js',
    './public/bower_components/jquery/dist/jquery.min.js',
    './public/bower_components/bootstrap/dist/js/bootstrap.min.js',
    './public/bower_components/angular-google-chart/ng-google-chart.min.js'
];

var cssFiles = [
    './public/bower_components/ng-tags-input/ng-tags-input.css',
    './public/bower_components/titatoggle/dist/titatoggle-dist.css',
    './public/bower_components/angular-ui-select/dist/select.css',
    './public/bower_components/angular-datepicker/dist/angular-datepicker.css',
    './public/bower_components/fullcalendar/dist/fullcalendar.css',
    './public/bower_components/angular-xeditable/dist/css/xeditable.css',
    './public/bower_components/ng-dialog/css/ngDialog.css',
    './public/bower_components/ng-dialog/css/ngDialog-theme-default.css',
    './public/bower_components/angularjs-slider/dist/rzslider.css',
    './public/bower_components/bootstrap/dist/css/bootstrap.min.css',
    './public/bower_components/font-awesome/css/font-awesome.min.css'
];

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

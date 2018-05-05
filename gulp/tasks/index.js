var gulp = require("gulp");
var gulpif = require("gulp-if");
var uglify = require("gulp-uglify");
var webpack = require("gulp-webpack");
var configIndex = require("../configs/index");
var configDisplay = require("../configs/display");
var configEndroll = require("../configs/endroll");

gulp.task("build-index", function () {
    gulp.src(configIndex.src)
        .pipe(webpack(configIndex.webpack))
        .pipe(gulpif(configIndex.js.uglify, uglify()))
        .pipe(gulp.dest(configIndex.js.dest));
});

gulp.task("build-display", function () {
    gulp.src(configDisplay.src)
        .pipe(webpack(configDisplay.webpack))
        .pipe(gulpif(configDisplay.js.uglify, uglify()))
        .pipe(gulp.dest(configDisplay.js.dest));
});

gulp.task("build-endroll", function () {
    gulp.src(configEndroll.src)
        .pipe(webpack(configEndroll.webpack))
        .pipe(gulpif(configEndroll.js.uglify, uglify()))
        .pipe(gulp.dest(configEndroll.js.dest));
});

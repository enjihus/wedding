var gulp = require('gulp');
var watch = require('gulp-watch');
var config = require('../configs/index');

gulp.task('watch', function(){
    gulp.watch(config.src, ['build']);
});

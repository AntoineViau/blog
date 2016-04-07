var gulp = require('gulp');
var watch = require('gulp-watch');
var liveReload = require('gulp-livereload');
var sg = require('./static-generator');
var del = require('del');
sequence = require('gulp-sequence');

gulp.task('liveReload', function() {
    return gulp.src(['build/**/*'])
        .pipe(liveReload());
});

gulp.task('clean', function(cb) {
    return del(['./build/**/*'], cb);
});

gulp.task('build', function(cb) {
    sg('./posts', './layouts', './build');
    return cb();
});

gulp.task('build-dev', function(cb) {
    return sequence('clean', 'build', 'liveReload')(cb);
});

gulp.task('dev', function(cb) {
    liveReload.listen();
    watch(['./posts/**/*', './layouts/**/*'], {}, function() {
        gulp.start('build-dev');
    });
});

gulp.task('default', function(cb) {
    gulp.start('build-dev');
});
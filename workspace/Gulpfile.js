var gulp = require('gulp');
var polymer = require('./polymer');
var prepareSass = require('./prepareSass');
var fs = require('fs');
var _ = require('lodash');
var sass = require('gulp-sass');

gulp.task('run', function() {
    gulp.start([
        'prepareSass',
        'sass',
        'prepareHtml',
        'watch'
    ]);
});

gulp.task('prepareSass', function() {
    gulp.src('static/html/')
        .pipe(prepareSass());
});

gulp.task('prepareHtml', function() {
    fs.readdir('static/html/', function(err, files) {
        _.map(files, function(file) {
            gulp.src('static/html/' + file)
                .pipe(polymer())
                .pipe(gulp.dest('../www'));
        });
    });
});

gulp.task('sass', function() {
    gulp.src("static/sass/style.sass")
        .pipe(sass({
            indentedSyntax: true,
            errLogToConsole: true
        }))
        .pipe(gulp.dest("../www/css/"));
});

gulp.task('watch', function() {
    var files = [
        //'./static/components/*.*',
        './static/sass/*.sass'
    ];
    gulp.watch(files, function() {
        gulp.start(['prepareSass', 'sass']);
    });
});
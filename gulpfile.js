'use strict';

var gulp         = require('gulp');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var server       = require('browser-sync').create();
var runSequence  = require('run-sequence');

gulp.task('server', ['sass:dev'], function() {
    server.init({
        serveStatic: ['.'],
        proxy: 'https://islandimagined.dev.islandarchives.ca',
        startPath: 'user',
        injectChanges: true,
        files: ['css/ia-islandimagined.styles.css','js/ia-islandimagined.behaviors.js'],
        plugins: ['bs-rewrite-rules'],
        rewriteRules: [
            {
                match: 'https://islandimagined.dev.islandarchives.ca/sites/islandimagined.dev.islandarchives.ca/themes/ia_islandimagined/css/ia-islandimagined.styles.css',
                replace: '/css/ia-islandimagined.styles.css',
            },
            {
                match: ' https://islandimagined.dev.islandarchives.ca/sites/islandimagined.dev.islandarchives.ca/themes/ia_islandimagined/js/ia-islandimagined.behaviors.js',
                replace: '/js/ia-islandimagined.behaviors.js',
            },
        ],
    });
});

gulp.task('sass:prod', function () {
  gulp.src('./sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
       browsers: ['last 2 version']
    }))
    .pipe(gulp.dest('./css'));
});

gulp.task('sass:dev', function () {
  gulp.src('./sass/*.scss')
    .pipe(sourcemaps.init())
        .pipe(sass({
            //includePaths: ['node_modules/guff/']
        }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 version']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./css'))
    .pipe(server.stream());
});

// ##################
// Watch Task
// ##################

gulp.task('watch', ['server', 'sass:dev'], function() {
    gulp.watch('./sass/**/*.scss', ['sass:dev']);
});

// ##################
// Build Task
// ##################

gulp.task('build', function() {
    runSequence(['sass:dev']);
});

// ##################
// Default Task
// ##################

gulp.task('default', function() {
    runSequence(['build', 'server', 'watch']);
});


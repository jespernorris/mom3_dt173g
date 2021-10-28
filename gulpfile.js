const {src, dest, watch, series, parallel} = require('gulp');
const concat = require('gulp-concat'); // Slå ihop filer
const terser = require('gulp-terser').default; // Komprimera JS
const cleanCSS = require('gulp-clean-css'); // Komprimera CSS
const htmlmin = require('gulp-htmlmin'); // Komprimera HTML
const livereload = require('gulp-livereload'); // Läser in ändringar vid sparning
const sourcemaps = require('gulp-sourcemaps'); // Kartlägger kod
const autoprefixer = require('gulp-autoprefixer'); // Stöd för fler webbläsare
const sass = require('gulp-sass')(require('sass'));

// Sökvägar
const files = {
    htmlPath: "src/**/*.html",
    sassPath: "src/style/*.scss",
    jsPath: "src/js/*.js",
    imgPath: "src/images/*"
}

// HTML-task, kopierar filer
function htmlTask() {
    return src(files.htmlPath)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(sourcemaps.write('../maps'))
    .pipe(dest('pub'))
    .pipe(livereload());
}

// JS-task, konkatenera filer
function jsTask() {
    return src(files.jsPath)
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(terser())
    .pipe(sourcemaps.write('../maps'))
    .pipe(dest('pub/js'))
    .pipe(livereload());
}

// Sass-task, förvandlar till css, konkatenerar ihop till main.css och komprimerar
function sassTask() {
    return src(files.sassPath)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('main.css'))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('../maps'))
    .pipe(dest('pub/style'))
    .pipe(livereload());
}

// IMG-task, flyttar över till pub
function imgTask() {
    return src(files.imgPath) 
    .pipe(dest('pub/images'))
    .pipe(livereload())
}

// Watch
function watchTask() {
    watch([files.htmlPath, files.jsPath, files.sassPath, files.imgPath], parallel(htmlTask, jsTask, sassTask, imgTask));
}

exports.default = series(
    parallel(htmlTask, jsTask, sassTask, imgTask),
    watchTask
);
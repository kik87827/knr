const gulp = require("gulp");
const fileinclude = require('gulp-file-include');
const webserver = require('gulp-webserver');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const scss = require('gulp-sass')(require('sass'));
const jshint = require('gulp-jshint');
const beautify = require('gulp-beautify');
const htmlbeautify = require('gulp-html-beautify');

// SCSS
function scssTask() {
	return gulp.src('./src/scss/*.scss')
		.pipe(sourcemaps.init())
		.pipe(scss().on('error', scss.logError))
		.pipe(autoprefixer())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./dist/css/'));
}

// HTML Beautify
function htmlbeautifyTask() {
	const options = { indent_with_tabs: true };
	return gulp.src('./src/**.html')
		.pipe(htmlbeautify(options))
		.pipe(gulp.dest('./dist/'));
}

// JS Lint
function jshintTask() {
	return gulp.src('./src/js/front.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
}

// JS Beautify
function beautifyTask() {
	return gulp.src('./src/js/*.js')
		.pipe(beautify.js({ indent_size: 2 }))
		.pipe(gulp.dest('./dist/js/'));
}

// File Include
function fileincludeTask() {
	return gulp.src(['./src/**.html'], { base: "./src/" })
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}).on('error', function () { console.log('path error'); }))
		.pipe(htmlbeautify({ indent_with_tabs: true }))
		.pipe(gulp.dest('./dist/'));
}

// Webserver
function webserverTask() {
	return gulp.src('./dist/')
		.pipe(webserver({
			livereload: true,
			open: true,
			port: 7474
		}));
}

// Watch
function watchTask() {
	gulp.watch(['./src/**.html', './src/*/**.html'], gulp.series(fileincludeTask));
	gulp.watch(['./src/scss/**/*.scss'], gulp.series(scssTask));
	gulp.watch(['./src/js/*.js'], gulp.series(beautifyTask));
}


// Default (Gulp 4)
exports.default = gulp.series(
	fileincludeTask,
	beautifyTask,
	/* gulp.parallel(watchTask, webserverTask) */
	gulp.parallel(watchTask)
);

// 개별 실행 가능하도록 export
exports.scss = scssTask;
exports.htmlbeautify = htmlbeautifyTask;
exports.jshint = jshintTask;
exports.beautify = beautifyTask;
exports.fileinclude = fileincludeTask;
/* exports.webserver = webserverTask; */
exports.watch = watchTask;

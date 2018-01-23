'use strict';

import gulp from 'gulp';
import cssnano from 'cssnano';
import browserslist from 'browserslist';
import autoprefixer from 'autoprefixer';
import stylelint from 'stylelint';
import sass from 'gulp-sass';
import dest from 'gulp-dest';
import imagemin from 'gulp-imagemin'
import clean from 'gulp-clean';
import postcss from 'gulp-postcss';
import reporter from 'postcss-reporter';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import order from 'gulp-order';
import uglify from 'gulp-uglify';

// CSS parsing and compression

gulp.task('css', ['clean-css-dir'], () => {
	return gulp.src(['src/scss/**/*.scss'])
		.pipe(sass({
			includePaths: ['./node_modules/normalize-scss/sass']
		}))
		.pipe(postcss([
			// stylelint(),
			autoprefixer({
				browsers: browserslist(),
				cascade: false
			}),
			cssnano({
				discardComments: {
					removeAll: true
				}
			}),
			reporter({
				clearMessages: true
			})
		]))
		.pipe(dest('assets/css', {
			ext: '.min.css'
		}))
		.pipe(gulp.dest('./'));
});

// Image compression

gulp.task('imagemin', ['clean-images-dir'], () => {
	return gulp.src(['src/images/*'])
		.pipe(imagemin([
			imagemin.jpegtran({
				progressive: true
			})
		], {
			verbose: true
		}))
		.pipe(gulp.dest('./assets/images'));
});

gulp.task('js', ['js-vendor'], () => {
	return gulp.src(['src/js/**/*.js', '!src/js/vendor/**/*.js'])
		.pipe(order([
			'inputHandler.js',
			'private.js',
			'submissionHandler.js'
		]))
		.pipe(babel())
		.pipe(concat('built-scripts.js'))
		.pipe(uglify({
			mangle: false
		}))
		.pipe(dest('assets/js', {
			ext: '.min.js'
		}))
		.pipe(gulp.dest('./'));
});

gulp.task('js-vendor', ['clean-js-dir'], () => {
	return gulp.src(['src/js/vendor/*.js'])
		.pipe(gulp.dest('./assets/js'));
})


// Clean up directories

gulp.task('clean-css-dir', () => {
	return gulp.src('assets/css', {
			read: false
		})
		.pipe(clean());
});

gulp.task('clean-images-dir', () => {
	return gulp.src('assets/images', {
			read: false
		})
		.pipe(clean());
});

gulp.task('clean-js-dir', () => {
	return gulp.src('assets/js', {
			read: false
		})
		.pipe(clean());
});

gulp.task('watch', ['css', 'js'], function () {
	gulp.watch(['src/scss/**/*.scss'], ['css']);
	gulp.watch(['src/js/**/*.js'], ['js']);
});

// Run Tasks

gulp.task('compile', ['css', 'js', 'imagemin']);
gulp.task('default', ['watch']);
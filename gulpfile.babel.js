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

gulp.task('watch', ['css'], function () {
	return gulp.watch(['src/scss/**/*.scss'], ['css']);
});

// Run Tasks

gulp.task('compile', ['css', 'imagemin']);
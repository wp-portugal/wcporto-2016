var gulp = require('gulp'),
	plugins = require('gulp-load-plugins')({
		'rename' : {
			'gulp-util' : 'gutil',
		}
	});

// A single variable to hold all the paths
var paths = {
	'styles' : ['./assets/scss/**/*.scss'],
};

// Compile and minify SCSS files
gulp.task('styles', function() {
	'use strict';
	return gulp.src(paths.styles)
		.pipe(plugins.plumber(
			function(err) {
				plugins.gutil.log(plugins.gutil.colors.red( 'Error on ' + err.plugin + '\n' + err.messageFormatted ) );
				plugins.gutil.beep();
				this.emit('end');
			}
		))
		.pipe(plugins.sass({
			'includePaths' : require('node-normalize-scss').with('./assets/scss/style.scss')
		}))
		.pipe(plugins.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest('./dist/css'))
		.pipe(plugins.rename({
			'suffix' : '.min'
		}))
		.pipe(plugins.cssnano())
		.pipe(gulp.dest('./dist/css'))
		.pipe(plugins.notify({
			'message' : 'Styles updated',
			'onLast'  : true
		}));
});

// Live update these files
gulp.task('watch', function() {
	'use strict';
	gulp.watch(paths.styles, ['styles']);
	plugins.livereload.listen();
	gulp.watch(['./dist/**/*']).on('change', plugins.livereload.changed);
});

gulp.task('default', [
	'styles',
	'watch'
]);

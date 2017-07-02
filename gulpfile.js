const browserSync = require('browser-sync').create();
var path        = require('path');
var child       = require('child_process');
var gulp        = require('gulp');
var gutil       = require('gulp-util');
var clean       = require('gulp-clean');
var sequence    = require('run-sequence');
var concat      = require('gulp-concat');
var cache       = require('gulp-cache');
var named         = require('vinyl-named');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var minifyCSS   = require('gulp-csso');
var imageMin    = require('gulp-imagemin')
var uglify      = require('gulp-uglify');
var webpack       = require('webpack-stream');

var root        = path.resolve('./newae-webui/style_library/');
var dest        = path.resolve(root, './static/');
var messages    = {
  djangoBuild: '<span style="color: grey">Running:</span> $ python manage.py runserver',
};


// Launch Django
gulp.task('django', function() {
  browserSync.notify(messages.djangoBuild);
  const django = child.spawn('python3', [path.resolve('./newae-webui') + '/manage.py', 'runserver']);

  const djangoLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gutil.log('Django: ' + message));
  };

  django.stdout.on('data', djangoLogger);
  django.stderr.on('data', djangoLogger);

  return django;
});

// Launch browserSync server for live dev 
gulp.task('browser-sync', ['django'], function() {
  browserSync.init({
    files: [root + "/templates/**/*.html"],
    proxy: '127.0.0.1:8000',
    reloadDelay: 300,
    reloadDebounce: 500,
    open: false
  });
});

// Copy vendor styles from npm
gulp.task('vendor', function() {
  return gulp.src('node_modules/tachyons/css/tachyons.min.css')
    .pipe(gulp.dest('src/sass/vendor'))
});

// Compile _scss from src/scss/
gulp.task('sass', ['vendor'], function () {
  return gulp.src('src/sass/**/*.scss')
    .pipe(sass({
      includePaths: ['scss'],
      onError: browserSync.notify
    }))
    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(minifyCSS())
    .pipe(gulp.dest(dest + '/css'))
    .pipe(browserSync.reload({stream:true}))
});

// Minify and concatenate js from /src/js/
gulp.task('js', function() {
  gulp.src('src/js/vendor/**/*.js')
    .pipe(gulp.dest(dest + '/js'));

  gulp.src(['src/js/**', '!src/js/vendor{,/**/*}'])
    .pipe(named())
    .pipe(webpack({
      output: {
        filename: '[name].min.js'
      },
    })) 
    .pipe(uglify())
    .pipe(gulp.dest(dest + '/js'))
    .pipe(browserSync.reload({stream:true}));
});

// Compress and move images from src/img/
gulp.task('images', function() {
  return gulp.src('./src/img/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(cache(imageMin()))
    .pipe(gulp.dest(dest + '/img/'))
    .pipe(browserSync.reload({stream:true}))
});

// Watch for changes & recompile
gulp.task('watch', function () {
  gulp.watch('./src/sass/**/*.scss', ['sass']);
  gulp.watch(['src/js/**/*.js'], ['js']);
  gulp.watch('./src/img/**/*.+(png|jpg|jpeg|gif|svg)', ['images']);
});

gulp.task('clean', ['done'], function() {
  return gulp.src(siteRoot)
    .pipe(clean({force: true}));
});

gulp.task('done', function() {
  return gulp.src(dest)
    .pipe(clean({force: true}));
});

gulp.task('process', [ 'sass', 'js', 'images' ]);

gulp.task('build', function(cb) {
  return sequence('clean', 'process', cb);
});

gulp.task('default', ['process', 'browser-sync', 'watch' ]);

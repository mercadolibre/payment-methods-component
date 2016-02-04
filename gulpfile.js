'use strict';
// generated on 2016-01-14 using generator-ui-component 0.3.0
var gulp = require('gulp'),

    $ = require('gulp-load-plugins'),
    browserSync = require('browser-sync'),
    spritesmith = require('gulp.spritesmith'),
    resize = require('gulp-image-resize'),
    reload = browserSync.reload,
    concat = require('gulp-concat'),
    merge = require('merge-stream'),
    swift = require('ui-swift'),
    sass =  require('gulp-sass'),
    rename = require("gulp-rename");


var sites = ['mla', 'mlb', 'mlc', 'mco', 'mlm', 'mlv', 'mpe'];
var size = ['large', 'medium', 'default']


// Create all  images sizes // FUNCIONA OK
gulp.task('img-build', function () {

  sites.forEach(function (site) {

    size.forEach(function (size, index) {

      var retina = gulp.src('./src/images/'+ site +'/*.png')
        .pipe(resize({width: (100-25*index).toString()+'%', crop:false, upscale:false}))
        .pipe(gulp.dest('./build/'+ site +'/images/'+ size + '/@2x/'));

      var normal =  gulp.src('./src/images/'+ site +'/*.png')
        .pipe(resize({width: ( (100-25 * index)/2).toString()+'%', crop:false, upscale:false}))
        .pipe(gulp.dest('./build/'+ site +'/images/'+ size));

      return merge(normal, retina);

    })
  })
});

// Create all  css for images sizes
gulp.task('scss-build', function () {

  sites.forEach(function (site) {

      size.forEach(function (size, index) {

        var normal = gulp.src('./build/'+ site +'/images/'+ size + '/*.png')
          .pipe(spritesmith({
            imgName: 'images/'+ size + '.png',
            cssName: 'scss/payment-methods-component-' + size + '.scss',
            cssTemplate: 'src/templates/payment-methods-'  + size + '.handlebars',
            algorithm: 'top-down'
          }))
          .pipe(gulp.dest('./build/'+site));

        var retina = gulp.src('./build/'+ site +'/images/'+ size + '/@2x/*.png')
          .pipe(spritesmith({
          imgName: 'images/'+ size + '@2x.png',
            cssName: 'scss/payment-methods-component-' + size + '.scss',
            cssTemplate: 'src/templates/payment-methods-'  + size + '.handlebars',
            algorithm: 'top-down'
          }))
          .pipe(gulp.dest('./build/'+site));

        return merge(normal, retina);
      })
  })
});

// $ gulp sass
gulp.task('css-build', function () {

    sites.forEach(function (site) {
        return gulp.src('./build/'+ site +'/scss/*.scss')
            .pipe(sass())
            .pipe(gulp.dest('./build/'+ site +'/css'));
        })

});

// Default Task
gulp.task('build', ['img-build', 'css-build']);


// Concat all css for site
gulp.task('styles-concat', function() {
 sites.forEach(function (site) {
   return gulp.src('./src/scss/'+ site +'/*.scss')
     .pipe(concat('scss/payment-methods-component-' + site + '.scss'))
     .pipe(gulp.dest('./build/'+ site));
 })
});


gulp.task('images', function() {
    return gulp.src('src/images/**/*')
        .pipe($.imagemin({
            progressive: true,
            interlaced: true,
            svgoPlugins: [{
                cleanupIDs: false
            }]
        }))
        .pipe($.size({
            title: 'images'
        }))
        .pipe(gulp.dest('dist'));
});


gulp.task('watch', function() {
    
});

gulp.task('serve', ['default'], function() {
    browserSync({
        notify: false,
        port: 9000,
        server: {
            baseDir: ['./','dist']
        }
    });
    gulp.watch('src/styles/**/*.scss', ['styles']);
    gulp.watch('src/scripts/**/*.js', ['js']);
    gulp.watch('src/images/**/*', ['images']);

    gulp.start('watch');
});















// $ gulp sass
gulp.task('sass-style', function () {
    gulp.src('src/scss/pmc.scss')
    .pipe(sass())
    .pipe(gulp.dest(''));
});

gulp.task('watch1', function() {
    gulp.watch('src/scss/pmc.scss', ['sass-style']);
})
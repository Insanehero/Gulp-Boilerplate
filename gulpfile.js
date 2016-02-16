const path = require('path');
const gulp = require('gulp');
const babel = require('gulp-babel');
const nodemon = require('gulp-nodemon');
const uglify = require('gulp-uglify');
const less = require('gulp-less');
const minifyCSS = require('gulp-minify-css');
const concat = require('gulp-concat');

gulp.task('productionify', () => {
  return gulp.src('src/*.js') //Specifiy JS files to process
  .pipe(concat('main.js')) //Concatenate all files into one
  .pipe(babel({ //Convert ES6 to ES5 standards
    presets: ['es2015']
  }))
  .pipe(uglify())
  .pipe(gulp.dest('dist/js'));
});

gulp.task('lessify', () => {
  return gulp.src('less/*.less') //Specifiy less files to process
    .pipe(concat('style.css'))
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(gulp.dest('dist/css'));
});

gulp.task('default', () => {
  nodemon({
    script: 'server.js',
    tasks: ['productionify', 'less'],
    ignore: ['dist/js/*', 'dist/css/*'],
    tasks: (changedFiles) => {
    var tasks = [];
    changedFiles.forEach(file => {
      if (path.extname(file) === '.js' && !~tasks.indexOf('productionify')) tasks.push('productionify')
      if (path.extname(file) === '.less' && !~tasks.indexOf('lessify')) tasks.push('lessify')
    })
    return tasks;
  }
  })
  .on('restart', () => {
  })
});

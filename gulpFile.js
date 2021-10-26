const { parallel, src, dest,watch} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat=require('gulp-concat');
const autoprefixer = require('autoprefixer');
const postcss    = require('gulp-postcss')
const sourcemaps = require('gulp-sourcemaps')
const cssnano = require('cssnano');
const terser = require('gulp-terser-js');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const notify = require('gulp-notify');
const cache = require('gulp-cache');
const webp = require('gulp-webp');


const paths = {
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    imagenes: 'src/img/**/*'
}


function css() {
    return src(paths.scss)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    // .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write('.'))
    .pipe( dest('./build/css') );
}

function javaScript() {
    return src(paths.js)
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.js')) // final output file name
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('./build/js'))
}


function imagenes() {
    return src(paths.imagenes)
        .pipe(cache(imagemin({ optimizationLevel: 3})))
        .pipe(dest('build/img'))
        .pipe(notify({ message: 'Imagen Completada'}));
}

function versionWebp() {
    return src(paths.imagenes)
        .pipe( webp() )
        .pipe(dest('build/img'))
        .pipe(notify({ message: 'Imagen Completada'}));
}

function watchArchivos() {
    watch(paths.scss,css);//* carpeta actual
    watch(paths.js,javaScript);
   
}

exports.css=css;
exports.javaScript=javaScript;
exports.imagenes=imagenes;
exports.versionWebp=versionWebp;
exports.watchArchivos=watchArchivos;

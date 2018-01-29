const gulp = require('gulp');
const ts = require('gulp-typescript');
const sm = require('gulp-sourcemaps');
const cl = require('gulp-clean');
const lint = require('gulp-tslint');

const tsp = ts.createProject('tsconfig.json');
const index = ts.createProject({
    target: "es6",
    module: "commonjs"
});

gulp.task('build', () => {
    return gulp.src([
            './src/**/*.ts'
        ])
        .pipe(sm.init())
        .pipe(tsp())
        .pipe(sm.write('.'))
        .pipe(gulp.dest('./dist'));      
});

gulp.task('clean', () => 
        gulp.src([
            './dist/*'
        ])
        .pipe(cl())     
);
const gulp = require('gulp');
const ts = require('gulp-typescript');
const sm = require('gulp-sourcemaps');

const tsp = ts.createProject('tsconfig.json');

gulp.task('build', ['typescript', 'static']);

gulp.task('typescript', () => {
    return gulp.src([
            'src/**/*.ts'
        ])
        .pipe(sm.init())
        .pipe(tsp())
        .pipe(sm.write('.'))
        .pipe(gulp.dest('./dist'));      
});
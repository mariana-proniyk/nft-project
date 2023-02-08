const { watch, src, dest, series, parallel } = require("gulp");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass")(require("sass"));
const rename = require("gulp-rename");
const ts = require("gulp-typescript");
const plumber = require("gulp-plumber");
const concat = require("gulp-concat");
const pug = require("gulp-pug");

const handleError = (err) => {
    console.log(err);
    this.emit("end");
};

function serverTask(done) {
    browserSync.init({
        server: {
            baseDir: "./",
        },
    });
    watch("./*.html").on("change", browserSync.reload);
    watch("./assets/scss/*.scss", scssTask);
    watch("./assets/ts/*.ts", tsTask);
    watch("./assets/pug/**/*.pug", pugTask);
    done();
}

function scssTask(done) {
    src("./assets/scss/main.scss")
        .pipe(
            plumber({
                handleError,
            })
        )
        .pipe(
            sass.sync({
                outputStyle: "compressed",
                errLogToConsole: true,
            })
        )
        .pipe(plumber.stop())
        .pipe(rename({ suffix: ".min" }))
        .pipe(dest("./public/css/"))
        .pipe(browserSync.reload({ stream: true }));
    done();
}

function librariesTask(done) {
    src([
        "./node_modules/jquery/dist/jquery.min.js",
        "./node_modules/jquery-validation/dist/jquery.validate.min.js",
    ])
        .pipe(
            plumber({
                handleError,
            })
        )
        .pipe(concat("libraries.min.js"))
        .pipe(dest("./public/js"));
    done();
}

function tsTask(done) {
    src("./assets/ts/main.ts")
        .pipe(
            plumber({
                handleError,
            })
        )
        .pipe(
            ts({
                noImplicitAny: true,
            })
        )
        .pipe(plumber.stop())
        .pipe(rename({ suffix: ".min" }))
        .pipe(dest("./public/js/"))
        .pipe(browserSync.reload({ stream: true }));
    done();
}

function pugTask(done) {
    src("./assets/pug/*.pug")
        .pipe(
            plumber({
                handleError,
            })
        )
        .pipe(
            pug({
                basedir: "./assets/pug/*.pug",
            })
        )
        .pipe(plumber.stop())
        .pipe(dest("./"));
    done();
}

exports.default = series(
    parallel(scssTask, tsTask, pugTask, librariesTask),
    serverTask
);
exports.build = parallel(scssTask, tsTask, pugTask, librariesTask);

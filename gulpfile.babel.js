import gulp from "gulp";
import sourcemaps from "gulp-sourcemaps";
import sass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import browserSync from "browser-sync";

let bs = browserSync.create("bs-server");

let cssSrc = "src/**/*.scss";
let cssDest = "dist";

gulp.task("build-css", () => {
    return gulp.src(cssSrc)
        .pipe(sourcemaps.init({debug: true}))
        .pipe(sass({
            // See: https://github.com/sass/node-sass/issues/957
            //outputStyle: "compressed"
            outputStyle: "expanded"
        }).on("error", sass.logError))
        .pipe(autoprefixer({
            // Default for Browserslist (https://github.com/ai/browserslist) @ 2015/09/18
            browsers: ["> 1%", "last 2 versions", "Firefox ESR"]
        }))
        .pipe(sourcemaps.write(".", {debug: true}))
        .pipe(gulp.dest(cssDest))
        .pipe(browserSync.get("bs-server").stream({match: "**/*.css"}));
});

gulp.task("serve", ["build-css"], () => {
    bs.init({
        server: {
            baseDir: "dist"
        }
    });
});

// Log file changes to the console.
function reportChange(event) {
    console.log(`File ${event.path} was ${event.type}, running tasks...`);
};

gulp.task("watch", ["serve"], () => {
    gulp.watch("src/**/*.scss", ["build-css"]).on("change", reportChange);
});

gulp.task("default", ["watch"]);
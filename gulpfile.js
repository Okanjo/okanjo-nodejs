"use strict";

const Gulp = require('gulp');
const Concat = require('gulp-concat');
const Rename = require('gulp-rename');
const Replace = require('gulp-replace');
const VinylSource = require('vinyl-source-stream');
const VinylBuffer = require('vinyl-buffer');
const SourceMaps = require('gulp-sourcemaps');
const Uglify = require('gulp-uglify');
const NunjucksRender = require('gulp-nunjucks-render');
const Del = require('del');
const Browserify = require('browserify');

const ApiSpecification = require('./lib/helpers/api_spec');
let api = null;

// Sources
const resourceTemplateDir = 'templates'; // string or array
const resourcesTemplateSrc = `${resourceTemplateDir}/resources.njk`;
const clientSources = [
    'lib/client_base.js',
    'dist/partials/resources.js'
];

// Clean up everything
Gulp.task('clean', function() {
    return Del([
        'dist/**/*'
    ]);
});


// Gets the latest API spec
Gulp.task('get_spec', [], (done) => {
    const apiSpec = new ApiSpecification();
    apiSpec.getSpecification((err) => {
        if (err) {
            done(err);
        } else {
            api = apiSpec;
            // console.log(api);
            //console.log(api.getResourceMapArray());
            done();
        }
    });
});

// Generate resources from API spec
Gulp.task('gen_resources', ['get_spec'], () => {
    return Gulp
        .src(resourcesTemplateSrc)
        .pipe(NunjucksRender({
            path: resourceTemplateDir,
            data: {
                resources: api.getResourceMapArray()
            }
        }))
        .pipe(Rename('resources.js'))
        .pipe(Gulp.dest('dist/partials'))
});

// Marries the resource spec and client together, and includes current version
Gulp.task('build_client', ['gen_resources'], () => {
    return Gulp
        .src(clientSources)
        .pipe(Concat('client.js'))
        .pipe(Replace(/%%OKANJO_VERSION%%/, require('./package.json').version))
        .pipe(Gulp.dest('dist'))
});

// Builds the browser version of the client
Gulp.task('build_browser_client', ['build_client'], () => {
    const bundler = Browserify();

    bundler.ignore('./lib/providers/http_provider.js');
    bundler.require('./dist/client.js', { expose: 'okanjo-sdk' });

    return bundler.bundle()
        .pipe(VinylSource('okanjo-sdk.js'))
        .pipe(Gulp.dest('dist'))
        .pipe(VinylBuffer())
        .pipe(Rename('okanjo-sdk.min.js'))
        .pipe(SourceMaps.init())
        .pipe(Uglify())
            .on('error', (err) => { console.error('Blew up uglifying sources!', err.stack); })
        .pipe(SourceMaps.write('./'))
        .pipe(Gulp.dest('dist'))
});

// Watches for changes for active development
Gulp.task('watch_templates', () => {
    Gulp.watch(resourceTemplateDir+'/*.njk', ['build']);
});

// Default entry point (development)
Gulp.task('build', ['build_browser_client']);

Gulp.task('default', ['build', 'watch_templates']);
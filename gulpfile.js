"use strict";

const { src, dest, series, watch } = require('gulp');
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

const ApiSpecification = require('./src/helpers/api_spec');

const apiSpec = new ApiSpecification({
    name: 'api',
    endpoint: 'https://dev-api2.okanjo.com'
});
const farmSpec = new ApiSpecification({
    name: 'farm',
    namespace: 'farm',
    endpoint: 'https://dev-farm.okanjo.com',
});
const shortcodesSpec = new ApiSpecification({
    name: 'shortcodes',
    namespace: 'shortcodes',
    endpoint: 'https://dev-shortcodes.okanjo.com'
});

// Sources
const resourceTemplateDir = 'templates'; // string or array
const resourcesTemplateSrc = `${resourceTemplateDir}/resources.njk`;
const clientSources = [
    'src/client_base.js',
    'dist/partials/resources.js',
    'dist/partials/farm_resources.js',
    'dist/partials/shortcodes_resources.js',
];

// Clean up everything
exports.clean = async function clean() {
    await Del([
        'dist/**/*'
    ]);
};


// Gets the latest API spec
exports.get_api_spec = async function get_api_spec() {
    return await apiSpec.getSpecification();
};

exports.get_farm_spec = async function get_farm_spec() {
    return await farmSpec.getSpecification();
};

exports.get_shortcodes_spec = async function get_shortcodes_spec() {
    return await shortcodesSpec.getSpecification();
};

exports.gen_api_resources = series(
    exports.get_api_spec,
    function gen_api_resources_builder() {
        return src(resourcesTemplateSrc)
            .pipe(NunjucksRender({
                path: resourceTemplateDir,
                data: {
                    api: apiSpec.name,
                    namespace: apiSpec.namespace,
                    resources: apiSpec.getResourceMapArray()
                }
            }))
            .pipe(Rename('resources.js'))
            .pipe(dest('dist/partials'))
        ;
    }
);

exports.gen_farm_resources = series(
    exports.get_farm_spec,
    function gen_farm_resources_builder() {
        return src(resourcesTemplateSrc)
            .pipe(NunjucksRender({
                path: resourceTemplateDir,
                data: {
                    api: farmSpec.name,
                    namespace: farmSpec.namespace,
                    resources: farmSpec.getResourceMapArray()
                }
            }))
            .pipe(Rename('farm_resources.js'))
            .pipe(dest('dist/partials'))
        ;
    }
);

exports.gen_shortcodes_resources = series(
    exports.get_shortcodes_spec,
    function gen_shortcodes_resources_builder() {
        return src(resourcesTemplateSrc)
            .pipe(NunjucksRender({
                path: resourceTemplateDir,
                data: {
                    api: shortcodesSpec.name,
                    namespace: shortcodesSpec.namespace,
                    resources: shortcodesSpec.getResourceMapArray()
                }
            }))
            .pipe(Rename('shortcodes_resources.js'))
            .pipe(dest('dist/partials'))
        ;
    }
);

// Marries the resource spec and client together, and includes current version
exports.build_client = series(
    exports.gen_api_resources,
    exports.gen_farm_resources,
    exports.gen_shortcodes_resources,
    function build_client_builder() {
        return src(clientSources)
            .pipe(Concat('client.js'))
            .pipe(Replace(/%%OKANJO_VERSION%%/, require('./package.json').version))
            .pipe(dest('dist'))
    }
);

// Builds the browser version of the client
exports.build_browser_client = series(
    exports.build_client,
    function build_browser_client_builder() {
        const bundler = Browserify();

        bundler.ignore('./src/providers/http_provider.js');
        bundler.require('./dist/client.js', { expose: 'okanjo-sdk' });

        return bundler.bundle()
            .pipe(VinylSource('okanjo-sdk.js'))
            .pipe(dest('dist'))
            .pipe(VinylBuffer())
            .pipe(Rename('okanjo-sdk.min.js'))
            .pipe(SourceMaps.init())
            .pipe(Uglify())
            .on('error', (err) => { console.error('Blew up uglifying sources!', err.stack, err); })
            .pipe(SourceMaps.write('./'))
            .pipe(dest('dist'))
    }
);

// Default entry point (development)
exports.build = series(exports.build_browser_client);

// Watches for changes for active development
exports.watch_templates = function watch_templates() {
    watch(resourceTemplateDir+'/*.njk', series(exports.build));
};

exports.default = series(exports.build, exports.watch_templates);
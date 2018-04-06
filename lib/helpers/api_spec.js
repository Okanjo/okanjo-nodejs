"use strict";

const Needle = require('needle');

/**
 * API specification processor
 */
class ApiSpecification {

    /**
     * API Specification constructor
     * @param options
     */
    constructor(options) {
        options = options || {};
        this.endpoint = options.endpoint || "http://localhost:4100";
        //this.endpoint = options.endpoint || "http://192.168.99.100:4100";
        this.specPath = options.path || '/docs/json';

        /**
         * Raw API specification, array of routes
         * @type {Array|null}
         */
        this.rawSpec = null;

        /**
         * Processed API specification map, keyed by resource name
         * @type {Map|null}
         */
        this.resourceMap = null;
    }

    /**
     * Gets the latest API specification and processes it
     * @param callback
     */
    getSpecification(callback) {
        Needle.get(this.endpoint+this.specPath, (err, res) => {
            if (err) {
                callback(err);
            } else {
                // noinspection JSUnusedGlobalSymbols
                this.rawSpec = res.body;
                this._processSpecification();
                callback(null);
            }
        });
    }

    /**
     * Converts the raw specification into a mapping of routes by resource
     * @private
     */
    _processSpecification() {
        const resourceMap = new Map();

        // Process each route and sort it by resource
        this.rawSpec.forEach((route) => {
            // Get the resource
            const resourceName = route.resource.name;
            let resource = resourceMap.get(resourceName);

            // Create it if not present
            if (!resource) resource = [];

            // Add route to resource
            resource.push(route);

            // Update resource
            resourceMap.set(resourceName, resource);
        });

        // noinspection JSUnusedGlobalSymbols
        this.resourceMap = resourceMap;
    }

    /**
     * Converts the resource Map object to an array of resource types and routes
     * @return {[Object]}
     */
    getResourceMapArray() {
        const resources = [];
        this.resourceMap.forEach((routes, name) => {
            resources.push({
                name: name,
                pluralized: routes[0].resource.pluralized,
                pretty: routes[0].resource.pretty,
                routes
            });
        });
        return resources;
    }
}

module.exports = ApiSpecification;
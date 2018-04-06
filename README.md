# Okanjo API – JavaScript SDK

[![Build Status](https://travis-ci.org/Okanjo/okanjo-nodejs.svg?branch=master)](https://travis-ci.org/Okanjo/okanjo-nodejs) [![Coverage Status](https://coveralls.io/repos/github/Okanjo/okanjo-nodejs/badge.svg?branch=master)](https://coveralls.io/github/Okanjo/okanjo-nodejs?branch=master)

This library provides easy integration with the Okanjo platform.

## Installing

Add to your project like so: 

```sh
npm install okanjo
```

Note: this module requires: 

* an API key in order to access the Okanjo platform
* an Okanjo Platform Account in order to access some API routes 

## Usage

You can use this module from Node.js or in the browser. 

```js
const OkanjoAPI = require('okanjo'); 
const api = new OkanjoAPI({
    key: 'YOUR_API_KEY_HERE'    // Set your API key here
});
```

> If you use the SDK in the browser, be very mindful of security. 
> Do not publish or expose API keys or account credentials to the public!

When using in the browser, it is expected that you provide a server-side route to proxy API requests. 
This way, API keys, session secrets, etc can all be kept secure from the public. 
By default, the expected route is `POST /rpc`. The browser-based client will serialize the request so that the server
side SDK instance can execute it directly with `api._makeRequest(payload, (err, res) => { ... });`.

## new OkanjoAPI([options])
Creates a new instance of the API client.
* `options` - Configuration options
  * `options.provider` – The communication provider class to use. Defaults to `HttpProvider` for Node.js applications and `FetchProvider` for browser-based invocation.
  
HttpProvider Configuration Options
* `options.key` – The API key to use on requests.   
* `options.sessionToken` – The session token to use on requests.
* `options.timeout` – The client request timeout in milliseconds. Once elapsed, the request will be aborted. Defaults to `30000` (30s).
* `options.protocolName` – The communication protocol to use, either `http` or `https`. Defaults to `https`.
* `options.host` – The remote host to use. Defaults to `api2.okanjo.com` (live).  
* `options.port` – The remote port to use. Defaults to `443`.
* `options.userAgent` – The user agent to identify as. Defaults to `okanjo-nodejs/<sdk-version>`.

FetchProvider/jQueryProvider Configuration Options
* `options.rpcHost` – The server endpoint to proxy requests through. Defaults to `/rpc`. 
* `options.rpcMethod` – The HTTP method the to invoke. Defaults to `POST`.

Common configuration options include:
* `options.onUnauthorizedResponse = (err, query) => { ... }` – Fired when a response comes back 401-Unauthorized

## Making requests

API endpoints are organized by `resource.action` on the client. For example:

```js
api.sessions.create(payload, (err, res) => {
    // err will be set if the request failed in any way
    // res will be set if the request was successful 
});
```

Here, `sessions` is our resource group. `create` is the action. 
The callback returns two parameters, `err` and `res`. If the request failed or any reason, `err` will be set. 
If the request was successful, `res` will be set. Both `err` and `res` are both the response payload from the server.

See the [Okanjo API documentation](https://developer.okanjo.com/api) for information on what routes are available for use.
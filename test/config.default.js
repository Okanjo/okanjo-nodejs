//
// Environment configurations, export the one you want to use
// Update the file and save it as config.js
//

var sandbox = {
        api: {
            key: 'TEST-YOUR_API_KEY_HERE',
            passPhrase: 'YOUR_PASSPHRASE_HERE',
            endpoint: 'sandbox-api.okanjo.com'
        },

        user1: {
            action: 'loginUsernamePassword',
            username: 'YOUR_USERNAME_HERE',
            password: 'YOUR_PASSWORD_HERE'
        },

        client: {
            BalancedMarketplaceUri: '/v1/marketplaces/TEST-MPrnJQJHu7QjihgE61ch0MT'
        }
    },
    production = {
        api: {
            key: 'YOUR_API_KEY_HERE',
            passPhrase: 'YOUR_PASSPHRASE_HERE',
            endpoint: 'api.okanjo.com'
        },

        user1: {
            action: 'loginUsernamePassword',
            username: 'YOUR_USERNAME_HERE',
            password: 'YOUR_PASSWORD_HERE'
        },

        client: {
            BalancedMarketplaceUri: '/v1/marketplaces/MP6vnNdXY7izEEVPs1gl7jSy'
        }
    };

module.exports = exports = sandbox;
//module.exports = exports = production;
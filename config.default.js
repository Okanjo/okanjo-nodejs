//
// Environment configurations, export the one you want to use
// Update the file and save it as config.js
//

var ads = {

        //
        // OKANJO ADS PLATFORM CREDENTIALS
        //

        sandbox: {
            api: {
                // If authenticating via API key
                key: 'AK_YOUR_API_KEY_HERE',
                secret: 'AP_YOUR_API_SECRET'
            },

            // If authenticating via account login
            user1: {
                email: 'YOUR_ACCOUNT_EMAIL_ADDRESS',
                password: 'YOUR_ACCOUNT_PASSWORD'
            }
        },

        production: {
            api: {
                // If authenticating via API key
                key: 'AK_YOUR_API_KEY_HERE',
                secret: 'AP_YOUR_API_SECRET'
            },

            // If authenticating via account login
            user1: {
                email: 'YOUR_ACCOUNT_EMAIL_ADDRESS',
                password: 'YOUR_ACCOUNT_PASSWORD'
            }
        }

    },

    marketplace = {

        //
        // OKANJO MARKETPLACE PLATFORM CREDENTIALS
        //

        sandbox: {
            api: {
                key: 'TEST-YOUR_API_KEY_HERE',
                passPhrase: 'YOUR_PASSPHRASE_HERE',
                endpoint: 'sandbox-api.okanjo.com'
            },

            user1: {
                action: 'loginEmailPassword',
                email: 'YOUR_ACCOUNT_EMAIL_ADDRESS',
                password: 'YOUR_PASSWORD_HERE'
            },

            client: {
            }
        },

        production: {
            api: {
                key: 'YOUR_API_KEY_HERE',
                passPhrase: 'YOUR_PASSPHRASE_HERE',
                endpoint: 'api.okanjo.com'
            },

            user1: {
                action: 'loginEmailPassword',
                email: 'YOUR_ACCOUNT_EMAIL_ADDRESS',
                password: 'YOUR_PASSWORD_HERE'
            },

            client: {
            }
        }
    };

// Toggle, with comments, the profile(s) you want to use
module.exports = exports = {

    marketplace: marketplace.sandbox,
    //marketplace: marketplace.production,

    ads: ads.sandbox
    //ads: ads.production
};
//
// Environment configurations, export the one you want to use
// Update the file and save it as config.js
//

var config = {

    //
    // OKANJO PLATFORM CREDENTIALS
    //

    sandbox: {
        api: {
            // If authenticating via API key
            key: 'AK_YOUR_API_KEY_HERE',
            endpoint: 'sandbox-api.okanjo.com'
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
            key: 'AK_YOUR_API_KEY_HERE'
        },

        // If authenticating via account login
        user1: {
            email: 'YOUR_ACCOUNT_EMAIL_ADDRESS',
            password: 'YOUR_ACCOUNT_PASSWORD'
        }
    }

};


// Toggle, with comments, the profile(s) you want to use
module.exports = config.sandbox;
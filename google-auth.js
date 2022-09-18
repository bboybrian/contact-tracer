var {OAuth2Client} = require('google-auth-library');

var authClientId = "1099048101998-stvtqj8odtghnq4262pem2php95d5dfr.apps.googleusercontent.com";
var authClient = new OAuth2Client(authClientId);

async function verify(token, callback) {
    try {
        var ticket = await authClient.verifyIdToken({
            idToken: token,
            audience: authClientId,
        });
        var payload = ticket.getPayload();
        callback(null, payload);
    } catch (err) {
        callback(err, {});
    }
}

module.exports = verify;
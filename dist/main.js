"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = run;
const core_1 = require("@actions/core");
const http_client_1 = require("@actions/http-client");
const utils_1 = require("./utils");
/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
    try {
        const client_id = (0, core_1.getInput)('HCP_CLIENT_ID');
        const client_secret = (0, core_1.getInput)('HCP_CLIENT_SECRET');
        (0, utils_1.validate_entry)('HCP_CLIENT_ID', client_id);
        (0, utils_1.validate_entry)('HCP_CLIENT_SECRET', client_secret);
        (0, core_1.debug)(`keys client_id: ${(0, utils_1.mask_entry)(client_id)}, client_secret: ${(0, utils_1.mask_entry)(client_secret)}`);
        const client = new http_client_1.HttpClient('hcp');
        const req = {
            client_id: client_id,
            client_secret: client_secret,
            grant_type: 'client_credentials',
            audience: 'https://api.hashicorp.cloud'
        };
        const response = await client.postJson('https://auth.idp.hashicorp.com/oauth2/token', req, {
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        console.log('response', JSON.stringify(response));
        // Set outputs for other workflow steps to use
        (0, core_1.setOutput)('token', '123456789');
    }
    catch (error) {
        console.log('f: error', error);
        // Fail the workflow run if an error occurs
        if (error instanceof Error)
            (0, core_1.setFailed)(error.message);
    }
}
//# sourceMappingURL=main.js.map

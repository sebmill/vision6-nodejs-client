'use strict';
const http = require('https');
const url = require('url');

/**
 * @param {String} api_key Vision6 API Key
 * @param {String} [url] URL
 * @param {String} [version] API Version (3.3 by default)
 * @throws Error where API is invalid
 */
function Vision6(api_key, url, version) {
	if (api_key == undefined || !api_key.match(/[a-z0-9]{64}/)) {
		throw Error('Invalid API key');
	}
	this.version = version || '3.3';
	this.url = url || 'https://www.vision6.com.au/api/jsonrpcserver.php?version=' + this.version;
	this.api_key = api_key;
	// other default settings
	this.timeout = 30;
}

Vision6.prototype.invokeMethod = function (method_name) {
	if (method_name == undefined) {
		throw Error(`Method required`);
	}
	// convert functions arguments to array and remove first element (the method_name)
	let parameters = Object.values(arguments).splice(1) || [];
	return new Promise((resolve, reject) => {
		// initialise requestID
		this.requestID = this.requestID + 1 || 1;
		// add API key into parameters
		parameters.unshift(this.api_key);
		// payload which will be submitted to the Vision6 JSON RPC Server
		let postData = JSON.stringify({ id: this.requestID, method: method_name, params: parameters });
		// Merge header settings and URL for https request
		const options = Object.assign({}, url.parse(this.url), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': Buffer.byteLength(postData)
			},
			timeout: this.timeout
		});
		// capture response
		var body = '';

		// ignore self signed certificates
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

		// post payload to URL and capture all chunks
		let req = http.request(options, (res) => {
			res.setEncoding('utf8');
			if (res.statusCode < 200 || res.statusCode > 299) {
				reject(new Error(`Failed to retrieve valid response, status code: ${res.statusCode}`));
			}
			res.on('data', (chunk) => {
				body += chunk;
			});
			// Process result
			res.on('end', () => {
				try {
					body = JSON.parse(body);
					if (body.error == null && body.result !== undefined) {
						resolve(body.result);
					}
					else {
						reject(body.error);
					}
				}
				catch (e) {
					reject(`Invalid Response.`);
				}
			});
		});
		req.write(postData);
		req.on('error', (err) => {
			reject(err);
		})
		req.end();
	});
}

module.exports = Vision6;
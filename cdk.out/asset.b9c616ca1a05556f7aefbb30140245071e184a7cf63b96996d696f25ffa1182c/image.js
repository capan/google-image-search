const AWS = require('aws-sdk');

const https = require('https');

exports.main = async function (event, context) {
    function getRequest(url) {
        return new Promise((resolve, reject) => {
            const req = https.get(url, res => {
                let rawData = '';

                res.on('data', chunk => {
                    rawData += chunk;
                });

                res.on('end', () => {
                    try {
                        resolve(JSON.parse(rawData));
                    } catch (err) {
                        reject(new Error(err));
                    }
                });
            });

            req.on('error', err => {
                reject(new Error(err));
            });
        });
    }
    try {
        var method = event.httpMethod;
        if (method === "GET") {
            if (event.path === "/") {
                const search = event.queryStringParameters.search.replace(" ", "+");
                const url = "https://www.google.com/search?q=" + search + "&tbm=isch";
                const res = getRequest(url);
                var body = {
                    params: res
                };
                return {
                    statusCode: 200,
                    headers: {},
                    body: JSON.stringify(body)
                };
            }
        }
        return {
            statusCode: 400,
            headers: {},
            body: "We only accept GET /"
        };
    } catch (error) {
        var body = error.stack || JSON.stringify(error, null, 2);
        return {
            statusCode: 400,
            headers: {},
            body: JSON.stringify(body)
        }
    }
}

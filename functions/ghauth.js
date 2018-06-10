const https = require('https');

const CLIENT_ID = '53724f3cfff1b6af16d3';
const CLIENT_SECRET = '9c1478b4435ae5a603d62ff991784a6c84aa2a97';

exports.handler = function(event, context, callback) {
  const { oauthcode } = event.queryStringParameters;
  const base = '/login/oauth/access_token';
  const url = `${base}?code=${oauthcode}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
  const options = {
    hostname: 'github.com',
    path: url,
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  };

  const req = https.request(options, resp => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', chunk => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      callback(null, {
        statusCode: 200,
        body: data,
      });
    });
  });

  req.on('error', e => {
    callback(e);
  });
  req.end();
};

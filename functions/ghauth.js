const CLIENT_ID = '53724f3cfff1b6af16d3';
const CLIENT_SECRET = '9c1478b4435ae5a603d62ff991784a6c84aa2a97';

exports.handler = function(event, context, callback) {
  const { oauthcode } = event.queryStringParameters;
  const base = 'https://github.com/login/oauth/access_token';
  const url = `${base}?code=${oauthcode}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
  fetch(url, {
    headers: {
      Accept: 'application/json',
    },
    method: 'POST',
    referrer: 'no-referrer',
  })
    .then(response => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(response),
      });
    })
    .cathch(err => {
      callback(err);
    });
};

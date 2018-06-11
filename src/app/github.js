import GitHub from 'github-api';

const CLIENT_ID = '5596eedea4e9a8ff853b';
const scopes = 'gist';
const authApiBase = 'https://github.com/login/oauth/authorize';

export function gistSaveButton(state) {
  const el = document.getElementById('gist-save');
  el.innerHtml = '';
  if (!state.github.oauth_token) {
    const authLink = document.createElement('a');
    authLink.href = `${authApiBase}?client_id=${CLIENT_ID}&scope=${scopes}`;
    authLink.appendChild(document.createTextNode('Auth Github'));
    el.appendChild(authLink);
  } else {
    const saveButton = document.createElement('button');
    saveButton.appendChild(document.createTextNode('Save as Gist'));
    el.appendChild(saveButton);

    const gh = new GitHub({
      token: state.github.oauth_token,
    });
    state.github.client = gh;
  }
}

export function auth(state) {
  if (!state.urlArgs.code) {
    gistSaveButton(state);
    return;
  }
  const oauthcode = state.urlArgs.code;
  const base = '/.netlify/functions/ghauth';
  const url = `${base}?oauthcode=${oauthcode}`;
  fetch(url, {
    method: 'POST',
    referrer: 'no-referrer',
  })
    .then(response => response.json())
    .then(data => {
      if (data && data.access_token) {
        state.github.oauth_token = data.access_token;
        localStorage.setItem('GITHUB_OAUTH_TOKEN', data.access_token);
        const gh = new GitHub({
          token: state.github.oauth_token,
        });
        state.github.client = gh;
      }
    });
}

export function saveGist(state, filename, content) {
  if (!state.github.client) {
    return Promise.reject('No Github Client');
  }
  return state.github.client
    .getGist()
    .create({
      public: true,
      description: 'my test gist',
      files: {
        [filename]: {
          content: content,
        },
      },
    })
    .then(({ data }) => data);
}

export function loadGist(state, gistId, filename) {
  return state.github.client
    .getGist(gistId)
    .read()
    .then(({ data }) => data.files[filename]);
}

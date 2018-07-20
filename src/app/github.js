import GitHub from 'github-api';

import * as AppState from 'app/state';

const scopes = 'gist';
const authApiBase = 'https://github.com/login/oauth/authorize';

export function gistSaveButton(state) {
  const el = document.getElementById('gist-save');
  el.innerHtml = '';
  if (!state.github.oauth_token) {
    const authLink = document.createElement('a');
    authLink.href = `${authApiBase}?client_id=${
      state.github.client_id
    }&scope=${scopes}`;
    authLink.appendChild(document.createTextNode('Auth Github'));
    el.appendChild(authLink);
  } else {
    const okMsg = document.createElement('span');
    okMsg.appendChild(document.createTextNode('Github OK'));
    el.appendChild(okMsg);

    const gh = new GitHub({
      token: state.github.oauth_token,
    });
    state.github.client = gh;
  }
}

export function auth(state) {
  if (!AppState.getQueryArg(state, 'code')) {
    gistSaveButton(state);
    return;
  }
  const oauthcode = AppState.getQueryArg(state, 'code');
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
        AppState.setQueryArg(state, 'code');
        AppState.refreshURL(state);
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

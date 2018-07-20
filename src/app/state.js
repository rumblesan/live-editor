export function create() {
  const queryArgs = new URLSearchParams(window.location.search);
  const hashArgs = new URLSearchParams(window.location.hash.substring(1));
  const state = {
    queryArgs,
    hashArgs,
    github: {},
    editor: { content: '' },
  };
  window.state = state;

  if (localStorage.GITHUB_OAUTH_TOKEN) {
    const tok = localStorage.GITHUB_OAUTH_TOKEN;
    state.github.oauth_token = tok;
  }
  state.github.client_id = process.env.GITHUB_OAUTH_CLIENT_ID;

  if (localStorage.editor_content) {
    const content = localStorage.editor_content;
    state.editor.content = content;
  }

  return state;
}

export function setHashArg(state, key, value) {
  if (!value) {
    state.hashArgs.delete(key);
  } else {
    state.hashArgs.set(key, value);
  }
}

export function getHashArg(state, key) {
  return state.hashArgs.get(key);
}

export function setQueryArg(state, key, value) {
  if (!value) {
    state.queryArgs.delete(key);
  } else {
    state.queryArgs.set(key, value);
  }
}

export function getQueryArg(state, key) {
  return state.queryArgs.get(key);
}

export function refreshURL(state) {
  const { protocol, host, pathname } = window.location;
  const { queryArgs, hashArgs } = state;

  const p = `${protocol}//`;
  const newurl = `${p}${host}${pathname}?${queryArgs.toString()}#${hashArgs.toString()}`;
  window.history.pushState({ path: newurl }, '', newurl);
}

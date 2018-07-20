export function create() {
  const state = {
    urlArgs: {},
    hashArgs: {},
    github: {},
    editor: { content: '' },
  };
  window.state = state;

  const queryArgs = new URLSearchParams(window.location.search);
  for (let p of queryArgs) {
    let k = p[0];
    state.urlArgs[k] = queryArgs.get(k);
  }

  const hashArgs = new URLSearchParams(window.location.hash.substring(1));
  for (let p of hashArgs) {
    let k = p[0];
    state.hashArgs[k] = hashArgs.get(k);
  }

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
  const { protocol, host, pathname, search, hash } = window.location;
  const queryString = new URLSearchParams(search).toString();
  const hashArgs = new URLSearchParams(hash.substring(1));
  hashArgs.set(key, value);
  const hashString = hashArgs.toString();

  const p = `${protocol}//`;
  const newurl = `${p}${host}${pathname}?${queryString}#${hashString}`;
  window.history.pushState({ path: newurl }, '', newurl);
}

export function create(url) {
  const searchParams = new URLSearchParams(url);
  const state = {
    urlArgs: {},
    github: {},
    editor: { content: '' },
  };
  window.state = state;
  for (let p of searchParams) {
    let k = p[0];
    state.urlArgs[k] = searchParams.get(k);
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

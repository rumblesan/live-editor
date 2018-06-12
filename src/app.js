import 'codemirror/lib/codemirror.css';

import { parser, interpret } from '@rumblesan/livecodelang';

import './index.html';
import './images/favicon.ico';
import './style/style.css';
import './style/cssterm.css';

import * as AppState from 'app/state';
import * as Github from 'app/github';
import * as Terminal from 'app/terminal';
import * as Editor from 'app/editor';

const state = AppState.create(window.location.search);

const editor = Editor.create(state, parser, interpret);

Github.auth(state);

if (state.urlArgs.gistid) {
  Terminal.addLine(`Loading gist ${state.urlArgs.gistid}`, 'heading');
  Github.loadGist(state, state.urlArgs.gistid, 'test.txt')
    .then(file => {
      const { content } = file;
      state.editor.content = content;
      localStorage.setItem('editor_content', content);
      editor.setValue(content);
    })
    .catch(err => Terminal.addLine(err, 'err'));
}

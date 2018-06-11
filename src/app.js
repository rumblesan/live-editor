import 'codemirror/lib/codemirror.css';
import CodeMirror from 'codemirror/lib/codemirror';

import { parser, interpret } from '@rumblesan/livecodelang';

import './index.html';
import './images/favicon.ico';
import './style/style.css';
import './style/cssterm.css';

import * as AppState from './app/state';
import * as Github from './app/github';
import * as Terminal from './app/terminal';

const state = AppState.create(window.location.search);

const editor = CodeMirror(document.getElementById('code'), {
  value: state.editor.content,
  lineNumbers: true,
  lineWrapping: true,
  extraKeys: {
    'Ctrl-Enter': function(instance) {
      const code = instance.getValue();
      const ast = parser.parse(code);
      const output = interpret(ast, {});
      let lineType = 'msg';
      if (output.exitCode) {
        lineType = 'err';
      }
      Terminal.addLine(output.value, lineType);
    },
    'Ctrl-G': function(instance) {
      Terminal.addLine('Creating Gist', 'heading');
      const code = instance.getValue();
      Github.saveGist(state, 'test.txt', code)
        .then(gist => {
          Terminal.addLine(gist.id);
        })
        .catch(err => {
          Terminal.addLine(err, 'err');
        });
    },
    'Ctrl-S': function(instance) {
      Terminal.addLine('Saving', 'heading');
      const code = instance.getValue();
      state.editor.content = code;
      localStorage.setItem('editor_content', code);
    },
  },
});

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

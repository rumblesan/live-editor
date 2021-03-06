import 'codemirror/lib/codemirror.css';

import LiveLang from '@rumblesan/livecodelang';

import './index.html';
import './images/favicon.ico';
import './style/style.css';
import './style/cssterm.css';

import * as AppState from 'app/state';
import * as Github from 'app/github';
import * as Terminal from 'app/terminal';
import * as Editor from 'app/editor';
import * as Canvas from 'app/canvas';
import * as SimpleDraw from 'app/simpledraw';
import * as Scheduler from 'app/scheduler';
import * as Scope from 'app/scope';

import { config, constants } from 'app/config';

const state = AppState.create();

Github.auth(state);

const canvas = Canvas.create(document.getElementById('background'));

const drawLib = SimpleDraw.create(canvas);

const scheduler = Scheduler.create();
Scheduler.start(scheduler);

const scope = Scope.create();

Scope.add(scope, 'white');
Scope.add(scope, 'black');
Scope.add(scope, 'red');
Scope.add(scope, 'orange');
Scope.add(scope, 'yellow');
Scope.add(scope, 'green');
Scope.add(scope, 'blue');
Scope.add(scope, 'indigo');
Scope.add(scope, 'vain');

Scope.builtin(scope, 'clear', () => SimpleDraw.clear(drawLib));
Scope.builtin(scope, 'line', (x1, y1, x2, y2, colour) => {
  SimpleDraw.drawLine(drawLib, x1, y1, x2, y2, colour);
});
Scope.builtin(scope, 'rect', (x1, y1, x2, y2, colour) => {
  SimpleDraw.drawRect(drawLib, x1, y1, x2, y2, colour);
});
Scope.builtin(scope, 'nextFrame', lambda => {
  Scheduler.nextFrame(scheduler, lambda.func);
});
Scope.builtin(scope, 'animate', lambda => {
  Scheduler.animate(scheduler, lambda.func);
});
Scope.builtin(scope, 'clearAnimation', () => {
  Scheduler.clearAnimation(scheduler);
});

Scope.builtin(scope, 'random', Math.random);

Scope.builtin(scope, 'print', Terminal.addLine);

const evaluate = code => {
  Terminal.addLine('evaluating everything');
  const ast = LiveLang.language.parser.parse(code);
  const output = LiveLang.stepInterpret(ast, scope);
  let lineType = 'msg';
  if (output.exitCode) {
    lineType = 'err';
  }
  Terminal.addLine(output.value, lineType);
};

const saveGist = code => {
  Terminal.addLine('Creating Gist', 'heading');
  Github.saveGist(state, config.gistCodeFilename, code)
    .then(gist => {
      Terminal.addLine(`Gist created with id ${gist.id}`);
      AppState.setHashArg(state, constants.GistID, gist.id);
      AppState.setHashArg(state, constants.EncodedProgram);
      AppState.refreshURL(state);
    })
    .catch(err => {
      Terminal.addLine(err, 'err');
    });
};

const saveLocal = code => {
  Terminal.addLine('Saving', 'heading');
  state.editor.content = code;
  localStorage.setItem(constants.EditorContent, code);
};

const encodeURL = code => {
  Terminal.addLine('Encoding to URL', 'heading');
  const base64 = btoa(encodeURIComponent(code));
  AppState.setHashArg(state, constants.EncodedProgram, base64);
  AppState.setHashArg(state, constants.GistID);
  AppState.refreshURL(state);
};

const editorFuncs = {
  evaluate,
  saveGist,
  saveLocal,
  encodeURL,
};

const editor = Editor.create(
  document.getElementById('code'),
  state.editor.content,
  editorFuncs
);

if (AppState.getHashArg(state, constants.GistID)) {
  const gistID = AppState.getHashArg(state, constants.GistID);
  Terminal.addLine(`Loading gist ${gistID}`, 'heading');
  Github.loadGist(state, gistID, config.gistCodeFilename)
    .then(file => {
      const { content } = file;
      state.editor.content = content;
      localStorage.setItem(constants.EditorContent, content);
      editor.setValue(content);
    })
    .catch(err => Terminal.addLine(err, 'err'));
} else if (AppState.getHashArg(state, constants.EncodedProgram)) {
  const encodedProg = AppState.getHashArg(state, constants.EncodedProgram);
  Terminal.addLine('Loading encoded program');
  const program = decodeURIComponent(atob(encodedProg));
  state.editor.content = program;
  localStorage.setItem(constants.EditorContent, program);
  editor.setValue(program);
}

import 'codemirror/lib/codemirror.css';

import { parser, stepInterpret } from '@rumblesan/livecodelang';

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

const state = AppState.create(window.location.search);

const canvas = Canvas.create(document.getElementById('background'));

const drawLib = SimpleDraw.create(canvas);

const scheduler = Scheduler.create();
Scheduler.start(scheduler);

const scope = {
  white: 'white',
  black: 'black',
  red: 'red',
  orange: 'orange',
  yellow: 'yellow',
  green: 'green',
  blue: 'blue',
  indigo: 'indigo',
  violet: 'violet',
  clear: {
    type: 'builtin',
    func: () => {
      SimpleDraw.clear(drawLib);
    },
  },
  line: {
    type: 'builtin',
    func: (x1, y1, x2, y2, colour) => {
      SimpleDraw.drawLine(drawLib, x1, y1, x2, y2, colour);
    },
  },
  rect: {
    type: 'builtin',
    func: (x1, y1, x2, y2, colour) => {
      SimpleDraw.drawRect(drawLib, x1, y1, x2, y2, colour);
    },
  },
  nextFrame: {
    type: 'builtin',
    func: lambda => {
      Scheduler.nextFrame(scheduler, lambda.func);
    },
  },
  animate: {
    type: 'builtin',
    func: lambda => {
      Scheduler.animate(scheduler, lambda.func);
    },
  },
  clearAnimation: {
    type: 'builtin',
    func: () => {
      Scheduler.clearAnimation(scheduler);
    },
  },
  random: {
    type: 'builtin',
    func: Math.random,
  },
  print: {
    type: 'builtin',
    func: Terminal.addLine,
  },
};

const evaluate = code => {
  Terminal.addLine('evaluating everything');
  const ast = parser.parse(code);
  const output = stepInterpret(ast, scope);
  let lineType = 'msg';
  if (output.exitCode) {
    lineType = 'err';
  }
  Terminal.addLine(output.value, lineType);
};

const saveGist = code => {
  Terminal.addLine('Creating Gist', 'heading');
  Github.saveGist(state, 'test.txt', code)
    .then(gist => {
      Terminal.addLine(gist.id);
    })
    .catch(err => {
      Terminal.addLine(err, 'err');
    });
};

const saveLocal = code => {
  Terminal.addLine('Saving', 'heading');
  state.editor.content = code;
  localStorage.setItem('editor_content', code);
};

const editorFuncs = {
  evaluate,
  saveGist,
  saveLocal,
};

const editor = Editor.create(
  document.getElementById('code'),
  state.editor.content,
  editorFuncs
);

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

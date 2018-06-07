import 'codemirror/lib/codemirror.css';
import CodeMirror from 'codemirror/lib/codemirror';

import { parser, interpret } from '@rumblesan/livecodelang';

import './index.html';
import './images/favicon.ico';
import './style/style.css';
import './style/cssterm.css';

CodeMirror(document.getElementById('code'), {
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
      addTermLine(lineType, `${output.value}`);
    },
  },
});

const addTermLine = (type, line) => {
  const el = document.getElementById('term-lines');
  const current = el.innerHTML;
  el.innerHTML = current + `<${type}># </${type}> ${line}<br />`;
};

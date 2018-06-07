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
      const value = interpret(ast, {});
      console.log(value);
    },
  },
});

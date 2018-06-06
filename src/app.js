import 'codemirror/lib/codemirror.css';
import CodeMirror from 'codemirror/lib/codemirror';

import './index.html';
import './images/favicon.ico';
import './style/style.css';
import './style/cssterm.css';

CodeMirror(document.getElementById('code'), {
  lineNumbers: true,
  lineWrapping: true,
});

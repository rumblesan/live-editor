import 'codemirror/lib/codemirror.css';
import CodeMirror from 'codemirror/lib/codemirror';

import GitHub from 'github-api';

import { parser, interpret } from '@rumblesan/livecodelang';

import './index.html';
import './images/favicon.ico';
import './style/style.css';
import './style/cssterm.css';

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

let OAUTH_TOKEN = '';
const oauthcode = getParameterByName('code');
if (oauthcode) {
  const base = '/.netlify/functions/ghauth';
  const url = `${base}?oauthcode=${oauthcode};
  fetch(url, {
    method: 'POST',
    referrer: 'no-referrer',
  }).then(response => {
    console.log(response);
  });
}

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
    'Ctrl-S': function(instance) {
      const code = instance.getValue();
      const gh = new GitHub({
        username: 'rumblesan',
        token: OAUTH_TOKEN,
      });
      let gist = gh.getGist(); // not a gist yet
      addTermLine('msg', 'saving');
      gist
        .create({
          public: true,
          description: '',
          files: {
            'file1.txt': {
              content: code,
            },
          },
        })
        .then(function({ data }) {
          console.log('data', data);
          // Promises!
          let createdGist = data;
          console.log('created gist', createdGist);
          return gist.read();
        })
        .then(function({ data }) {
          let retrievedGist = data;
          // do interesting things
          console.log(retrievedGist);
        });
    },
  },
});

const addTermLine = (type, line) => {
  const el = document.getElementById('term-lines');
  const current = el.innerHTML;
  el.innerHTML = current + `<${type}># </${type}> ${line}<br />`;
};

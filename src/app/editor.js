import CodeMirror from 'codemirror/lib/codemirror';
import * as Github from 'app/github';
import * as Terminal from 'app/terminal';

export const create = (state, parser, interpret) =>
  CodeMirror(document.getElementById('code'), {
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

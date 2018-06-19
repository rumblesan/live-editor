import CodeMirror from 'codemirror/lib/codemirror';

export const create = (element, content, funcs) =>
  CodeMirror(element, {
    value: content,
    lineNumbers: true,
    lineWrapping: true,
    extraKeys: {
      'Ctrl-Enter': function(instance) {
        const selected = instance.getSelection();
        if (selected !== '') {
          funcs.evaluate(selected);
        } else {
          const code = instance.getValue();
          funcs.evaluate(code);
        }
      },
      'Ctrl-G': function(instance) {
        const code = instance.getValue();
        funcs.saveGist(code);
      },
      'Ctrl-S': function(instance) {
        const code = instance.getValue();
        funcs.saveLocal(code);
      },
    },
  });

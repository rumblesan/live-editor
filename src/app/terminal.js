export const addLine = (line, type = 'msg') => {
  const el = document.getElementById('term-lines');
  const current = el.innerHTML;
  el.innerHTML = current + '<' + type + '># </' + type + '> ' + line + '<br />';
};

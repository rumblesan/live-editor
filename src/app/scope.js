export const create = () => ({});

export const add = (scope, name, value) => {
  scope[name] = value ? value : name;
  return scope;
};

export const builtin = (scope, name, func) => {
  scope[name] = {
    type: 'builtin',
    func,
  };
  return scope;
};

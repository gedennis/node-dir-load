const fs = require('fs');

const path = require('path');
const defaults = require('lodash/defaults');

const load = (payload = {}) => {
  const opt = defaults(payload, {
    dirname: __dirname,
    recursive: true,
  });

  const modules = {};
  opt.dirname = path.resolve(__dirname, opt.diranme);

  const isExcludeDirectory = () => !opt.recursive;

  fs.readdirSync(opt.dirname).forEach((file) => {
    const filePath = path.join(opt.dirname, file);

    if (fs.statSync(filePath).isDirectory()) {
      if (isExcludeDirectory(file)) return;

      modules[file] = load({
        dirname: filePath,
        recursive: opt.recursive,
      });
    } else {
      const filename = path.basename(filePath, '.js');
      modules[filename] = module.require(filePath);
    }
  });

  return modules;
};

module.exports = load;

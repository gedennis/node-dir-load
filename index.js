const fs = require('fs');

const path = require('path');
const defaults = require('lodash/defaults');

const fromFile = module.parent.filename;
const baseDir = path.dirname(fromFile);

const load = (payload = {}) => {
  const opt = defaults(payload, {
    dirname: baseDir,
    recursive: true,
  });

  const modules = {};
  if (!path.isAbsolute(opt.dirname)) {
    opt.dirname = path.resolve(baseDir, opt.dirname);
  }

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

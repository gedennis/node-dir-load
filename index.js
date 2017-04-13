const fs = require('fs');

const path = require('path');
const defaults = require('lodash/defaults');
const isRegExp = require('lodash/isRegExp');

const fromFile = module.parent.filename;
const baseDir = path.dirname(fromFile);

const load = (payload = {}) => {
  const opt = defaults(payload, {
    dirname: baseDir,
    excludeDirs: /^\./,
    recursive: true,
  });

  if (opt.excludeDirs && !isRegExp(opt.excludeDirs)) {
    throw new Error('The option excludeDirs should be an RegExp object.');
  }

  const modules = {};
  if (!path.isAbsolute(opt.dirname)) {
    opt.dirname = path.resolve(baseDir, opt.dirname);
  }

  const isExcludeDirectory = file =>
    (!opt.recursive || (opt.excludeDirs && opt.excludeDirs.test(file)));

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

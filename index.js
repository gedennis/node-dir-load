const fs = require('fs');

const path = require('path');
const defaults = require('lodash/defaults');
const isRegExp = require('lodash/isRegExp');

const fromFile = module.parent.filename;
const baseDir = path.dirname(fromFile);

const allowExts = ['.js', '.json'];

const load = (payload = {}) => {
  const opt = defaults(payload, {
    dirname: baseDir,
    excludeDirs: /^\./,
    filter: /^([^.]+).js(on)?$/,
    recursive: true,
  });

  if (opt.excludeDirs
    && !isRegExp(opt.excludeDirs)
    && !isRegExp(opt.filter)) {
    throw new Error('The option excludeDirs should be an RegExp object.');
  }

  const modules = {};
  if (!path.isAbsolute(opt.dirname)) {
    opt.dirname = path.resolve(baseDir, opt.dirname);
  }

  const isExcludeDirectory = file =>
    (!opt.recursive || (opt.excludeDirs && opt.excludeDirs.test(file)));

  const isExcludeFile = (file, ext) =>
    !opt.filter.test(file) || !allowExts.includes(ext);

  fs.readdirSync(opt.dirname).forEach((file) => {
    const filePath = path.join(opt.dirname, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (isExcludeDirectory(file)) return;

      modules[file] = load({
        dirname: filePath,
        excludeDirs: opt.excludeDirs,
        filter: opt.filter,
        recursive: opt.recursive,
      });
    } else {
      const ext = path.extname(filePath);
      if (isExcludeFile(file, ext)) return;
      const filename = path.basename(filePath, ext);
      modules[filename] = module.require(filePath);
    }
  });

  return modules;
};

module.exports = load;

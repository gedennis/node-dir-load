const fs = require('fs');
const path = require('path');
const defaults = require('lodash/defaults');
const isRegExp = require('lodash/isRegExp');

// default directory to load is current dir
const BASE_DIR = path.dirname(module.parent.filename);
const allowExts = ['.js', '.json'];

const isDir = dir => fs.statSync(dir).isDirectory();
const doErr = (msg) => { throw new Error(msg); };

const loadDir = (payload = {}) => {
  const opt = defaults(payload, {
    dirname: BASE_DIR,
    excludeDirs: /^\./,
    recursive: false,
    filter: /^([^.]+).js(on)?$/,
  });

  if (!path.isAbsolute(opt.dirname)) {
    opt.dirname = path.resolve(BASE_DIR, opt.dirname);
  }
  !isDir(opt.dirname) && doErr('dirname is not a directory.');

  if (opt.excludeDirs
    && !isRegExp(opt.excludeDirs)
    && !isRegExp(opt.filter)) {
    throw new Error('The option excludeDirs should be an RegExp object.');
  }

  const isExcludeDir = file =>
    (!opt.recursive || (opt.excludeDirs && opt.excludeDirs.test(file)));

  const isExcludeFile = (file, ext) =>
    !opt.filter.test(file) || !allowExts.includes(ext);


  const modules = {};

  const doLoad = (file) => {
    const filePath = path.join(opt.dirname, file);

    const loadSub = () => {
      if (isExcludeDir(file)) return;
      const optSub = defaults(opt, { dirname: filePath });

      Object.defineProperty(modules, file, {
        get: () => loadDir(optSub)
      });
      return true;
    };

    // load sub directory
    if (isDir(filePath)) loadSub();

    // load file
    const ext = path.extname(filePath);
    if (isExcludeFile(file, ext)) return;
    const filename = path.basename(filePath, ext);

    Object.defineProperty(modules, filename, {
      get: () => module.require(filePath)
    });
  };

  fs.readdirSync(opt.dirname).forEach(doLoad);

  return modules;
};

module.exports = loadDir;

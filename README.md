# node-dir-load
[![npm](https://img.shields.io/npm/dt/node-dir-load.svg)]() [![Greenkeeper badge](https://badges.greenkeeper.io/gedennis/node-dir-load.svg)](https://greenkeeper.io/)  
A tool to load all files in a directory.

# Requirements
Node version is above 4.00, which supports ES6.
> For now, just support .js and .json files. Others extension files WILL BE IGNORED!!!

# Features
- load all files in the folder
- filter the files to load
- exclude the subdirectory to load
- lazy require to avoid some error of circular dependency
- relative directory to load

# Get Started
Install with npm:
```shell
npm install node-dir-load
```
Load files from a specific directory into an object.
```javascript
const load = require('node-dir-load');

const models = load({
  dirname: '../model'
});
console.log(models);
/*
=> 
{ 
  blog: { blog: { getBlogList: [Function] } },
  comment: { getCommentList: [Function] },
}
*/
```
# options
- dirname
- recursive
- excludeDirs
- filter
## dirname
The src directory to load files.Both absolute or relative path are supported! 
Default is current directory.
## recursive
For true, to load subdirectories. Default is true.
## excludeDirs
A regular expression to exclude directories to load. It only works when recursive is true.
Default exclude hidden files, which begins with '.' .
```
const models = load({
  dirname: '../model',
  excludeDirs: /^\.(git|svn)$/,
});
```
## filter
A regular expression to filter files to load.Default is .js and .json files.
```
// just load files begin with user.
const models = load({
  dirname: '../model',
  filter: /^user.+\.js$/,
});
```
## Inspire
Inspire much from [node-require-all](https://github.com/felixge/node-require-all).


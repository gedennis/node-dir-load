# node-dir-load
A tool to load all files in a directory.

# Requirements
Node version is above 4.00, which supports ES6.
> For now, just support .js and .json files. Others extension files WILL BE IGNORED!!!

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


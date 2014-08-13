# argv-split [![NPM version](https://badge.fury.io/js/argv-split.svg)](http://badge.fury.io/js/argv-split) [![Build Status](https://travis-ci.org/kaelzhang/node-argv-split.svg?branch=master)](https://travis-ci.org/kaelzhang/node-argv-split) [![Dependency Status](https://gemnasium.com/kaelzhang/node-argv-split.svg)](https://gemnasium.com/kaelzhang/node-argv-split)

Split argv(argument vector) and handle special cases, such as quoted values.

## Why?

```js
'--abc "a b c"'.split(' ');
// -> ['--abc', '"a', 'b', 'c"'] -> Oooooooooops!
```

## Install

```sh
$ npm install argv-split --save
```

## The usage is quite simple: `split(argv)`

```js
var split = require('argv-split');

split('--abc "a b c"');
// ['--abc', 'a b c']
```

## License

MIT

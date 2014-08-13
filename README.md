# argv-split [![NPM version](https://badge.fury.io/js/argv-split.svg)](http://badge.fury.io/js/argv-split) [![Build Status](https://travis-ci.org/kaelzhang/node-argv-split.svg?branch=master)](https://travis-ci.org/kaelzhang/node-argv-split) [![Dependency Status](https://gemnasium.com/kaelzhang/node-argv-split.svg)](https://gemnasium.com/kaelzhang/node-argv-split)

Split argv(argument vector) and handle special cases, such as quoted values.

## Why?

```js
'--abc "a b c"'.split(' ');
// ['--abc', '"a', 'b', 'c"'] -> Oooooooooops!
```

## Install

```sh
$ npm install argv-split --save
```

## The usage is quite simple: `split(argv)`

```js
var split = require('argv-split');

split('--abc "a b c"');
// ['--abc', 'a b c'], Oh yeah !!!!
```

### split(string)

Splits a string, and balance quoted parts.

```js
split('--abc "a \'b\' c"'); // ['--abc', "a 'b' c"]
split('--abc "a b c'); // ['--abc', '"a', 'b', 'c']
```

### split.balance(array)

Balances an array and join incorrect splited parts.

```js
split.balance(['--abc', '"a', 'b"']); // ['--abc', 'a b']
```

### split.join(array, [quote='])

```js
split.join(['--abc', 'a b']); // '--abc "a b"'
```

## License

MIT

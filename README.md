[![Build Status](https://travis-ci.org/kaelzhang/node-argv-split.svg?branch=master)](https://travis-ci.org/kaelzhang/node-argv-split)
[![Dependency Status](https://gemnasium.com/kaelzhang/node-argv-split.svg)](https://gemnasium.com/kaelzhang/node-argv-split)

# argv-split

Split argv(argument vector) and handle special cases, such as quoted or escaped values.

## Why?

```js
const split = require('split')

let mkdir = 'mkdir "foo bar"'
mkdir.split(' ') // ['mkdir', '"foo', 'bar"'] -> Oops!
split(mkdir)  // ['mkdir', 'foo bar']      -> Oh yeah!

let mkdir2 = 'mkdir foo\\ bar'.split(' ')
mkdir2.split(' ') // ['mkdir', 'foo\\', 'bar']  -> Oops!
split(mkdir2)  // ['mkdir', 'foo bar']       -> Oh yeah!
```

## Install

```sh
$ npm install argv-split --save
```

### split(string)

Splits a string, and balance quoted parts. The usage is quite simple, see examples above.

Returns `Array`

### split.balance(array)

Balances an array and join incorrect splited parts.

- **array** `Array`

Returns `Array` the balanced array.

```js
split.balance(['--abc', '"a', 'b"']) // ['--abc', 'a b']
```

### split.join(array, [quote=])

- **array** `Array`
- **quote** `String=`(optional)

```js
split.join(['mkdir', 'foo bar'])      // 'mkdir foo\ bar'
split.join(['mkdir', 'foo bar'], '"') // 'mkdir "foo bar"'
split.join(['mkdir', 'foo bar'], "'") // "mkdir 'foo bar'"
```

## `argv-split` handles several special cases

```js
split('mkdir "abc"')         // ['mkdir', 'abc']
split('mkdir \\"abc\\"')     // ['mkdir', '"abc"']
split("mkdir \\'abc\\'")     // ['mkdir', "'abc'"]
split('mkdir a\\" bc\\"d e') // ['mkdir', 'a bcd', 'e']

let result = split('mkdir "a b')
// Actually, it is not likely to happen. If encoutered, shell will switch to an iteractive mode.

result
// ['mkdir', '"a', 'b']

result.quote
// If there is an unclosed quote mark, result.quote will be `true`
```

## License

MIT

[![Build Status](https://github.com/kaelzhang/node-argv-split/actions/workflows/nodejs.yml/badge.svg)](https://github.com/kaelzhang/node-argv-split/actions/workflows/nodejs.yml)

# argv-split

Split argv(argument vector) and handle special cases, such as quoted or escaped values.

## Why?

```js
const split = require('split')

const mkdir = 'mkdir "foo bar"'
mkdir.split(' ')    // ['mkdir', '"foo', 'bar"']  -> Oops!
split(mkdir)        // ['mkdir', 'foo bar']       -> Oh yeah!

const mkdir2 = 'mkdir foo\\ bar'.split(' ')
mkdir2.split(' ')   // ['mkdir', 'foo\\', 'bar']  -> Oops!
split(mkdir2)       // ['mkdir', 'foo bar']       -> Oh yeah!
```

## `argv-split` handles all special cases with complete unit tests.

```sh
# shell command:        javascript array:
foo a\ b                # ['foo', 'a b']
foo \'                  # ['foo', '\\\'']
foo \"                  # ['foo', '\\"']
foo "a b"               # ['foo', 'a b']
foo "a\ b"              # ['foo', 'a\\ b']
foo '\'                 # ['foo', '\\']
foo --abc="a b"         # ['foo', '--abc=a b']
foo --abc=a\ b          # ['foo', '--abc=a b']

# argv-split also handles carriage returns
foo \
    --abc=a\ b          # ['foo', '--abc=a b']

# etc
```

```js
split('foo \\\n    --abc=a\\ b')    // ['foo', '--abc=a b']
```

## Error Codes

### `UNMATCHED_SINGLE`

If a command missed the closing single quote, the error will throw:

Shell command:

```sh
foo --abc 'abc
```

```js
try {
  split('foo --abc \'abc')
} catch (e) {
  console.log(e.code)   // 'UNMATCHED_SINGLE'
}
```

### `UNMATCHED_DOUBLE`

If a command missed the closing double quote, the error will throw:

```sh
foo --abc "abc
```

### `ESCAPED_EOF`

If a command unexpectedly ends with a `\`, the error will throw:

```sh
foo --abc a\# if there is nothing after \, the error will throw
foo --abc a\ # if there is a whitespace after, then -> ['foo', '--abc', 'a ']
```

### `NON_STRING`

If the argument passed to `split` is not a string, the error will throw

```js
split(undefined)
```

## Install

```sh
$ npm i argv-split
```

# Methods

## split(string) -> Array<string>

Splits a string, and balance quoted parts. The usage is quite simple, see examples above.

Returns `Array<string>`


## split.join(args, options?) -> string

Join the given array of argument vectors into a valid argument string

New in `3.1.0`

- **args** `Array<string>` arguments to be joined
- **options?** `Object=`
  - **quote** `string="` should we use single quote or double quote when a certain argument needs to be quoted. Defaults to `"`

```js
'command ' + join(['foo "bar', "'baz"])

// command "foo \"bar" "'baz"
```

### Handle Line Feed

There is a special value of `split.LF` which could help us to create valid commands with line feeds:

```js
'kubectl' + join(['apply', '--prune', '-f', 'manifest.yaml', split.LF, '-l', 'app=nginx'])

// kubectl apply --prune -f manifest.yaml \
// -l app=nginx
```

## License

MIT

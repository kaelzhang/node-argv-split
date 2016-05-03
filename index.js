'use strict'

module.exports = split
split.join = join
split.balance = balance_args


function split (string) {
  var splited = string.split(' ')
  return balance_args(splited)
}


var DOUBLE_QUOTE_START = /^".*[^"]$/
var DOUBLE_QUOTE_END = /"$/
var SINGLE_QUOTE_START = /^'.*[^']$/
var SINGLE_QUOTE_END = /'$/

// empty argument is allowed
// git commit -a -m "" -> empty value is allow by bash, but git commit will fail
var QUOTE_PAIR = /^(['"])(.*)\1$/

function unescape (str) {
  var match = str.match(QUOTE_PAIR)
  str = match
    ? match[2]
    : str

  return str.replace(/\\'/g, "'")
            .replace(/\\"/g, '"')
            .replace(/\\\s/g, ' ')
}


// push the unescaped `item` into `host`
function push (host, item) {
  host.push(unescape(item))
  return host
}


// conat `host` with `array`
function concat (host, array) {
  array.forEach(function (item){
    push(host, item)
  })

  return host
}


// first join the `group`, then push into `host`
function push_group (host, array) {
  var item = array.join(' ')
  // clean
  array.length = 0
  return push(host, item)
}


// #4,
// Deal with quotes
function balance_args (slices) {
  var double_quoted
  var single_quoted
  var stack = []
  var max = slices.length - 1
  return slices.reduce(function(prev, current, index) {
    if (double_quoted) {
      stack.push(current)
      if (DOUBLE_QUOTE_END.test(current)) {
        double_quoted = false

        return push_group(prev, stack)

      // -a "a b
      // -> ['-a', '"a', 'b']
      // balance quotes teminated
      }

      if (index === max) {
        return concat(prev, stack)
      }

      return prev
    }

    if (single_quoted) {
      stack.push(current)
      if (SINGLE_QUOTE_END.test(current)) {
        single_quoted = false

        return push_group(prev, stack)

      }

      if (index === max) {
        return concat(prev, stack)
      }

      return prev
    }

    // if not quoted, and current is empty, just skip
    if (current) {
      if (DOUBLE_QUOTE_START.test(current)) {
        stack.push(current)
        double_quoted = true
      }

      if (SINGLE_QUOTE_START.test(current)) {
        stack.push(current)
        single_quoted = true

      }

      push(prev, current)
    }

    return prev
  }, [])
}


function join (args, quote) {
  quote = quote || "'"
  return args.map(function (arg) {
    if (!arg) {
      return
    }

    return /\s+/.test(arg)
      // a b c -> 'a b c'
      // a 'b' -> 'a \'b\''
      ? quote + arg.replace("'", "\\'") + quote
      : arg

  }).join(' ')
}

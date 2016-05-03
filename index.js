'use strict'

module.exports = split
split.join = join
split.balance = balance_args


var MATCH_TOKEN = /["'\s]/g
var STR_BACKSLASH = '\\'
var STR_WHITESPACE = ' '
var STR_SINGLE_QUOTE = "'"
var STR_DOUBLE_QUOTE = '"'

function split (str) {
  var prev_index = 0
  var m
  var match
  var index
  var double_quoted
  var single_quoted
  var item = ''
  var splitted = []

  while (m = MATCH_TOKEN.exec(str)) {
    match = m[0]
    index = m.index

    switch (match) {
      case STR_DOUBLE_QUOTE:
        if (single_quoted) {
          break
        }

        if (double_quoted) {

        }
    }
  }
}


var DOUBLE_QUOTE_START = /^".*[^"]$/
var DOUBLE_QUOTE_END = /"$/
var SINGLE_QUOTE_START = /^'.*[^']$/
var SINGLE_QUOTE_END = /'$/

// empty argument is allowed
// git commit -a -m "" -> empty value is allow by bash, but git commit will fail
var QUOTE_PAIR = /^(['"])(.*)\1$/

function unescape (str) {
  return str.replace(/\\'/g, "'")
            .replace(/\\"/g, '"')
            .replace(/\\\s/g, WHITE_SPACE)
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
  var item = array.join(WHITE_SPACE)
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
      }

      // -a "a b
      // -> ['-a', '"a', 'b']
      // balance quotes teminated unexpectedly
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
    if (DOUBLE_QUOTE_START.test(current)) {
      stack.push(current)
      double_quoted = true
      return prev
    }

    if (SINGLE_QUOTE_START.test(current)) {
      stack.push(current)
      single_quoted = true
      return prev
    }

    return push(prev, current)
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

  }).join(WHITE_SPACE)
}

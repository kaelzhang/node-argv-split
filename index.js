'use strict';

module.exports = split;
split.join = join;
split.balance = balance_args;


function split (string) {
  var splited = string.split(' ');
  return balance_args(splited);
}


var DOUBLE_QUOTE_START = /^".*[^"]$/;
var DOUBLE_QUOTE_END = /"$/;
var SINGLE_QUOTE_START = /^'.*[^']$/;
var SINGLE_QUOTE_END = /'$/;

// empty argument is allowed
// git commit -a -m "" -> empty value is allow by bash, but git commit will fail
var QUOTE_PAIR = /^(['"])(.*)\1$/;
function trim (str) {
  var match = str.match(QUOTE_PAIR);
  return match
    ? match[2]
    : str;
}

// #4,
// Deal with quotes
function balance_args (slices) {
  var double_quoted;
  var single_quoted;
  var stack = [];
  var max = slices.length - 1;
  return slices.reduce(function(prev, current, index) {
    if (double_quoted) {
      stack.push(current);
      if (DOUBLE_QUOTE_END.test(current)) {
        double_quoted = false;

        prev.push( trim(stack.join(' ')) );
        stack.length = 0;

      // -a "a b
      // -> ['-a', '"a', 'b']
      // balance quotes teminated
      } else if (index === max) {
        prev = prev.concat(stack);
        stack.length = 0;
      }

    } else if (single_quoted) {
      stack.push(current);
      if (SINGLE_QUOTE_END.test(current)) {
        single_quoted = false;

        prev.push( trim(stack.join(' ')) );
        stack.length = 0;

      } else if (index === max) {
        prev = prev.concat(stack);
        stack.length = 0;
      }

    // if not quoted, and current is empty, just skip
    } else if (current) {
      if (DOUBLE_QUOTE_START.test(current)) {
        stack.push(current);
        double_quoted = true;

      } else if (SINGLE_QUOTE_START.test(current)) {
        stack.push( current );
        single_quoted = true;

      } else {
        prev.push( trim(current) );
      }
    }

    return prev;
  }, []);
};


function join (args, quote) {
  quote = quote || "'";
  return args.map(function (arg) {
    if (!arg) {
      return;
    }

    return /\s+/.test(arg)
      // a b c -> 'a b c'
      // a 'b' -> 'a \'b\''
      ? quote + arg.replace("'", "\\'") + quote
      : arg;

  }).join(' ');
};

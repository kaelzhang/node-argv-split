'use strict'

const test = require('ava')
const split = require('..')

const CASES = [
{
  d: 'normal',
  a: 'a b c',
  e: ['a', 'b', 'c']
},
{
  d: 'double-quoted',
  a: '"a b c"',
  e: ['a b c']
},
{
  d: 'double-quoted, and trailing normal',
  a: '"a b" c',
  e: ['a b', 'c']
},
{
  d: 'double-quoted, and heading normal',
  a: 'c "a b"',
  e: ['c', 'a b']
},
{
  d: 'single-quoted',
  a: "'a b c'",
  e: ['a b c']
},
{
  d: 'single-quoted, and trailing normal',
  a: "'a b' c",
  e: ['a b', 'c']
},
{
  d: 'single-quoted, and heading normal',
  a: "c 'a b'",
  e: ['c', 'a b']
},
{
  d: 'escaped whitespaces',
  a: 'a\\ b',
  e: ['a b']
},
{
  d: 'escaped whitespaces, and trailing normal',
  a: 'a\\ b c',
  e: ['a b', 'c']
},
{
  d: 'escaped whitespaces, and heading normal',
  a: 'c a\\ b',
  e: ['c', 'a b']
},
{
  d: 'non-starting single quote',
  a: "a' b'",
  e: ['a b']
},
{
  d: 'non-staring single quote with =',
  a: "--foo='bar baz'",
  e: ['--foo=bar baz']
},
{
  d: 'non-starting double quote',
  a: 'a" b"',
  e: ['a b']
},
{
  d: 'non-starting double quote with =',
  a: '--foo="bar baz"',
  e: ['--foo=bar baz']
},
{
  d: 'double-quoted escaped double quote',
  a: '"bar\\" baz"',
  e: ['bar" baz']
},
{
  d: 'single-quoted escaped double quote, should not over unescaped',
  a: '\'bar\\" baz\'',
  e: ['bar\\" baz']
},
{
  d: 'carriage return',
  a: `--foo=bar \\
  --baz=qux`,
  e: ['--foo=bar', '--baz=qux']
},
{
  d: 'unnecessary escape',
  a: 'foo \\bar',
  e: ['foo', '\\bar']
},
{
  d: 'end with whitespace',
  a: 'foo ',
  e: ['foo']
},
{
  d: 'end with carriage return',
  a: 'foo \n',
  e: ['foo']
},
{
  d: 'single-quoted escaped single quote, should throw',
  a: "'bar\' baz'",
  throws: 'unmatched single quote'
},
{
  d: 'double-quoted escaped single quote, should throw',
  a: '"bar\" baz"',
  throws: 'unmatched double quote'
},
{
  d: 'unexpected escaped eof, should throw',
  a: 'bar \\',
  throws: 'unexpected end with \\'
},
{
  d: 'not a string',
  a: 1,
  throws: '`str` must be a string. Received 1'
},
{
  d: 'join: invalid args',
  a: [[], {quote:'a'}],
  throws: '`options.quote` must be either \' or ". Received a',
  fn: split.join
},
{
  d: 'join: normal',
  a: [['a', 'b', 'c']],
  e: 'a b c',
  fn: split.join
},
{
  d: 'join: need quote, double-quoted',
  a: [['a b c']],
  e: '"a b c"',
  fn: split.join
},
{
  d: 'join: need quote, single-quoted',
  a: [['a b c'], {quote: "'"}],
  e: "'a b c'",
  fn: split.join
},
{
  d: 'join: need quote, double-quoted, and escaped',
  a: [
    [
      'a "b c',
      // 'a should be quoted
      "'a"
    ],
    {quote: '"'}
  ],
  e: '"a \\"b c" "\'a"',
  fn: split.join
},
{
  d: 'join: line feed',
  a: [['a', split.LF, 'b']],
  e: 'a \\\nb',
  fn: split.join
}
]

CASES.forEach(({d, a, e, throws, only, fn = split}) => {
  const t = only
    ? test.only
    : test

  t(d, t => {
    const args = Array.isArray(a)
      ? a
      : [a]

    if (throws) {
      t.throws(() => {
        fn(...args)
      }, {
        message: throws
      })
      return
    }

    t.deepEqual(fn(...args), e)
  })
})

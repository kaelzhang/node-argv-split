'use strict'

var expect = require('chai').expect
var split = require('../')
var run = require('run-mocha-cases')

var cases = [
{
  d: 'normal',
  a: 'a b c',
  e: ['a', 'b', 'c']
},
{
  d: 'double-quoted',
  a: '"a b c"',
  e: ['a b c'],
  only: true
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
}
]

run
.description('split')
.runner(function(args){
  return split(args)
})
.start(cases)




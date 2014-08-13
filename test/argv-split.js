'use strict';

var expect = require('chai').expect;
var split = require('../');

// #4
var command = 'command -a "a \'b\' c" -b \'a "b" c\' -c'
  + ' "a b" -d \'a   b\' -e "a" -f \'a\' -g "a b c';

var args = [
  'command',
  '-a', "a 'b' c", 
  '-b', 'a "b" c', 
  '-c', 'a b',
  '-d', "a   b",
  '-e', 'a',
  '-f', "a",
  '-g', '"a', 'b', 'c'
];

describe("split(string)", function(){
  it("quoted", function(){
    expect(split(command)).to.deep.equal(args);
  });

  it("normal", function(){
    var command = 'command -a b --abc false';
    expect(split(command)).to.deep.equal([
      'command',
      '-a',
      'b',
      '--abc',
      'false'
    ]);
  });
});

describe("split.balance()", function(){
  it("balance arguments", function(){
    var splited = command.split(' ');
    expect(split.balance(splited)).to.deep.equal(args);
  });
});

describe("split.join()", function(){
  it("join arguments", function(){
    var args = [
      '-a',
      'a b c'
    ];

    expect(split.join(args)).to.equal('-a \'a b c\'');
  });

  it("specified quote", function(){
    var args = [
      '-a',
      'a b c'
    ];

    expect(split.join(args, '"')).to.equal('-a "a b c"');
  });
});

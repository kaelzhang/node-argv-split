'use strict'

module.exports = split
split.join = join


// Flags                        Characters
//             0         1         2         3         4         5
// ------------------------------------------------------------------------
//             \         '         "         normal    space     \n
//   e,sq      n/a       n/a       n/a       n/a       n/a       n/a
// 0 ue,sq     a \       suq       a "       a +       a _       EOF
// 1 e,dq      a \,ue    a \',ue   a ",ue    a \+,ue   a \_,ue   ue
// 2 ue,dq     e         a '       duq       a +       a _       EOF
// 3 e,uq      a \,ue    a \',ue   a \",ue   a \+,ue   a _,ue    ue
// 4 ue,uq     e         sq        dq        a +       tp        EOF

const MATRIX = {
  // object is more readable than multi-dim array.
  0: [a,    suq,    a,      a,      a,      EOF],
  1: [eaue, aue,    eaue,   aue,    aue,    ue],
  2: [e,    a,      duq,    a,      a,      EOF],
  3: [eaue, aue,    aue,    aue,    eaue,   ue],
  4: [e,    sq,     dq,     a,      tp,     EOF]
}

// - a: add
// - e: turn on escape mode
// - ue: turn off escape mode
// - q: turn on quote mode
//   - sq: single quoted
//   - dq: double quoted
// - uq: turn off quote mode
// - tp: try to push if there is something in the stash
// - EOF: end of file(input)

let escaped = false           // 1
let single_quoted = false     // 2
let double_quoted = false     // 4
let ended = false

const FLAGS = {
  2: 0,
  5: 1,
  4: 2,
  1: 3,
  0: 4
}

function y () {
  let sum = 0

  if (escaped) {
    sum ++
  }

  if (single_quoted) {
    sum += 2
  }

  if (double_quoted) {
    sum += 4
  }

  return FLAGS[sum]
}

const BACK_SLASH = '\\'
const SINGLE_QUOTE = "'"
const DOUBLE_QUOTE = '"'
const WHITE_SPACE = ' '
const CARRIAGE_RETURN = '\n'

function x () {
  return c in CHARS
    ? CHARS[c]
    : CHARS.NORMAL
}

const CHARS = {
  [BACK_SLASH]: 0,
  [SINGLE_QUOTE]: 1,
  [DOUBLE_QUOTE]: 2,
  NORMAL: 3,
  [WHITE_SPACE]: 4,
  [CARRIAGE_RETURN]: 5
}

let c = ''
let stash = ''
let ret = []

function reset () {
  escaped = false
  single_quoted = false
  double_quoted = false
  ended = false
  c = ''
  stash = ''
  ret.length = 0
}

function a () {
  stash += c
}

function sq () {
  single_quoted = true
}

function suq () {
  single_quoted = false
}

function dq () {
  double_quoted = true
}

function duq () {
  double_quoted = false
}

function e () {
  escaped = true
}

function ue () {
  escaped = false
}

// add a backslash and a normal char, and turn off escaping
function aue () {
  stash += BACK_SLASH + c
  escaped = false
}

// add a escaped char and turn off escaping
function eaue () {
  stash += c
  escaped = false
}

// try to push
function tp () {
  if (stash) {
    ret.push(stash)
    stash = ''
  }
}

function EOF () {
  ended = true
}


function split (str) {
  if (typeof str !== 'string') {
    type_error(`\`str\` must be a string. Received ${str}`, 'NON_STRING')
  }

  reset()

  const length = str.length
  let i = -1

  while (++ i < length) {
    c = str[i]

    MATRIX[y()][x()]()

    if (ended) {
      break
    }
  }

  if (single_quoted) {
    error('unmatched single quote', 'UNMATCHED_SINGLE')
  }

  if (double_quoted) {
    error('unmatched double quote', 'UNMATCHED_DOUBLE')
  }

  if (escaped) {
    error('unexpected end with \\', 'ESCAPED_EOF')
  }

  tp()

  return ret
}


function error (message, code) {
  const err = new Error(message)
  err.code = code
  throw err
}

function type_error (message, code) {
  const err = new TypeError(message)
  err.code = code
  throw err
}


const REGEX_NEED_QUOTE = /\s|"|'/

function join(args, {
  quote = DOUBLE_QUOTE
} = {}) {
  if (![SINGLE_QUOTE, DOUBLE_QUOTE].includes(quote)) {
    type_error(
      `\`options.quote\` must be either ${SINGLE_QUOTE} or ${DOUBLE_QUOTE}. Received ${quote}` , 'INVALID_QUOTE'
    )
  }

  const process_arg = arg => {
    if (!REGEX_NEED_QUOTE.test(arg)) {
      return arg
    }

    if (!arg.includes(quote)) {
      return quote + arg + quote
    }

    // escape quote
    const escaped = arg.replace(new RegExp(quote, 'g'), `\\${quote}`)
    return quote + escaped + quote
  }

  return args.map(process_arg).join(WHITE_SPACE)
}

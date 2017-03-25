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
  0: [a,   suq,  a,    a,    a,    EOF],
  1: [],
  2: [e,   a,    duq,  a,    a,    ue],
  3: [],
  4:
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
  return s in CHARS
    ? CHARS[s]
    : CHARS.NORMAL
}

const CHARS = {
  [DOUBLE_QUOTE]: 0,
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
  stash += s
}

function sq () {
  single_quoted = true
}

function suq () {
  single_quoted = false
}

function dq () {
  double_quote = true
}

function duq () {
  double_unquote = false
}

function e () {
  escaped = true
}

function ue () {
  escaped = false
}

function EOF () {
  ended = true
}


function split (str) {
  if (typeof str !== 'string') {
    throw new TypeError('Str must be a string. Received ${str}')
  }

  reset()

  const length = str.length
  let i = 0

  while (++ i < length) {
    s = str[i]

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

  return ret
}


function error (message, code) {
  const err = new Error(message)
  err.code = code
  throw err
}


function join (args, options = {}) {
  const quote = options.quote || "'"

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

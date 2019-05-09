const NAND  = (a, b) => !(a && b)

// boolean functions

const NOT   = (a)    => NAND(a, a)
const AND   = (a, b) => NOT(NAND(a, b))
const OR    = (a, b) => NAND(NOT(a), NOT(b))

// IF function

const IF    = (a, b, c) => OR(AND(a, b), AND(NOT(a), c))

// examples

const NOT2  = (a)    => IF(a, false, true)

const XOR   = (a, b) =>
    IF(AND(NOT(a), NOT(b)), false,
    IF(AND(NOT(a),     b ), true,
    IF(AND(    a , NOT(b)), true,
    IF(AND(    a ,     b ), false,
                            false
    ))))

module.exports = {
    NAND,
    NOT,
    AND,
    IF,
    NOT2,
    XOR
}


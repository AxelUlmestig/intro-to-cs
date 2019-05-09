
// lambda functions, sort of
const add1  = a => a + 1
const add   = a => b => a + b

// boolean algebra

const TRUE  = x => y => x
const FALSE = x => y => y

const NOT   = b => b(FALSE)(TRUE)
const AND   = b1 => b2 => b1(b2)(FALSE)
const OR    = b1 => b2 => b1(TRUE)(b2)
const XOR   = b1 => b2 => b1(NOT(b2))(b2)

const NAND  = b1 => b2 => NOT(AND(b1)(b2)) // now lambda calculus can calculate any finite function

const IF    = b => b

const evalBool = b => b(true)(false)

// lists

const PAIR  = x => y => f => f(x)(y)
const FST   = p => p(x => y => x)
const SND   = p => p(x => y => y)

const NIL   = f => TRUE
const IS_EMPTY = p => p(x => y => FALSE)

const toList = p => evalBool(IS_EMPTY(p))
    ? []
    : [FST(p)].concat(toList(SND(p)))

const fromList = l => l.length < 1
    ? NIL
    : PAIR(l[0])(fromList(l.slice(1)))

const threeBooleanList = PAIR(TRUE)(PAIR(FALSE)(PAIR(TRUE)(NIL)))

//---- Y combinator

// \f.((\x.f(x x))(\x.f(x x)))
const RECURSE = f => {
    const tempF = me => x => f(me(me))(x)

    return f(tempF(tempF))
}

// list manipulations

/*
 * The IF function can't be used to break recursion in JS due to JS doing eager
 * evaluation. It evalutes both the if and the else case before deciding which
 * one it's going to return.
 *
 * Here we have to cheat a little bit, the JS ternary operator does exactly the
 * same thing as the IF function with the only difference being that it
 * evalutes lazily.
 */
const REDUCE = RECURSE(me => f => init => list =>
    /*
    IF(
        IS_EMPTY(list))
        (init)
        (f(
            FST(list))
            (me(f)(init)(SND(list)))
        )
    */
    evalBool(IS_EMPTY(list))
        ? init
        : f(
            FST(list))
            (me(f)(init)(SND(list)))
)

/*
 * Modeling a turing machine in lambda calculus
 *
 * Let NEXT be a function that accepts a variable S that contains the current
 * state, index and tape and return S' that is the updated values of state,
 * index and tape.
 *
 * Updating the state and index based on the current state and the value of the
 * tape at the current index is a finite function. This can be done using NAND
 * gates which can easily be represented with lamda calculus.
 *
 * Getting/setting the tape value at the index of an arbitrarily long list can
 * be done using the REDUCE function.
 *
 * Let HALT be a function that checks if the execution should halt.
 *
 * Using the NEXT and HALT functions we can now produce a function TM that
 * simulates a Turing Machine.
 *
 * TM = RECURSE(me => S => IF
 *          (HALT(S))
 *          (S)
 *          (me(NEXT(S)))
 *      )
 */

module.exports = {
    TRUE,
    FALSE,
    NOT,
    AND,
    OR,
    XOR,
    IF,
    evalBool,
    PAIR,
    FST,
    SND,
    NIL,
    IS_EMPTY,
    threeBooleanList,
    toList,
    fromList,
    REDUCE
}


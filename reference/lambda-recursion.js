
const factorial0 = (x) => {
    if(x < 1) return 1

    return x * factorial0(x - 1)
}

//---------- anonymous recursion

const factorial1 = (me, x) => {
    if(x < 1) return 1

    return x * me(me, x - 1)
}

const factorial = x => factorial1(factorial1, x)

//---------- using the Y combinator

const factorial2 = me => x => {
//const factorial2 = (me, x) => {
    if(x < 1) return 1

    return x * me(x - 1)
}

const RECURSE = f => {
    //const tempF = me => f(me(me))
    const tempF = me => x => f(me(me))(x)

    return f(tempF(tempF))
}

const ycFactorial = RECURSE(factorial2)

module.exports = {
    factorial1,
    factorial,
    ycFactorial
}


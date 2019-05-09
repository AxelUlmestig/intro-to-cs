/*
 * Goldbach's Conjecture states that every even integer > 2 can expressed as
 * the sum of two primes. Mathematicians have failed to prove or disprove it
 * for the last 250 years.
 *
 * This program will halt if that's not true. I dare you to tell me if this
 * program will halt or not (barring silly reasons like restrictions on the
 * size of ints or memory).
 */

const R = require('ramda')

const isPrime = n =>
    R.all(x => x % n != 0, R.range(2, n))

const isSumOfTwoPrimes = n =>
    R.all(x => isPrime(x) && isPrime(n - x), R.range(2, n))

let i = 4
while(isSumOfTwoPrimes(i)) {
    i += 2
    console.log(i)
}

console.log(`${i} can not be expressed as the sum of two primes, Goldbach is disproven`)


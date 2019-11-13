# Intro to theoretical computer science
Today we are going to do some theoretical computer science. I am going to start
by proving to you that you can calculate any finite function only using `NAND`
gates.

A finite function is one that has a finite number of potential inputs.
For example a function that converts lower case letters to upper case is
finite. There are only 24 possible inputs. A function that doubles integers is
infinite, there is an infinite number of integers you could apply the function
to.

Then we are going to use Turing Machines to calculate infinite functions and
show how the ugly mess that is the Turing Machine can be replaced by beautiful
the anonymous functions of the Lambda Calculus.

Lastly we'll touch on uncomputable functions. I.e. functions that can't be
computed by Turing Machines or Lambda Calculus.

This post is based almost entirely on the book [Introduction to Theoretical
Computer Science](https://introtcs.org/public/) by Boaz Barak. I highly
recommend it if you find this topic interesting.

## 0. Table of Contents

[1. NAND Gates](#1-nand-gates-) \
[2. Turing Machines](#2-turing-machines-) \
[3. Lambda Calculus](#3-lambda-calculus-) \
    [3.1 Lazy vs Eager Evaluation](#31-lazy-vs-eager-evaluation-) \
    [3.2 Boolean Algebra in Lambda Calculus](#32-booleans-algebra-in-lambda-calculus-) \
    [3.3 Lists in Lambda Calculus](#33-lists-in-lambda-calculus-) \
    [3.4 Recursion in Lambda Calculus](#34-recursion-in-lambda-calculus-) \
    [3.5 Implementing the REDUCE function](#35-implementing-the-reduce-function-) \
    [3.6 Simulating a Turing Machine with Lambda-Calculus](#36-simulating-a-turing-machine-with-lambda-calculus) \
[4. Uncomputable Functions](#4-uncomputable-functions)

## 1. NAND Gates <a name="nand-gates"></a>

The NAND (Not AND) function is a function that accepts two boolean variables
(bits) and returns one boolean. It will only return `false` (0) if both
arguments are `true` (1).

The function's truth table looks like this:

| b1 | b2 | output |
|----|----|--------|
| 0  | 0  | 1      |
| 0  | 1  | 1      |
| 1  | 0  | 1      |
| 1  | 1  | 0      |

Let's start by expressing the standard boolean functions in terms of of NAND
gates.

```
NOT     = (b)       => NAND(b, b)
AND     = (b1, b2)  => NOT(NAND(b1, b2))
OR      = (b1, b2)  => NAND(NOT(b1), NOT(b2))
```

The standard boolean functions: `NOT`, `AND` and `OR` can be expressed
as `NAND` gates like we just did. We can in other words use all of those functions and
then later just "compile" down to pure `NAND`.

Using our logic gates we can create the `IF` function. It takes three boolean
arguments, if the first argument is `true` it will return the value of the
second argument. If it's `false` it will return the value of the third
argument. It's basically the ternary operator but only valid for booleans.

```
IF      = (a, b, c) => OR(AND(a, b), AND(NOT(a), c))
```

The trick to figuring out how to write a function like this using logic gates
is to ask the question "when does this return `true`?". In this case you will
realize that there are exactly two such cases.

1. When `a` and `b` are `true`. Then `b` will be chosen and it is `true`.
2. When `a` is `false` and `c` is `true`. Then `c` will be chosen and it is `true`.

Now we can express this in english as this function is `true` either when `a`
`AND` `b` are `true` `OR` when `a` is `NOT` `true` `AND` `c` is `true`.

This function allows us to specify all functions from one bit to one bit. For
example, we can implement the `NOT` function like so.

```
NOT2    = (b)       => IF(b, false, true)
```

I realize that this is a bit circular since the `IF` function uses `NOT` in its
implementation, but there aren't that many functions to draw from that takes
one bit to one bit. (In fact, there are only 4).

Let's make it more interesting and make a function from two bits to one bit.
Like the `XOR` function for instance. The way we're going to do this is very
inefficient, we are going to use an `IF` statement for each possible
configuration of the inputs.

```
XOR     = (b1, b2)  =>
    IF(AND(NOT(b1), NOT(b2)), false,
    IF(AND(NOT(b1),     b2 ), true,
    IF(AND(    b1 , NOT(b2)), true,
    IF(AND(    b1 ,     b2 ), false,
                              false
    ))))
```

If the input is (0, 0) it will return false, else it will check if the input is
(0, 1) and so on. The final false result is unreachable, but I added it anyway
for the sake of consistensy.

From here it's quite easy to see how we can scale this up to calculate any
finite function you want, even if it might be inefficient. In order to get
outputs of multiple bits you simply have multiple of these functions in
parallel.

An example of a function we could calculate is one that accepts a
representation of a `NAND` program and some input and then returns the output
of the supplied program. One crucial caveat here is that the program that we're
interpreting must have fewer gates than the program doing the intrepreting.

## 2. Turing Machines <a name="turing-machines"></a>

But there's obviously something missing here. All of your computers can
compile/interpret programs of arbitrary length. They don't seem to be limited
by implementation details of the processors.

The reason for this is that your processors can do loops. This brings us to the
Turing Machine that I think everyone has heard of.

A Turing Machine consists of an infinite tape divided into cells. Each cell
contains a symbol that is a part of a finite alphabet. The Turing Machine also
keeps track of an internal state with a finite number of configurations and a
current index of the tape.

In order to implement this we need a function that accepts the current state
and current symbol and returns a new state, symbol and instruction on if the
tape should move to the Left, Right, Stop or if the calculation should Halt.

```
(state, symbol) -> (state', symbol', L|R|S|H)
```

This is clearly a finite function (since there is a finite amount of values of
`state` and `symbol`) which means that it can be computed with a `NAND`
program. But, as stated previously, we need a loop as well. The Turing Machine
can be implemented like this:

```
moveInstruction = RIGHT
state = initialState
symbol = start

while(moveInstruction != HALT) {
    (state, symbol, moveInstruction) = Update(state, symbol)
    writeValue(symbol)
    moveTape(moveInstruction)
}
```

examples can be found here
https://turingmachinesimulator.com/

As you might be aware, Turing Machines are used as the reference for what can
be computable by computer scientists. In fact the term "computable function" is
defined to be a function that can be computed by a Turing Machine.

Now I found this all to be quite disappointing after the elegant proof that any
finite function can be computed by `NAND` gates.

## 3. Lambda Calculus <a name="lambda-calculus"></a>

Now we move away from Turing Machines to another computing model that is
equivalent in power to the Turing Machine, the Lambda Calculus. Lambda Calculus deals with anonymous
functions that accept one input variable, and absolutely nothing else.

A function that takes an input `x` and adds one to it is written like so:

```
λx.x+1
```

and would be called like so:

```
(λx.x+1) 3
```

How do we do functions with more than one argument? We make the functions
return another function that accepts the next argument. The function for adding
two number would then look like this.

```
λx.λx.x+y
```

And would be called like this:

```
((λx.λy.x+y) 1) 3
```

The outer parenthesis can be omitted. The process of simulating functions with
multiple arguments by having functions with one argument return other functions
is called "currying".

### 3.1 Lazy vs eager evaluation <a name="lazy-vs-eager-evaluation"></a>

Before we talk more about what can be done with Lambda Calculus we have to talk
briefly about eager (AKA strict) and lazy evaluation.

In order to illustrate this I'll challenge the reader with a logical problem
that is trivial to humans.

_Step 1:_ \
Imagine all the natural numbers, 1, 2, 3, etc...

_Step 2:_ \
Now take the first 3

The result of this is obviously `[1, 2, 3]`, but if you were to naively pose
this problem to a computer it would never produce a result. It would get stuck
on step one and try to enumerate all of the infinite natural numbers. This
approach is called "eager evaluation".

When you solved this problem you did not try to enumerate all the natural
numbers (or you would not have gotten this far in the text), instead you
treated them as a potential source of data that you could gradually get more
values from when needed. This approach is called "lazy evaluation".

Another example would be calculating the value of
```js
f(g(x))
```
given values of the variable `x` and the functions `f` and `g`. A lazy
individual would have a look at the implementation of `f` before calculating
`g(x)`. What if the the function `f` looks like this?
```js
f = y => 3
```

Then it would not matter what the value of `g(x)` was, the result would always
be `3`. This is again the lazy approach. The eager approach would be to always
evaluate `g(x)` first regardless of what `f` looks like.

Eager or lazy evaluation will almost always result in the value, but there are
corner cases where the eager evaluation goes into infinite loops while the lazy
doesn't. One example of this would be if the function `g` in the previous
example always gets stuck in an infinite loop when called.

Most mainstream programming languages do eager evaluation. I.e. they will
always evaluate `g(x)` first in the above example. It has the advanatage of
making the performance and memory usage of programs more predictable.

Lambda Calculus is generally computed in a lazy fashion as this is a tool for
scientists and not engineers. In this domain it's more important to have more
computations terminate than it is to keep track of performance and memory usage
in a practical application.

### 3.2 Boolean Algebra in Lambda Calculus <a name="booleans-algebra-in-lambda-calculus"></a>

Now, we've been cheating a bit in the previous examples. That was not valid
Lambda Calculus because Lambda Calculus does not contain the plus operator. Nor
does it contain numbers or booleans or any other data type or structure that
you can think of.

We are going to have to define those things in terms of anonymous functions.

Let's start with booleans, how can we define booleans in terms of anonymous
functions? Well, what are booleans for? We use them to make choices, if
something is true we get one thing and if it's false we get something else.

Let's define functions for the boolean values `TRUE` and `FALSE`

```
TRUE    = λx.λy.x
FALSE   = λx.λy.y
```

Now we have two functions that will help us choose between two things. The
`TRUE` function will return its first argument and the `FALSE` function will
return its second argument. This is exactly what the ternary operator that is
present in most mainstream programming languages does.

The astute reader will also notice that it's trivial to implement the `IF`
function using this definition of booleans.

```
IF      = λb.λx.λy.b x y
```

which, thanks to currying, is equivalent to:

```
IF      = λb.b
```

Now with that established we can start defining boolean functions. The simplest
one is the `NOT` function.

```
NOT     = λb.b FALSE TRUE
```

If the boolean `b` is `TRUE` then it will return the first of its two
arguments, namely `FALSE`. Similarly, if `b` is `FALSE` then it will return the
second argument which is `TRUE`.

The `AND` function is slightly trickier. Here we get two boolean arguments.

```
AND     = λb1.λb2.b1 b2 FALSE
```

Once again we're using a similar tactic, we make choices by applying arguments
to the booleans. If `b1` is `FALSE` then we want to return `FALSE`. So `FALSE`
is the second argument to `b1`. But if `b1` is `TRUE` then we want to return
`TRUE` if `b2` is `TRUE` and `FALSE` otherwise. That is equivalent to just
returning the value of `b2`.

Next up is the `OR` function, now that I've shown you how to do `NOT` and `AND`
I recommend that you take a minute to try to figure out how to do the `OR`
function.

<details>
    <summary>Click here to see one possible implementation</summary>

```
OR      = λb1.λb2.b1 TRUE b2
```
</details>

Now, using these functions we can define the `NAND` function. (I can think of
two ways of doing it)

```
NAND    = λb1.λb2.b1 (NOT b2) TRUE
        = λb1.λb2.NOT(AND b1 b2)
```

By constructing the `NAND` function we've effectively proven that you can
calculate all finite functions using the Lambda Calculus.

But the Turing Machine can still do more than that, it can calculate functions
that have inputs of arbitrary sizes. How can we prove that the Lambda Calculus
can do the same? Simple, we just simulate a Turing Machine in the Lambda
Calculus. (It's actually not that simple to do, but you get my point).

Just like we did before, we can construct a finite function that takes the
state and symbol and returns a new state, symbol and movement instruction. Now
all that's left is to define lists and functions that can operate on
arbitrarily long lists.

### 3.3 Lists in Lambda Calculus <a name="lists-in-lambda-calculus"></a>

Let's start by defining lists. We are going to be doing linked lists. A linked
list contains two things, one element and one reference to the remaining list.
So let's start by defining a pair that can hold any two values.

```
PAIR    = λx.λy.λf.f x y
```

This works by you giving two values to the `PAIR` function which then returns a
new function waiting for a function that allows you to extract the values
again.

Now we can create functions for extracting the values.

```
FST     = λp.p(λx.λy.x)
SND     = λp.p(λx.λy.y)
```

These pairs can be used to create linked lists if we use the convention that
the first element in the pair is that data and the second element is the
remaning list.

Linked lists, like all good things, must also come to an end. We are going to
define an element, called `NIL`, that represents an empty linked list.

```
NIL     = λf.TRUE
```

Now this might seem strange to you, but it will make sense in a moment when
we've defined the function `IS_EMPTY` that checks if a list is empty.

```
IS_EMPTY = λp.p(λx.λy.FALSE)
```

By staring at this for a while we will realize that if we pass a `PAIR x y` to
`IS_EMPTY` it will always return `FALSE` regardless of which elements x and y
are.  But if we instead pass `NIL` to `IS_EMPTY` it will always return `TRUE`.
Because the `NIL` function never invokes the function we pass it, it always
returns `TRUE`.

Now we can define lists of booleans:

```
booleans = PAIR TRUE (PAIR FALSE (PAIR TRUE NIL))
         = [true, false, true]
```

### 3.4 Recursion in Lambda Calculus <a name="recursion-in-lambda-calculus"></a>

But, we don't have loops. How can we do list operations without loops? With
recursions of course.

List operations that are using loops can be done using the higher order
functions `map`, `filter` and `reduce` that are present in most mainstream
programming languages. (`Select`, `Where` and `Aggregate` if you're stuck in
.NET land). And as `map` and `filter` can be expressed in terms of `reduce`
it's enough to be able to create the `reduce` function.

A quick recap on the `reduce` function. It is used to "reduce" a list of values
down to a single value. The prototypical example is summarizing a list of
integers.

```js
const sum = [1,2,3].reduce((mySum, x) => mySum + x, 0)
          = 0 + 1 + 2 + 3
          = 6
```

By looking at this example of the `reduce` function we can see that it's quite
recursive.

```js
const add   = (a, b) => a + b

const sum   = [1,2,3].reduce(add, 0)
            = [2,3].reduce(add, 1)
            = [3].reduce(add, 3)
            = [].reduce(add, 6)
            = 6
```

Now, before we go into implementing the `reduce` function we're going to do a
quick detour on recursion. Recursion is not trivial in the lambda calculus
since anonymous functions can't call them selves by name for natural reasons.

Here's the `factorial` function written recursively in JavaScript, calling
itself by name.

```js
const factorial0 = (x) => {
    if(x < 1) return 1

    return x * factorial0(x - 1)
}
```

Now, that's not possible in the Lambda Calculus, so we're going to have to
apply a little trick.

```js
const factorial1 = me => x => {
    if(x < 1) return 1

    return x * me(me)(x - 1)
}

const factorial = factorial1(factorial1)
```

Now the `factorial1` function is recursive as long as it's given a copy of
itself. But some mathematicians in the 30's who had a lot of time on their
hands didn't think that this was elegant enough. They wanted to write the
function without having to supply `me` to `me` in the recursive step. Like
this:

```js
const factorial2 = me => x => {
    if(x < 1) return 1

    return x * me(x - 1)
}
```

Even though the first version works just fine. So they came up with an even
trickier trick. It's called the "Y Combinator" and it works like this:

```js
const RECURSE = f => {
    const tempF = me => x => f(me(me))(x)

    return f(tempF(tempF))
}

const ycFactorial = RECURSE(factorial2)
```

Here we've created a wrapper function, `tempF` that applies the same trick as
before. It passes a copy of itself to itself.

This can be expressed much more concisely (and opaquely) with the Lambda
Calculus:

```
RECURSE     = λf.f(λx.f(x x)(λx.f(x x)))
```

Now we have created a function that can turn a non recursive function into a
recursive one. Let that sink in for a moment.

This function is notoriously hard to grasp. I've spent a lot of time staring at
this and I don't think I fully understood it until I implemented it myself
without looking at a reference. And even now I have to think quite hard every
time I do it.

So we're not going to spend too much time here, I think the most productive
thing to do is to just accept that it exists and works and then spend some time
on this yourself later if you're interested.

### 3.5 Implementing the REDUCE function <a name="implementing-the-reduce-function"></a>

Now, let's go back to the `REDUCE` function. Here's an implementation of it in
Lambda Calculus.

```
REDUCE      = RECURSE (
    λme.λf.λinit.λlist.
        IF  (IS_EMPTY list)
            init
            (me f (f init (FST list)) (SND list))
)
```

This might look a little scary but it's not that complicated if we break it
down. First we check if the list is empty, if so we return the `init` value.

If the list is not empty, then we call the `REDUCE` function recursively with
the tail of the list (every element except the first) and an updated `init`
value. We get the updated `init` value by applying the function `f` to the
first element in the list and the `init` value.

One interesting property of this `REDUCE` implementation is that if you reduce
function with the `PAIR` function and `NIL` you will get an identical list back.

```
REDUCE PAIR NIL list == list
```

Also notice that this goes into an infinite loop if we eagerly evaluate the
arguments to the `IF` function. We don't want to evaluate `me f (f init (FST list)) (SND list)`
if `IS_EMPTY list` is `TRUE`.

With this insight it's not so tricky to implement the `MAP` function.

```
MAP     = λf.λlist.REDUCE (λx.λy.PAIR (f x) y) NIL list
```

This is very similar to the example where we just recreated the list with the
`PAIR` function. But here we apply the function `f` on each element before we
recreate the list.

The `FILTER` function can also be implemented in a similar fashion.

```
FILTER  = λf.λlist.REDUCE (λx.λy.IF (f x) (PAIR x y) y) NIL list
```

Here we only include the elements where `f x` evaluates to `TRUE` when we
reconstruct the list.

### 3.6 Simulating a Turing Machine with Lambda Calculus

TODO

### 4. Uncomputable Functions

Computable functions are defined to be those can be calculated by a Turing
Machine, as we touched upon earlier. But this begs the question:

Which functions can not be computed by Turing Machines?

Functions that lead to paradoxes is the answer. This is famously captured by
the Halting Problem. The halting problem seeks to find an algorithm that can
decide if a given program combined with a given input will halt. Sadly, this
algorithm does not exist. It can't exist. Which is a shame because it would
have been extremely useful to the software industry.

Here's the proof of why it can't exist. Imagine that there is a function
'willHalt' that takes a function as input and returns `true` or `false`
depending on if the supplied function will always halt or not.

In that case this snippet of JavaScript code would lead to a paradox.

```js
const f = willHalt => {
    while(willHalt(f)) {}

    return 'halted'
}
```

If the function `willHalt` states that `f` will halt, then it will go into an
infinite loop and decidedly not halt. And if `willHalt` thinks that `f` won't
halt then it will halt quit immediately.

Now you might be thinking that I'm being a bit of a jerk here. Referring to the
`willHalt` function in my function may seem like cheating but this does prove
that there's no general `willHalt` algorithm that works for _all_ programs.

Some of you who are experienced developers might not be impressed by this. You
might be thinking that you can look at any program and determine if it will
halt or not (as long as it doesn't explicitly reference the `willHalt` function
to avoid paradoxes).

To challenge this I would ask the reader to consider the following Node JS
program.

```js
const R = require('ramda')

const isPrime = n =>
    R.all(x => n % x != 0, R.range(2, n))

const isSumOfTwoPrimes = n =>
    R.any(x => isPrime(x) && isPrime(n - x), R.range(2, n))

let i = 4
while(isSumOfTwoPrimes(i)) {
    i += 2
    console.log(i)
}

console.log(`${i} can not be expressed as the sum of two primes, Goldbach is disproven`)
```

This program relies a bit on the `Ramda` library to generate ranges of numbers
(`R.range`) and to check if some predicate holds for all or any elements of a
list (`R.all` & `R.any`). I hope that this is not too confusing even if you're
not familiar with the particular library.

This program tries to disprove the famous [Goldbach's
conjecture](https://en.wikipedia.org/wiki/Goldbach%27s_conjecture) which states
that "Every even integer greater than 2 can be expressed as the sum of two
primes"

If you can determine if this program halts or not you will have solved an open
problem in mathematics that has been unsolved since 1742 and you would probably
become quite famous in certain nerdy circles.

Hopefully this convinces you that the halting problem does not have a solution.


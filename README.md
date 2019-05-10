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
lastly going to show how the ugly mess that is the Turing Machine can be
replaced by beautiful anonymous functions.

If there's time we're going to have a look at uncomputable functions.

This post is based almost entirely on the book [Introduction to Theoretical
Computer Science](https://introtcs.org/public/) by Boaz Barak. I highly
recommend it if you find this topic interesting.

## Table of Contents

[1. NAND Gates](nand-gates)

## NAND Gates <a name="nand-gates"></a>

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
arguments, if the first one is true it will return the value of the second
argument. If it's false it will return the value of the third argument. It's
basically the ternary operator but only valid for booleans.

```
IF      = (a, b, c) => OR(AND(a, b), AND(NOT(a), c))
```

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

## Turing Machines

But there's obviously something missing here. All of your computers can
compile/interpret programs of arbitrary length. They don't seem to be limited
by implementation details of the processors.

The reason for this is that your processors can do loops. This brings us to the
Turing Machine that I think everyone has heard of.

A Turing Machine constists of an infinite tape divided into cells. Each cell
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

## Lazy vs eager evaluation

## Lambda Calculus

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

Now, we've been cheating a bit. This is not valid Lambda Calculus because Lambda Calculus does not
contain the plus operator. Nor does it contain numbers or booleans or any other
data type or structure that you can think of.

We are going to have to define those things in terms of anonymous functions.

Let's start with booleans, how can we define booleans in terms of anonymous
functions? Well, what are booleans for? We use them to make choices, if
something is true we get one thing and if it's false we get something else.

Let's define functions for the boolean values `TRUE` and `FALSE`

```
TRUE    = λx.λy.x
FALSE   = λx.λy.y
```

Now we have two functions that will help us choose between two things. The TRUE
function will return its first argument and the FALSE function will return its
second argument. This is exactly what the ternary operator that is present in
most mainstream programming languages does.

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
AND     = λb1.λb2.b1 b2 FALSE
```

Next up is the `OR` function, now that I've shown you how to do `NOT` and `AND`
I recommend that you take a minute to try to figure out how to do the `OR`
function.

```
OR      = λb1.λb2.b1 TRUE b2
XOR     = λb1.λb2.b1 (NOT b2) b2
```

Now, using these functions we can define the `NAND` function. (I can think of
two ways of doing it)

```
NAND    = λb1.λb2.b1 (NOT b2) TRUE
          λb1.λb2.NOT(AND b1 b2)
```

Now that we've constructed the `NAND` function we've effectively proven that you
can calculate all finite functions using the Lambda Calculus.

But the Turing Machine can still do more than that, it can calculate functions
that have inputs of arbitrary sizes. How can we prove that the Lambda Calculus can do the
same? Simple, we just simulate a Turing Machine in the Lambda Calculus. (It's
actually not that simple to do, but you get my point).

Just like we did before, we can construct a finite function that takes the
state and symbol and returns a new state, symbol and movement instruction. Now
all that's left is to define lists and functions that can operate on
arbitrarily long lists.

### Lists in Lambda Calculus

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

By staring at this for a while we will realize that if we pass a `(PAIR x y)`
to `IS_EMPTY` it will always return `FALSE` regardless of which elements x and
y are.  But if we instead pass `NIL` to `IS_EMPTY` it will always return
`TRUE`. Because the `NIL` function never invokes the function we pass it, it
always returns `TRUE`.

Now we can define lists of booleans:

```
booleans = PAIR (TRUE (PAIR FALSE (PAIR TRUE NIL)))
         = [true, false, true]
```

### Recursion in Lambda Calculus

But, we don't have loops. How can we do list operations without loops? With
recursions of course. Loops are in most modern programming languages quickly
being replaced by the higher order functions `map`, `filter` and `reduce` (or
`Select`, `Where` and `Aggregate` if you're stuck in .NET land). And as `map`
and `filter` can be expressed in terms of `reduce` it's enough to be able to
create the `reduce` function.

A quick recap on the `reduce` function. It is used to "reduce" a list of values
down to a single value. The prototypical example is summarizing a list of
integers.

```
const sum = [1,2,3].reduce((mySum, x) => mySum + x, 0)
          = 1 + 2 + 3 + 0 = 6
```

Now before we go into representing lists we're going to a quick detour on
recursion which is not trivial in the lambda calculus since anonymous functions
can't call them selves by name for natural reasons.

Here's the `factorial` function written recursively in JS, calling itself by
name.

```js
const factorial0 = (x) => {
    if(x < 1) return 1

    return x * factorial0(x - 1)
}
```

Now, that's not possible in the Lambda Calculus, so we're going to have to
apply a little trick.

```js
const factorial1 = (me, x) => {
    if(x < 1) return 1

    return x * me(me, x - 1)
}

const factorial = x => factorial1(factorial1, x)
```

Now the `factorial` function is recursive as long as it's given a copy of
itself. But some mathematicians in the 30's who had a lot of time on their
hands didn't think that this was elegant enough. They wanted to write the
function without having to supply `me` to `me` in the recursive step. Like
this:

```
const factorial2 = me => x => {
    if(x < 1) return 1

    return x * me(x - 1)
}
```

Even though the first version works just fine. So they came up with an even
trickier trick.  It's called the Y combinator and it works like this:

```
const RECURSE = f => {
    const tempF = me => x => f(me(me))(x)
    // the `x` parameters must be explicitly given due to JS's eager evaluation
    // const tempF = me => f(me(me))

    return f(tempF(tempF))
}

const ycFactorial = RECURSE(factorial2)
```

This can be expressed much more concisely (and opaquely) with the Lambda
Calculus:

```
RECURSE     = λf.f(λx.f(x x)(λx.f(x x)))
```

Now we have created a function that can turn a non recursive function into a
recursive one. Let that sink in for a moment. This function is notoriously hard
to grasp. I've spent a lot of time staring at this and I don't think I fully
understood until I implemented it myself without looking at a reference. And
even now I have to think quite hard every time I do it.

So I'm not going to spend too much time here, I think the most productive thing
to do is to just accept that it exists and works and then spend some time on
this yourself if you're interested.

### Implementing the REDUCE function

```
REDUCE      = RECURSE (
    λme.λf.λinit.λlist.
        IF  (IS_EMPTY list)
            init
            (f (FST list) (me f init (SND list)))
)
```


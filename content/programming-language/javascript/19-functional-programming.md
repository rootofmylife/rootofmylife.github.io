# Functional Programming in JS

[Resource](https://frontendmasters.com/courses/functional-javascript-v3/functional-programming-journey/)

## Imperative vs Declarative

What does imperative mean?

The good news is, unless you already are one of those unicorns who learned programming from the beginning, as a functional programmer

But unless you are like that, then you're like all the rest of us, which is that you learned non-functionally, which is to say you learned imperatively.

Imperative code means code that is focused primarily on how to do something. If somebody tells you, I've got a list of numbers that all needed to be added up and get a final total sum.

Just me saying that English sentence means, that almost all of you had the same code snippet that popped into your head. If you have any experience with programming at all.

All of you probably conceived something like, I'm gonna set up an accumulator variable called Total. And I'm gonna for loop over the array, and I'm gonna add each element into the total and then return the total.

And if that's the way that you thought about the problem, you're in good company because that's the way all the rest of us thought about the problem.

And that's the imperative approach because that code, while it will work, and while it's familiar and while it's convenient, and while it's probably pretty performant, all of those are good things. But that code is imperative because the future reader of that code has to read all of the code and, in a sense, almost mentally execute the code, before they understand what it's purpose is.

They have to do that. They can't simply glance at this particular for loop and immediately know exactly what that for loop is doing.

They have to read it and execute a few iterations and then convince themselves. They have to infer from the code what it's doing. And you may think, well, that's not a big deal, that's what programmers do. We read code and then we write code, of course.

Not a big deal. Well it is kind of a big deal. It is kind of a big deal because it forces the reader to do something that they're not actually naturally gifted at doing. Guess who's particularly good at executing code. The computer. Who's not so great at executing code? Our brains, they weren't built for that.

So what is declarative then?

If imperative is all focused, or almost all focused on how, declarative stands in opposition to that.

Because declarative says, no, no, the how is not the important part. The important part is the what, the outcome. And even more importantly than that, why.

There is a purpose for code comments. They're not an excuse for not caring about your code.

A lot of people will go to the other extreme and say, what does it matter howbad the code as long as there's a code comment, and I explained what I was doing.

That's good enough. Actually, it's not good enough because most of the time, code comments are out of sync with the code.

A bad code comment is worse than no comment at all, because then the person spends twice as much time spinning their wheels.

But on the topic of code comments, and I'm using this as an illustration point of the reason why declarative is useful.

On the topic of code comments, my response is always, no, no, no, you don't have to remove all comments, but your comment should not duplicate the narrative of what the code is doing.

Don't have a line of code that says i plus plus, and then put a code comment that says increment i. I can see that it's incrementing i. I don't need a code comment to tell me that, okay.

That's not the important reason for that code comment. Here's what I wanna know from your code comment. Why are you incrementing by one? What is magical about one as opposed to incrementing by two?

That might be useful information, that I want you to tell me. That's what a code comment should focus on. It should focus on the why, not the what, and sometimes maybe it needs to focus on the how if it's particularly confusing, if there's something particularly hard to understand.

But even in those cases, that's a clue that maybe I could work on improving that code, so that ideally all of my code comments focus on why.

But we can go even further than that and say, what if your code made it obvious why it was doing something.

Well then, you don't need a code comment there. So I'm not saying no code comments. I'm simply saying shift our perspective from imperative to declarative.

Focus on, let's allow the system to do what it does best, it figures things out best. And let's focus our code on why we need that, why we need that what outcome.

And to the extent that we can't, that's what our code comments should be explaining.

So we wanna shift in this direction and that is one of the biggest reasons for why functional programming, because functional programming is, by its very nature, more declarative.

## Definition

Function is the semantic relationship between input and computed output.

Like a mathematical function, which is `f(x) = 2x^2 + 3`, you can draw a parabola with that.

The input and output are must be directly related. If you give me an input, I can give you an output.

Note:

- The perfect programm will need a perfect test. But we don't know how to create a perfect test. So we can not validate the perfect program

# Code Review Anti-patterns

## Introduction

Code review seems like a great idea, right? Two developers looking at the same code means two chances to spot problems; it spreads understanding of the way the project is evolving; the reviewer can learn useful tricks from reading the author’s code in detail, or spot opportunities to teach the author a useful trick that they didn’t know already.

But that’s only for ‘light side’ code reviewers, who use it to try to improve the code base and the developers’ collective skills. Code review can also be a powerful tool for totally different purposes. When a code reviewer turns to the dark side, they have a huge choice of ways to obstruct or delay improvements to the code, to annoy patch authors or discourage them completely, or to pursue other goals of their own.

If you’ve only recently turned to the dark side, you might not have thought of all the possibilities yet. So here’s a list of code-review antipatterns, for the dark-side code reviewer who’s running out of ideas.

## The antipatterns

### The Death of a Thousand Round Trips

`nitpick` usually used to mean "small comment", "my preference", or "very minor". Those are all things that are not worth fixing/changing and so that is just a different way of restating it. I.E. "small comments", "my preference", "very minor" things are all worthless in a PR. They might be interesting when hanging out and chatting, but for a productive workflow they are just noise.

You start reading the code. As soon as you see a nitpick, you add a review comment pointing it out. Then you stop reading.

The developer conscientiously fixes your nitpick, and submits a revised patch.

You start reading that version. You spot another nitpick, independent of the first. You _could_ perfectly well have mentioned it the first time, but you didn’t, because you didn’t get that far. So you point that out – and stop reading again.

And so on. Iterate until the developer loses hope.

If you’re in a very different time zone from the developer, you get a natural 24-hour round-trip time, so that the patch evolves as slowly as possible. If you’re in a nearby time zone, or the same one, then to delay the patch properly, you’ll have to arrange to be busy with several other things, so you have a good excuse for it taking you a day or two to get round to looking at each new version.

Resist the temptation to make any remarks like ‘This is looking much better now.’ If you hint that you’re getting closer to being satisfied, you’ll give them reason to keep trying!

### The Ransom Note

This particular patch seems _especially_ important to the developer who submitted it. (Maybe they said that outright, as part of their argument trying to persuade you to take the patch. Or maybe you just read between the lines.)

But this patch isn’t especially vital to you – so you’re in a position of power! Now you can hold the change they need hostage until they do lots of extra tangentially related work, which doesn’t really need to be in the same commit, but which is important to _you_.

‘If you ever want to see your beloved patch again …’

### The Double Team

One patch. Two reviewers.

Every time one of your demands a change, the developer obediently makes it – and now the other one can complain instead!

Keep taking turns to make incompatible demands. But always direct your comments at the developer. Avoid arguing directly with _each other_ on the review thread, and don’t acknowledge any suggestion from the patch author that the two of you should talk to each other and come to a consensus about what the patch is supposed to look like.

See how many times you can ping-pong the developer back and forth before they give up.

(In a real emergency, if you can’t find an accomplice, you can try contradicting _your own_ previous review comments. But normally someone will notice. It works better with two reviewers.)

### The Guessing Game

There’s a problem, and lots of different possible ways to solve it. A developer has picked one solution and submitted a patch.

Criticise that _particular_ solution, on some grounds that don’t relate to whether or not it solves the problem. Keep your criticism vague and woolly: violation of an obscure design principle, perhaps, or incompatibility with some vapourware plan for future development in the same area. Make the criticism as irrelevant as possible to the thing they were really trying to achieve.

If you make it vague enough, the developer won’t be able to think of any way to adapt their existing patch that they’re confident will address your criticisms. Their best bet is to choose a totally _different_ solution to the original problem, and try implementing that instead.

So now you can smack that one down too, in just as unhelpful a way!

Don’t let the developer trap you into any conversation like ‘ok, how do you think this problem _should_ be solved?’, or give any hint at a solution you’d be happy with. Sooner or later, they’ll lose they will to keep guessing.

### The Priority Inversion

In your first code review passes, pick small and simple nits. Variable names are a bit unclear; comments have typos in.

Wait for the developer to fix those, and _then_ drop your bombshell: there’s a much more fundamental problem with the patch, that needs a chunk of it to be completely rewritten – which means throwing away a lot of the nitpick fixes you’ve already made the developer do in that part of the patch.

Nothing says ‘your work is not wanted, and your time is not valued’ better than making someone do a lot of work and then making them throw it away. This might be enough to make the developer give up, all by itself.

### The Late-Breaking Design Review

An enormously complicated piece of work has been ongoing for weeks or months, in lots of separate patches. Half the work is already committed.

You personally don’t agree with the design of the entire piece of work, but you weren’t consulted in the original discussions. Or maybe you were, but you were on the losing side of the debate.

But now you’ve been asked to review a minor but important thing in the middle of it, like an easy fix for a bug that’s blocking lots of developers. This is your opportunity!

Demand justification for the entire design of the work so far. If the developer doesn’t know the answers, because they’re just working on one small part of the overall job, then shrug – that’s not your problem, and you’re not hitting the ‘Approve’ button until you’re satisfied.

If you’re really lucky, perhaps you can even manipulate this developer into undoing some of the already-done work, by giving a plausible excuse why it’s necessary. Carefully avoid letting them know where to find the design discussions that contradict you.

### The Catch-22

If there’s one big patch, then it’s too hard to read! Demand it be split up into self-contained sub-pieces.

On the other hand, if there are lots of little patches, then some of them make no sense on their own! So insist that they be glued back together.

With any large enough piece of work you can surely find a reason to make _one_ of those complaints; it’s just a matter of deciding which.

It doesn’t have to be ‘number of patches in the pull request’. You can do this one with any kind of tradeoff that seems relevant in the particular case. For example, if the code is written legibly, it probably has unacceptably poor performance – or if it’s well optimised, it’s unreadable and hard to maintain.

### The Flip Flop

There’s a type of change that people commonly make to the same part of the code, like adding an extra thing to a list. You’ve reviewed several of these changes before. Another one has just come along: the author has looked at the prior changes, carefully followed the existing pattern, and chosen you as a code reviewer because you’re clearly used to this area.

Keep everybody on their toes by suddenly objecting to an aspect of the change that you’ve never had a problem with before. Following the existing pattern just isn’t good enough! The author ought to have anticipated that you’ve recently changed your mind about what this type of change should look like.

What if the author points out your inconsistency, by showing the previous three identical changes where you didn’t raise this objection?

Then you say ‘You’re right, those should be changed too.’ Be careful not to take any personal responsibility – _you’re_ not volunteering to change all the existing cases. If you’re really lucky the developer will interpret this as instructions to change the existing cases themself, and then you’ve saved yourself a lot of effort.

## But seriously

_Don’t_ do these things! Try to minimise round trips, rather than maximising them. Ask for important rewrites (if needed) _before_ picking all the trivial nits. When you criticise the patch, make constructive suggestions about what version of it you _would_ accept. If you have opinions about the code base as a whole, raise them with all the developers in a general discussion, rather than being petty with the one developer whose patch you’re assigned to review. And if you do any of these things _by accident_, have some self-awareness about it: notice that you’ve made the developer’s life extra difficult by mistake, apologise, and try to compensate by being extra helpful. (Maybe even help to improve the actual code, either by writing your own revised version of this patch, or doing extra polishing in a followup patch of your own.)

### Authority

But if there’s a serious point to make here, I think it’s this. When one developer becomes the code reviewer for another one’s patch, that relationship creates temporary _authority_. The reviewer has the power to prevent that particular patch being committed, even if they don’t have any kind of authority over the patch submitter the rest of the time.

With authority comes responsibility. You’re supposed to use the authority only for its intended purpose, and only as much as necessary. In this case, that’s to make the patch as good as possible, according to whatever definition of ‘good’ the development team as a whole has agreed on.

So most of these antipatterns (or the milder behaviours that they’re caricaturing) are _abuses of authority_. The reviewer is using that temporary power over another developer as leverage to pursue some other personal agenda, perhaps independent of the goodness of the patch, or perhaps actively opposed to it.

The personal agenda in question varies between these antipatterns. It could be some unrelated piece of work the reviewer is in favour of; it could be personal stylistic preferences that the reviewer hasn’t been able to get the rest of the team to adopt; it could be laziness, taking advantage of the opportunity to write a one-line description of what you want and let someone else do the hard work; it could just be plain resistance to change, or perhaps even a personal dislike of the patch submitter.

And that dislike might be quite justifiable, if the patch submitter has done any of these bad behaviours when it was last _their_ turn to be the code reviewer! That’s another reason you should use the code reviewer’s authority sparingly. If developers manage to get locked into a cycle of revenge against each other, your software project is doomed.

### Gatekeeping code review

Up to this point, I’ve been focused on _peer_ code review. The code reviewer and the patch submitter are colleagues; neither is in charge of the other; neither has the final say over the code base in general. That’s why the authority you get in a code review is _temporary_: tomorrow, after this patch lands, you won’t have it any more. The day after that, it might be the other way round.

Also, in peer review situations, the code reviewer and the author are supposed to have basically the same goal. If there’s any serious disagreement about what features should go into the code at all, or how polished something needs to be before approval, or what the acceptable coding style is, it’s supposed to be dealt with outside the context of the code review.

But in other kinds of code review situation, that’s not quite the way it works. In particular, if an outsider to your software project sends you an unsolicited patch, that’s very different.

(This scenario usually comes up in free software, since anyone in the world can modify your source code, and some of them will try sending the changes back to you. But it can happen in other situations too – inside a company developing proprietary code, a developer in one team might try their luck sending a patch to another team’s project, if they particularly want a feature or fix that the other team hasn’t found effort for.)

In this situation, there’s a much bigger chance that the receiver of the patch will be unwilling to accept it at all, either because they don’t think that change should be made in the first place, or they disagree completely with the way it was done. And in this case, that’s _not_ an abuse of the temporary authority granted by being a peer reviewer: it’s a legitimate exercise of the _permanent_ authority of being the person or team in charge of the project. It’s my software project – I get to decide what direction it goes in.

When the code reviewer is in this ‘gatekeeping’ role, it’s not always wrong to criticise the patch on the grounds that it violates an existing general design principle or requirement (
The Guessing Game), without suggesting how the same problem could be solved better. Maybe I don’t _know_ how that problem could be solved in a way that’s consistent with the requirement. In fact, maybe that’s precisely the hard part, and the only reason why I haven’t already made the same change myself!

But even in a gatekeeping context, it’s rude to deploy ‘The Guessing Game’ _without explaining_. When I do this, I generally try to explain how the developer has overlooked the hard part, and if I don’t know the answer myself, I’ll say so.

## Others

In case you need a few more:

The Nitpicker's Gambit: The reviewer fixates on trivial style issues like whitespace, bracket placement, variable naming conventions etc. They make the developer conform perfectly to their preferred style, even if it's not specified in the team's coding guidelines.

The Silent Treatment: The reviewer provides no feedback at all for a long time after the review is requested, but does respond just often enough to keep the review "active". The author has to ping several times to get any response.

The Tunnel Vision: The reviewer only looks at the specific lines changed, without considering the broader context of the code. They suggest changes that are locally valid but deliberately inconsistent with the overall design or architecture.

The Ad Hominem: The reviewer makes snarky comments about the code in a way that implies the author is inexperienced and/or incompetent without directly saying so (and opening themselves to accusations of meanness).

The Philosophical Debate: The reviewer gets into a long back-and-forth debate in the review comments about a matter of opinion like whether inheritance or composition is better. The actual issue at hand gets lost in the abstract discussion.

## Notes

The death of a thousand round trips has an inverse where the reviewer points out everything they can find, and then the author fix just _one_ thing. You might think the author is motivated to minimize round trips, but maybe they will pull the reverse ransom note next where they threatens to find a different reviewer or subvert the code review somehow, because "it's an emergency and the patch needs to go in now".

When I review code, I'm always careful to prefix low-importance things with "[suggestion]" or "[nitpick]". These are small things like typos in comments that would not block me from approving the view.

One of the main things in code review is having extra eyes validate that nobody's putting obvious back doors in the code. If you've done that, you've brought some value even if you do nothing else. If a bug gets past the person authoring the code, it's not a huge shock that it'll get by someone who is not in that headspace, doing something else, and has a completely different context loaded. The idea that it wouldn't borders on magical thinking. But at least you don't see any "eval(base64_decode('big long string'))" today. The goal of reviewing is just to up your team's game a bit, not guarantee on their own that no bugs will make it to QA or prod or customers. They're part of the portfolio and shouldn't be treated as anything more.

Here are some solutions I've seen in various teams:

    For one-off reviews, set the expectation: The developer is _asking for feedback, and not permission_. He doesn't need to justify to the reviewer why he didn't incorporate all the changes. Don't give people pointless authority over others. This will solve most of the problems in the submission.

    For more structured/important reviews, a third party moderator decides on disputed code changes. If you can't have this, then insist on > 1 reviewers and state you'll only make changes if the reviewers have consensus. This often solves style issues.

    Changes I would like to see, but have not seen:

    Reviewers should not _ask questions_ - they should _state concerns_. So no "Why didn't you do this via X?". Instead, say "I think doing it via X instead of Y is better because ... ".

    And definitely banned: "Why did you solve it this way?"

Another one I see is the insistent nitpicker who never accepts comments on their own PRs.

FWIW:

1. Use a formatting tool and a linter in the build chain = zero formatting bullshit nitpicks.

2. Ask questions wherever possible rather than criticising. It's kinder and also less embarrassing when you thought you saw a bug and it wasn't.

3. This is the reviewer's chance to stay uptodate with the codebase.

4. This is the reviewee's chance to share blame for mistakes. Nobody who reviewed can crap on them for a bug discovered later. People who couldn't bother to review can't complain either.

5. Make positive comments whenever you can honestly do so - just reduces the stress and fosters goodwill.

6. People who behave like arseholes in PRs are usually the kind you don't want in your team. i.e. it's a way of detecting such people - see how they use a bit of power.

## Code review practices

### 1. Advocate for the Reviewee

#### _Approach each comment from the position of respect for author’s work and decisions_

Even when some of the author’s decisions appear to be “clearly suboptimal”, or straight up mistakes, assume the best intentions on their part. Spend some time advocating in your mind for the code you’re reading, challenging your own assumptions. If you understand where the author is coming from, acknowledge it before providing counterarguments.

### 2. Objectivity > Subjectivity

#### _Seek out objectivity in all arguments_

A comment asking for a change should make an objective case for it. When making a case, dig past personal preferences all the way down to objective underpinnings of your argument. A tiny nugget of strict objectivity is miles more effective than a 500-word opinion piece.

There’s one good kind of subjective comment: the code confuses you. Since the most important measure of maintainability is that code is clear for people on your team, “confusing” comment gets a special pass.

### 3. Conversation > Silence

#### _Subjectivity is welcome as long as it’s a discussion_

Sometimes we can’t help but voice a subjective opinion. In doing so, we must acknowledge that we have been unsuccessful in finding an objective argument, and are asking the author to indulge us for a moment. This is ok, as long as we present these opinions as topics for discussion, and not as something we insist on being implemented. Use the discussion as a tool to figure out the objective underpinnings behind your opinion. The team should support this exploration, and try to learn from it. Of course, be willing to accept that the discussion will not always result in your opinion making its way into the code.

### 4. Assume Competence

#### _Use question form when suggesting something seemingly obvious_

When you are suggesting something that appears obvious to you, it’s possible that you’re missing a problem that the author may have already discovered. If you don’t invite an explanation, the author may feel compelled to make the requested change, and work around the problem in some other way.

Instead, switch your statement into a genuine question. Let’s say you think code should be moved to another function.

- The original thought: “This code should be moved to function X due to [reasons].”
- The fake question form (don’t do this): “Could you move this code to function X due to [reasons]?”
- The genuine question form: “Have you considered moving this code to function X to avoid [reasons]?”

Notice how we are still being concise, and are still providing our solution. Except, now the author gets to choose. They can either explain why they did what they did (and maybe you’ll end up agreeing), or they can follow the request without wasting another round.

P.S. In my experience, this is the most powerful “hack” in this whole list. It’s incredibly easy to switch to a question form, not obscure any valuable info, and yet completely remove any sense of bitter judgement from your comment.

### 5. Care About Details

#### _It is not a waste of time to discuss a detail in depth_

Details can matter because technical debt tends to be a “death by a thousand cuts”. Besides, a discussion over a small detail can often be useful for other things, like establishing a rapport with someone. A self-conscious fear of wasting time could end up wasting more time than actually staying on topic.

### 6. Specific Examples > Generalizations

#### _Try to propose a concrete solution_

If possible, use pseudo-code or real code (untested is ok) to illustrate your points. If writing the code is not feasible, take time to make your comment easy to follow. This is especially important when collaborating across time zones.

### 7. Working Code > No Code

#### _Always respect working code_

If a fellow engineer submits a PR with a working and tested implementation, but you find that it could use a better architectural approach, this is a great problem to have. Now we can focus on refactoring this PR without worrying about implementation details, since they are already working and tested. This actually frees us to collaborate on reshaping the code’s architecture while maintaining the same logic.

### 8. Advocate for the Reviewer

#### _A code review itself is an original work_

When you are on the receiving end of a code review, treat the review itself as its author’s work. Even though they’re reviewing _your_ code, their review is _their_ original work. Instead of only focusing on the changes you’ve been asked to make, express some appreciation for comments that you found useful, or their effort to understand your code.

### 9. Use Complete Thoughts

#### _Fight the instinct to leave a quick one-liner_

It’s okay to use one-liners in a considerate way (i.e. as per point 4). However, if your one-liner is a short and dry change instruction, you are sending some bad signals, like:

- I don’t care whether you agree or disagree
- I don’t see you as my peer
- I don’t take code reviews (or reviewing _your_ code) seriously
- My time (writing) is worth more than your time (unpacking what I mean)
- Your mistake was obvious to me

Practices in this article will help you avoid sending these signals.

## Format for code review

Adhering to a consistent format improves reader's expectations and machine readability. Here's the format we propose:

    <label> [decorations]: <subject>
    [discussion]

- _label_ - This is a single label that signifies what kind of comment is being left.
- _subject_ - This is the main message of the comment.
- _decorations (optional)_ - These are extra decorating labels for the comment. They are surrounded by parentheses and comma-separated.
- _discussion (optional)_ - This contains supporting statements, context, reasoning, and anything else to help communicate the “why” and “next steps” for resolving the comment.

For example:

    ```
    **question (non-blocking):** At this point, does it matter which thread has won?

    Maybe to prevent a race condition we should keep looping until they've all won?
    ```

For a JSON representation:

    ```
    {
    "label": "question",
    "subject": "At this point, does it matter which thread has won?",
    "decorations": ["non-blocking"],
    "discussion": "Maybe to prevent a race condition we should keep looping until they've all won?"
    }
    ```

We strongly suggest using the following labels:
**praise:** Praises highlight something positive. Try to leave at least one of these comments per review. _Do not_ leave false praise (which can actually be damaging). _Do_ look for something to sincerely praise.
**nitpick:** Nitpicks are trivial preference-based requests. These should be non-blocking by nature.
**suggestion:** Suggestions propose improvements to the current subject. It's important to be explicit and clear on _what_ is being suggested and _why_ it is an improvement. Consider using patches and the _blocking_ or _non-blocking_ [decorations](https://conventionalcomments.org/#decorations) to further communicate your intent.
**issue:** Issues highlight specific problems with the subject under review. These problems can be user-facing or behind the scenes. It is strongly recommended to pair this comment with a `suggestion`. If you are not sure if a problem exists or not, consider leaving a `question`.
**todo:** TODO's are small, trivial, but necessary changes. Distinguishing todo comments from issues: or suggestions: helps direct the reader's attention to comments requiring more involvement.
**question:** Questions are appropriate if you have a potential concern but are not quite sure if it's relevant or not. Asking the author for clarification or investigation can lead to a quick resolution.
**thought:** Thoughts represent an idea that popped up from reviewing. These comments are non-blocking by nature, but they are extremely valuable and can lead to more focused initiatives and mentoring opportunities.
**chore:** Chores are simple tasks that must be done before the subject can be “officially” accepted. Usually, these comments reference some common process. Try to leave a link to the process description so that the reader knows how to resolve the chore.
**note:** Notes are always non-blocking and simply highlight something the reader should take note of.
**typo:** Typo comments are like **todo:**, where the main issue is a misspelling.
**polish:** Polish comments are like a **suggestion**, where there is nothing necessarily wrong with the relevant content, there's just some ways to immediately improve the quality.
**quibble:** Quibbles are very much like **nitpick:**, except it does not conjure up images of lice and animal hygiene practices.

### Decorations

Decorations give additional context for a comment. They help further classify comments which have the same label (for example, a security suggestion as opposed to a test suggestion).
@cheshirec
**suggestion (security):** I'm a bit concerned that we are implementing our own DOM purifying function here…
Could we consider using the framework instead?
Or
@cheshirec
**suggestion (test,if-minor):** It looks like we're missing some unit test coverage that the cat disappears completely.

Decorations may be specific to each organization. If needed, we recommend establishing a minimal set of decorations (leaving room for discretion) with no ambiguity.

Possible decorations include:
**(non-blocking)** A comment with this decoration **should not** prevent the subject under review from being accepted. This is helpful for organizations that consider comments blocking by default.
**(blocking)** A comment with this decoration **should** prevent the subject under review from being accepted, until it is resolved. This is helpful for organizations that consider comments non-blocking by default.
**(if-minor)** This decoration gives some freedom to the author that they should resolve the comment only if the changes ends up being minor or trivial.

Adding a decoration to a comment should improve understandability and maintain readability. Having a list of many decorations in one comment would conflict with this goal.

### Examples

FE1:
@hatter
**nitpick:** `little star` => `little bat`
Can we update the other references as well?
FE2:
@alice
**chore:** Let's run the `jabber-walk` CI job to make sure this doesn't break any known references.
Here are [the docs](https://en.wikipedia.org/wiki/Jabberwocky) for running this job. Feel free to reach out if you need any help!
FE3:
@cheshirec
**praise:** Beautiful test!

[Source](https://www.chiark.greenend.org.uk/~sgtatham/quasiblog/code-review-antipatterns/)

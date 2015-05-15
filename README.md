Measuring nesting level of popular Github repositories
======================================================

Introduction
------------

As code structure determines its function, the graphic design of code determines
its maintainability. Indentation, while necessary for visualizing the flow
control a program, is often assumed to be merely an aethestic appeal.
However, what if indentation can help determine unnecessary code complexity?
Abrupt code indentation tends to convolute control flow with minor details.
[1](http://www.perforce.com/resources/white-papers/seven-pillars-pretty-code)
Linus Torvalds thinks that greater than three levels of indentation is a code
smell which is part of a greater design flaw

> Now, some people will claim that having 8-character indentations makes
> the code move too far to the right, and makes it hard to read on a
> 80-character terminal screen.  The answer to that is that if you need
> more than 3 levels of indentation, you're screwed anyway, and should fix
> your program. [2](https://www.kernel.org/doc/Documentation/CodingStyle)

In python, indentation is a rule not a guideline, any python script with misaligned
code nesting will result in an `IndentationError: expected an indented block`.
Again in python if you `import this` you'll get "The Zen of Python," otherwise
known as [PEP20](https://www.python.org/dev/peps/pep-0020/), here is snippet from it:

> __Flat is better than nested.__

Studies by Noam Chomsky suggest that few people can understand more than three
levels of nested ifs [3](http://www.amazon.com/Managing-structured-techniques-Strategies-development/dp/0917072561),
and many researchers recommend avoiding nesting to more than four levels
[4](http://www.amazon.com/Software-Reliability-Principles-Glenford-Myers/dp/0471627658)
[5](http://www.amazon.com/Software-Engineering-Concepts-Professional-Vol/dp/0201122316%3FSubscriptionId%3D0JRA4J6WAV0RTAZVS6R2%26tag%3Dworldcat-20%26linkCode%3Dxm2%26camp%3D2025%26creative%3D165953%26creativeASIN%3D0201122316)

Jeff Atwood thinks that nesting code has a high
[cyclomatic complexity](https://en.wikipedia.org/wiki/Cyclomatic_complexity)
value which is a measure of how many distinct paths there are through code.
A lower cyclomatic complexity value correlates with more readable code,
and also indicates how well it can be properly tested.
[6](http://blog.codinghorror.com/flattening-arrow-code/)

Based on the research presented before us it ought to follow
that the popular repositories on Github that are actively maintained, with
a large community of collaborators will have source code that reduces abrupt nesting.
Why is this important? Rarely does readability seem to play an important role in most
undergraduate discussions when it can in fact be one of the most important
characteristics of widely used and maintainable code. Code that is only
understood by one person is code not worth maintaining -- and as a result poorly designed.
We argue in this study that the blockbuster libraries in web development attempt
to reduce the level of nesting in their code, whether implicitly or explicitly.

Methods
-------

We first start by finding the most popular javascript projects on Github.
The premise of using popular repositories is that the greater the number of stars
-- and thereby popularity -- the more likely the project is properly maintained,
readable, and easy to use.

https://api.github.com/search/repositories?sort=stars&q=language:javascript&page=1

We will also find the projects on Github with the most number of forks.
The premise of determining nesting levels of the highest forked repositories on
Github is that the greater the number of forks the more likely the code is easy
to maintain, read, and use.

https://api.github.com/search/repositories?sort=forks&q=language:javascript&page=1

After downloading each repository locally, we store their repository name,
number of stars, number of forks, and github URL in MongoDB for later analysis.

Once the repositories are downloaded, we scan the documents for all javascript files
and then measure their indentation level.  Indentation level is determined by
the number of space and tab characters in the left margin line-by-line.

We then measure the average, mode, and max level of nesting per repository and store them
in their corresponding repository document in MongoDB.

Results
-------

We downloaded 826 of the most popular javascript repositories on github.  The
total average indentation level for all repositories was `3.26`.  The total average
mode indentation level for all repositories was `2.74`.

![Avg indent over stars](http://i.imgur.com/LyWjNYn.png)
![Avg indent over forks](http://i.imgur.com/E2awxSr.png)

Replicate
---------

Requirements:
* NodeJS > 0.11
* Mongodb

```
git clone [git_url] [repo_name]
cd [repo_name]
npm install
```

`config.js` must be created with proper github personal token key and mongodb URI
to work properly.  `config_default.js` shows the overall structure.

Gulp tasks need to be executed in this order:

```
gulp popular
gulp forks
gulp download
gulp format
gulp nest
gulp save
```

References
----------

* https://www.safaribooksonline.com/library/view/code-complete-second/0735619670/ch19s04.html
* http://www.researchgate.net/profile/Warren_Harrison/publication/234829011_A_complexity_measure_based_on_nesting_level/links/0046351d2fe04ba1fd000000.pdf
* http://www.perforce.com/resources/white-papers/seven-pillars-pretty-code
* https://www.kernel.org/doc/Documentation/CodingStyle
* http://programmers.stackexchange.com/questions/52685/if-you-need-more-than-3-levels-of-indentation-youre-screwed
* https://en.wikibooks.org/wiki/Computer_Programming/Coding_Style/Minimize_nesting
* https://en.wikipedia.org/wiki/Code_Complete
* http://eflorenzano.com/blog/2012/01/02/reducing-code-nesting/
* https://news.ycombinator.com/item?id=3414526
* http://blog.codinghorror.com/flattening-arrow-code/
* http://c2.com/cgi/wiki?ArrowAntiPattern

Measuring nesting level of popular Github repositories
======================================================

Hypothesis
----------

As the popularity of a Github repository increases,
the lower the average level of nesting in the source code.

Summary
-------

Introduction
------------

As nesting code increases, the complexity of the application increases,
which reduces readability, maintainability, and ease of use.  It ought to follow
that the really popular repositories on Github that are actively maintained, with
a large community of collaborators will have lower levels of nesting.

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

We then measure the average and max level of nesting per repository and store them
in their corresponding repository document in MongoDB.

Results
-------

Analysis
--------

Conclusion
----------

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

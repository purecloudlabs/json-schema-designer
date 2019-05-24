# How to contribute

I'm really glad you're reading this... please help us. 😇

Simply create a Pull Request and one of the maintainers will take a look. If you're a maintainer, read below for publishing steps.

Thanks! ✨

## Submitting changes

Please send a [GitHub Pull Request](https://github.com/purecloudlabs/json-schema-designer/pulls) with a clear list of what you've done (read more about [pull requests](http://help.github.com/pull-requests/)). We can always use more test coverage. Please follow our coding conventions and make sure all of your commits are atomic (one feature per commit).

Always write a clear log message for your commits. One-line messages are fine for small changes, but bigger changes should look like this:

    $ git commit -m "A brief summary of the commit
    >
    > A paragraph describing what changed and its impact."

# Maintainers

## Testing

Always run tests before merging a PR or publishing. Pretty please.
5/23/2019: There are currently no meaningful tests implemented - they are coming soon!

    $ npm test

## Publishing
In order to publish, you need to be added to the npm project, and also a maintainer here on github.

    $ npm build
    $ git commit -am "version X.X.X"
    $ git tag -a vX.X.X -m "version X.X.X"
    $ npm publish


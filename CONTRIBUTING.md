# Contributor Guidelines

## Advice for new contributors

Start small. The PRs most likely to be merged are the ones that make small, easily reviewed changes with clear and
specific intentions.

It's a good idea to gauge interest in your intended work by finding or creating
a [GitHub Issue](https://github.com/oxen-io/websites/issues) for it.

You're most likely to have your pull request accepted if it addresses an
existing [GitHub Issue](https://github.com/oxen-io/websites/issues) marked with
the [good-first-issue](https://github.com/oxen-io/websites/labels/good%20first%20issue)
tag.

Of course, we encourage community developers to work on ANY issue, regardless of how it’s tagged, however, if you pick
up or create an issue without the “Good first issue” tag it would be best if you leave a comment on the issue so that
the team can give you any guidance required, especially around UI heavy features.

## Developer Tips

See the development section of the [README.md](README.md#development) in the root of the repository. And please read the
`README.md` of any app or package you are interested in contributing to.

## Tests

Please write tests! Each app and package has a `README.md` file that explains how to write and run tests for that app or
package.

You can run all tests at once with the following command:

```shell
pnpm test
```

## GitHub Actions

You can mock all the GitHub actions by running the following command:

```shell
pnpm gh
```

This will run the linting, type checking, unit tests, and build scripts for all apps and packages.

## Committing your changes

Before a commit is accepted the staged changes will be formatted using [prettier](https://prettier.io/) and linted
using [eslint](https://eslint.org/).

### Commit Message Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

Commit messages will be checked using [husky](https://typicode.github.io/husky/#/)
and [commitlint](https://commitlint.js.org/).

## Pull requests

So you want to make a pull request? Please observe the following guidelines.

- First, make sure that your `pnpm test` and `pnpm build` run passes - it's very similar to what our Continuous
  Integration servers do to test the app.
- Be sure to add and run tests!
- [Rebase](https://nathanleclaire.com/blog/2014/09/14/dont-be-scared-of-git-rebase/) your changes on the latest `dev`
  branch, resolving any conflicts. This ensures that your changes will merge cleanly when you open your PR.
- Make sure the diff between `dev` and your branch contains only the minimal set of changes needed to implement your
  feature or bugfix. This will make it easier for the person reviewing your code to approve the changes. Please do not
  submit a PR with commented out code or unfinished features.
- Avoid meaningless or too-granular commits. If your branch contains commits like the lines of "Oops, reverted this
  change" or "Just experimenting, will delete this later",
  please [squash or rebase those changes away](https://robots.thoughtbot.com/git-interactive-rebase-squash-amend-rewriting-history).
- Don't have too few commits. If you have a complicated or long-lived feature branch, it may make sense to break the
  changes up into logical atomic chunks to aid in the review process.
- Provide a well written and nicely formatted commit message.
  See [this blog post](http://chris.beams.io/posts/git-commit/) for some tips on formatting. As far as content, try to
  include in your summary
    1. What you changed
    2. Why this change was made (including git issue # if appropriate)
    3. Any relevant technical details or motivations for your implementation choices that may be helpful to someone
       reviewing or auditing the commit history in the future. When in doubt, err on the side of a longer commit
       message. Above all, spend some time with the repository. Follow the pull request template added to your pull
       request description automatically. Take a look at recent approved pull requests, see how they did things.

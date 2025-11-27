> [!NOTE]
> We prefer English language for all communication.

## Creating an issue

Before creating an issue please ensure that the problem is not [already reported](https://github.com/it-incubator/musicfun-react-all-stacks/issues).

If you want to report a bug, create a reproduction using StackBlitz or CodeSandbox. If you want to request a feature, add motivation section and some usage examples.

## Sending a Pull Request

1. fork and clone the repository
> [!NOTE]
> You can just clone the repository if you are a collaborator 
2. create a development branch from `main`
3. run the following command in the project root (this will install dependencies for all apps and packages)
> [!NOTE]
> It is recommended to create a branch from the issue  
4. [make changes](#coding-guide) and [commit them](#commit-messages)
5. upload feature branch and create a [Pull Request](https://github.com/it-incubator/musicfun-react-all-stacks/compare) to merge changes to `main`
6. link your PR to the issue using a [closing keyword](https://help.github.com/en/articles/closing-issues-using-keywords) or provide changes description with motivation and explanation in the comment (example: `fix #74`)
7. wait until a team member responds

## Coding guide
<!-- - always use `@ts-expect-error` instead of `@ts-ignore` -->
- use `// @ts-ignore` if you not sure why error appears or you think it could be better, use `// @ts-expect-error` if you sure that error is a mistake <!-- ??? -->

## Commit messages

Commit messages should follow the [Conventional Commits](https://conventionalcommits.org) specification:

```
<type>[optional scope]: <description>
```

### Allowed `<type>`

- `chore`: any repository maintainance changes
- `feat`: code change that adds a new feature
- `fix`: bug fix
- `perf`: code change that improves performance
- `refactor`: code change that is neither a feature addition nor a bug fix nor a performance improvement
- `docs`: documentation only changes
- `ci`: a change made to CI configurations and scripts
- `style`: cosmetic code change
- `test`: change that only adds or corrects tests
- `revert`: change that reverts previous commits

### Allowed `<scope>`

Package directory name. Eg: `/packages/effects` is scoped as `effects`.

### `<description>` rules

- should be written in English
- should be in imperative mood (like `change` instead `changed` or `changes`)
- should not be capitalized
- should not have period (`.`) at the end

### Commit message examples

```
docs: fix typo in npm-react
fix(core): add check for atoms with equal ids
```

# Contributing to Stream Deck Icons

First off, thank you for considering contributing to this project! Your help is greatly appreciated.

## How to Contribute

We use a system of conventional commits to automate versioning and releases. When you contribute, it's important that your commit messages follow this specification.

### Commit Message Format

Each commit message consists of a **header**, a **body** and a **footer**. The header has a special format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

### Type

The type must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation
- **revert**: Reverts a previous commit

### Examples

Here are some examples of commit messages:

- **feat(icons): add new icon set for Adobe products**
- **fix(picker): resolve issue where color picker would not update**
- **docs(readme): update installation instructions**
- **chore(release): 1.0.0**

By following this convention, we can automatically generate changelogs and determine the next version number for the project.

### Pull Requests

Please create a pull request with your changes. Ensure your branch is up-to-date with the `main` branch before submitting. All pull requests will be reviewed before being merged.

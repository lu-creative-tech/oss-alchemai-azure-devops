# Contributing to AlchemAI

Thank you for your interest in contributing! This document describes how to contribute to AlchemAI. It follows the [Devoteam Luxembourg Open Source Standards](https://github.com/lu-creative-tech/oss-standards/blob/main/CONTRIBUTING_PROJECT.md).

## Code of Conduct

This project adheres to our [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Report unacceptable behavior using [GitHub Discussions](https://github.com/lu-creative-tech/oss-standards/discussions).

## How Can I Contribute?

### Reporting Bugs

Before creating a bug report:

- Check the [existing issues](https://github.com/lu-creative-tech/oss-alchemai-azure-devops/issues)
- Make sure you're using the latest version
- Collect relevant information (version, Azure DevOps Services or Server version, browser, error messages, reproduction steps)

**Use the following template** when creating an issue:

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Environment:**
- AlchemAI version: [e.g., 1.0.0]
- Azure DevOps: [e.g., Services, or Server 2022]
- Browser: [e.g., Edge 130]
- Function App runtime: [e.g., Node.js 22.x]

**Additional context**
Add any other context about the problem.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. Provide:

- A clear use case and motivation
- A specific proposal or examples
- Why this benefits the broader community

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following the coding standards below
3. **Add tests** for new functionality, if applicable
4. **Update documentation** as needed
5. **Make sure tests pass** and code is properly formatted
6. **Submit your pull request**

## Spec-Driven Development

AlchemAI uses [Spec Kit](https://github.com/github/spec-kit). Every change must comply with the project
[constitution](./.specify/memory/constitution.md).

New features and significant changes start as a spec before any code:

1. `/speckit-specify` describes what the feature does and why, in `specs/<feature>/spec.md`
2. `/speckit-clarify` (optional) resolves open questions in the spec
3. `/speckit-plan` produces the technical plan and checks it against the constitution
4. `/speckit-tasks` breaks the plan into tasks
5. `/speckit-implement` implements the tasks

Commit the spec, plan and tasks together with the code in the same pull request. Bug fixes and small
changes don't need a spec.

To set up Spec Kit locally, install [uv](https://docs.astral.sh/uv/) and the CLI:

```powershell
uv tool install specify-cli
```

## Development Setup

### Local Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/oss-alchemai-azure-devops.git
cd oss-alchemai-azure-devops

# Add upstream remote
git remote add upstream https://github.com/lu-creative-tech/oss-alchemai-azure-devops.git
```

Build and test instructions will be added with the first MVP.

### Standards

- Follow the TypeScript style used in the codebase
- Write clear, self-documenting code
- Add comments only for non-obvious logic
- Keep functions small and focused
- Use meaningful variable and function names
- Never commit secrets, API keys, or `local.settings.json`

## Git Workflow

### Branch Naming

- Feature: `feature/short-description`
- Bug fix: `fix/issue-number-short-description`
- Documentation: `docs/short-description`
- Refactoring: `refactor/short-description`

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): subject

body

footer
```

**Types**:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Example**:

```
feat(repos): draft PR description from diff

Adds the "Draft description" action to the PR details page and the
matching Function App endpoint.

Closes #123
```

### Pull Request Process

1. **Update your branch** with the latest upstream changes:

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push to your fork**:

   ```bash
   git push origin feature/your-feature
   ```

3. **Open a pull request** on GitHub with:
   - A clear title describing the change
   - A reference to related issues
   - A description of what changed and why
   - Screenshots for UI changes, if applicable
   - Any breaking changes highlighted

4. **Address review feedback**:
   - Respond to all comments
   - Make the requested changes
   - Push updates (no force-push during review)

5. **Squash commits** if requested before merge

### PR Review Criteria

Your PR will be reviewed for:

- ✅ Code quality and style compliance
- ✅ Documentation updates
- ✅ No breaking changes (or properly documented/versioned)
- ✅ Performance implications considered
- ✅ Security implications reviewed

### README Updates

Update `README.md` when:

- Adding new features
- Changing configuration options
- Modifying installation steps
- Adding new dependencies

## Getting Help

Via [GitHub Discussions](https://github.com/lu-creative-tech/oss-standards/discussions).

## Recognition

Contributors are recognized in [CONTRIBUTORS.md](./CONTRIBUTORS.md) and in release notes.

Thank you for contributing! 🎉

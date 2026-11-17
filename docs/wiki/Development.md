# Development

How to work on AlchemAI itself. Read the [Contributing Guide](https://github.com/lu-creative-tech/oss-alchemai-azure-devops/blob/main/CONTRIBUTING.md) first.

## Prerequisites

- Node.js 24 (see `.nvmrc`); Node.js 22.13+ also works
- npm 10+
- Git

## Workspace

The repository is an npm workspaces monorepo:

| Package | Path | Purpose |
| --- | --- | --- |
| `@alchemai/contracts` | `packages/contracts` | Shared typed contracts |
| `@alchemai/backend` | `packages/backend` | Azure Function App |
| `@alchemai/extension` | `packages/extension` | Azure DevOps extension |

All packages use strict TypeScript from `tsconfig.base.json`, one ESLint config and one Vitest run.

## Commands

```bash
npm ci              # install all packages
npm run typecheck   # tsc -b across all packages
npm run lint        # ESLint, zero warnings allowed
npm test            # Vitest across all packages
npm run test:watch  # Vitest in watch mode
```

Lint fails on `any`, non-null assertions (`!`) and on `backend` and `extension` importing each other.

## CI checks

Every pull request to `main` must pass:

| Check | What it does |
| --- | --- |
| `typecheck` | `npm run typecheck` |
| `lint` | `npm run lint` |
| `test` | `npm test` |
| `dependency-review` | Fails on moderate or higher vulnerabilities and disallowed licenses |
| `secret-scan` | gitleaks over the PR's commits |
| `CodeQL` | Static analysis for JavaScript and TypeScript |

## Spec-driven workflow

Features are specified and planned with [Spec Kit](https://github.com/github/spec-kit) before implementation. Each feature has a folder under `specs/` with `spec.md`, `plan.md`, `tasks.md` and design notes. See the Contributing Guide for the commands.

## Testing the extension locally

> **Status:** planned in [#4](https://github.com/lu-creative-tech/oss-alchemai-azure-devops/issues/4).

- **Local harness:** a page on the extension dev server (`https://localhost:3000/harness.html`) renders the real extension components with a fake Azure DevOps adapter and sample data. No Azure DevOps needed; Accept shows what would be written.
- **Dev extension in real Azure DevOps:** a private dev copy of the extension (`alchemai-dev`) whose base URL is `https://localhost:3000`, published once and shared only with our org. Azure DevOps loads the UI from your machine, so a code change is a page reload. Accept writes to real Azure DevOps, so use a test project.
- **Local backend:** run the Function App locally over HTTPS with CORS allowing `https://localhost:3000`.

## Trying features against a real organization

> **Status:** planned in [#5](https://github.com/lu-creative-tech/oss-alchemai-azure-devops/issues/5).

A local command reads a real PR, runs the same feature code as the endpoint and prints the draft. It never writes to Azure DevOps.

```bash
npm run try -- pr-description --org <org> --project <project> --repo <repo> --pr <id>
```

## Secrets for local work

All local secrets (a read-only Azure DevOps PAT, the Claude API key) go in a git-ignored `.env` file. Copy `.env.example` and fill in the values. Never pass secrets on the command line or as inline environment variables. Automated tests never need real keys; they use the fake agent adapter.

## Editing this wiki

The wiki is generated from `docs/wiki/` in the repository and published on every merge to `main`. Edit the Markdown files there through a pull request; changes made directly in the GitHub wiki are overwritten.

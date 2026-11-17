# Feature Specification: Foundation

**Feature Branch**: `feature/3-foundation`

**Created**: 2026-11-05

**Status**: Draft

**Input**: GitHub issue #3 "Foundation": "Monorepo and CI so every later phase builds, tests and gets scanned.
Set up the monorepo with npm workspaces: `contracts`, `backend`, `extension`, strict TypeScript, ESLint,
Vitest. Add CI: typecheck, lint, tests, CodeQL, Dependabot, secret scanning."

## User Scenarios & Testing *(mandatory)*

The users of this feature are contributors and maintainers. It ships no end-user functionality.

### User Story 1 - Contributor builds and tests locally (Priority: P1)

A contributor clones the repository, installs dependencies once, and runs a single command each to
typecheck, lint and test every package.

**Why this priority**: Every later feature (PR drafts, acceptance criteria, configuration page) is
built on this workspace. Nothing else can start without it.

**Independent Test**: On a clean clone, run install, typecheck, lint and test from the repository
root; all succeed and each of the three packages is visibly checked.

**Acceptance Scenarios**:

1. **Given** a clean clone and a supported Node.js version, **When** the contributor installs
   dependencies from the root, **Then** all three packages are installed in one step with a single
   lockfile.
2. **Given** an installed workspace, **When** the contributor runs the root typecheck, lint and test
   commands, **Then** each command covers `contracts`, `backend` and `extension` and exits successfully.
3. **Given** code that uses `any`, a non-null assertion or a type error, **When** typecheck or lint
   runs, **Then** it fails and names the file and line.
4. **Given** `backend` or `extension`, **When** it imports from `contracts`, **Then** the import
   resolves and is type-checked against the `contracts` source.

---

### User Story 2 - Pull requests are checked automatically (Priority: P1)

When a pull request is opened or updated, CI runs typecheck, lint and tests and reports each as a
separate status check, so a maintainer can require them before merging.

**Why this priority**: The constitution's quality gates require these checks to pass before merge.

**Independent Test**: Open a pull request with a deliberate lint error; the lint check fails while
the others pass. Fix it; all checks pass.

**Acceptance Scenarios**:

1. **Given** a pull request targeting `main`, **When** it is opened or updated, **Then** typecheck,
   lint and test checks run and report pass or fail individually.
2. **Given** a push to `main`, **When** CI runs, **Then** the same checks run against `main`.
3. **Given** a failing check, **When** a maintainer views the PR, **Then** the failure output
   identifies the failing package and file.

---

### User Story 3 - Code and dependencies are scanned (Priority: P2)

Every pull request and `main` are scanned for code vulnerabilities (SAST), vulnerable or
disallowed-license dependencies (SCA) and committed secrets. Dependency updates are proposed
automatically.

**Why this priority**: Required by Constitution Principles VII and VIII before any code handling
tokens or source code is added; it can follow the build checks by a small margin.

**Independent Test**: Push a branch containing a fake secret in a test fixture; the secret scan
fails. Confirm CodeQL results appear in the repository's security tab and Dependabot opens update
PRs on its schedule.

**Acceptance Scenarios**:

1. **Given** a pull request, **When** it is opened, **Then** CodeQL analyzes the TypeScript code and
   reports results.
2. **Given** a pull request that adds a dependency with a known vulnerability or a license outside
   the allowed list, **When** CI runs, **Then** the dependency review check fails.
3. **Given** a commit that contains a credential-like string, **When** CI runs, **Then** the secret
   scan check fails.
4. **Given** outdated npm packages or GitHub Actions, **When** the Dependabot schedule runs,
   **Then** grouped update pull requests are opened.

### Edge Cases

- A contributor uses an unsupported Node.js version: install warns or fails with the required version.
- A package has no tests yet: the test command still succeeds for the packages that do, and each
  package ships at least one smoke test so the pipeline is never vacuously green.
- A pull request from a fork: checks run with read-only permissions and no repository secrets.
- `backend` imports from `extension` (or the reverse): typecheck fails.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The repository MUST be an npm workspaces monorepo with exactly three packages:
  `contracts`, `backend`, `extension`.
- **FR-002**: All packages MUST use TypeScript with `strict` mode, sharing one base configuration.
- **FR-003**: `backend` and `extension` MAY depend on `contracts`; they MUST NOT depend on each other.
- **FR-004**: ESLint MUST run across all packages with type-aware rules that reject `any` and
  non-null assertions.
- **FR-005**: Vitest MUST run the tests of all packages from one root command.
- **FR-006**: The root MUST expose `typecheck`, `lint` and `test` scripts.
- **FR-007**: CI MUST run typecheck, lint and test on every pull request to `main` and every push to
  `main`, as separately reported checks.
- **FR-008**: CI MUST run CodeQL (SAST) for JavaScript/TypeScript on pull requests, pushes to `main`
  and on a weekly schedule.
- **FR-009**: CI MUST run dependency review (SCA) on pull requests, failing on known vulnerabilities
  and on licenses outside MIT, Apache-2.0, BSD-2-Clause, BSD-3-Clause, ISC, 0BSD and BlueOak-1.0.0;
  any other license is allowed only per named package, with the reason recorded in research.md.
- **FR-010**: CI MUST run a secret scan on pull requests and pushes to `main`.
- **FR-011**: Dependabot MUST propose weekly updates for npm packages and GitHub Actions.
- **FR-012**: CI workflows MUST run with least-privilege permissions and pin third-party actions to
  a full commit SHA.
- **FR-013**: `CONTRIBUTING.md` and the README "Getting started" section MUST describe how to
  install, typecheck, lint and test.
- **FR-014**: The repository MUST contain wiki pages in `docs/wiki/` explaining the architecture,
  each component, configuration, setup, usage, security and development, marking planned parts as
  planned, and a workflow MUST publish them to the GitHub wiki on every merge to `main`.

### Key Entities

- **Workspace package**: one of `contracts`, `backend`, `extension`; has a name, a TypeScript
  project, tests and an allowed set of internal dependencies.
- **CI check**: a named status check reported on a pull request (typecheck, lint, test, CodeQL,
  dependency review, secret scan).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A contributor goes from a clean clone to green typecheck, lint and test locally with
  four commands (install plus three checks).
- **SC-002**: All six CI checks report on a pull request within 10 minutes.
- **SC-003**: A deliberately introduced type error, lint violation, failing test, fake secret and
  disallowed-license dependency each make exactly the corresponding check fail.
- **SC-004**: Dependabot opens its first update pull requests within one week of merge.

## Assumptions

- GitHub is the hosting and CI platform (GitHub Actions); the repository is public, so CodeQL and
  secret scanning are available at no cost.
- Packages contain only placeholder source and smoke tests; real features come in later issues.
- The Azure Functions runtime and the Azure DevOps Extension SDK are not added here; `backend` and
  `extension` get those dependencies with their first feature.
- Enabling GitHub secret scanning, push protection and branch protection rules are repository
  settings applied by a maintainer, documented in the quickstart.
- No data is sent to any model and no Azure DevOps resource is written by this feature.

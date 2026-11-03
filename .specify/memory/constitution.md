# AlchemAI Constitution

AlchemAI is an MIT-licensed Azure DevOps extension with a self-hosted backend that adds AI drafting
inside Azure DevOps. These principles apply to every feature, current and future; which features
exist and what each one does is defined in the README and in feature specs, not here.

## Core Principles

### I. Review Before Apply (NON-NEGOTIABLE)

- Every AI output MUST be presented to the user as an editable draft.
- AlchemAI MUST NOT write to any Azure DevOps resource until the user explicitly accepts the draft.
- Accepting MUST write exactly what the user saw and approved, including any edits they made.
- Rejecting or closing a draft MUST leave Azure DevOps unchanged.

**Rationale**: AI output can be wrong; the user stays accountable for what is published, so the user
must stay in control of every write.

### II. Keys and Data Stay Server-Side (NON-NEGOTIABLE)

- Model and agent API keys MUST be stored only in the Function App (app settings backed by Azure Key
  Vault or equivalent), never in the browser, the extension package, extension data storage or source
  control.
- The extension MUST call only the configured Function App; it MUST NOT call model providers directly.
- Each feature MUST send the model only the minimum data it needs (GDPR data minimization), and the
  data sent per feature MUST be documented in that feature's spec.
- Prompts, diffs, logs and model responses MUST NOT be persisted by the backend beyond the request,
  unless a feature spec explicitly requires it and documents retention.

**Rationale**: Organizations adopt AlchemAI because their code, keys and data remain under their
control.

### III. Admin Control

- Every setting that affects where data is sent, how callers authenticate or how AI output is
  produced MUST be controlled by an administrator, never by individual users.
- Settings MUST have a defined scope (organization or project); a project-scoped value MUST take
  precedence over the organization value.
- Settings that shape AI output MUST be applied server-side.
- Missing or invalid configuration MUST produce a clear message, never a silent failure or a
  fallback to an unconfigured endpoint.
- Each feature spec MUST state which settings it reads and their scope.

**Rationale**: Admins decide where AlchemAI runs, who can use it and how it writes, whatever features
are added over time.

### IV. Agent-Agnostic Backend

- The backend MUST expose one endpoint per feature.
- Feature code MUST depend only on an agent adapter interface, never on a specific agent SDK.
- Adding an agent MUST require only a new adapter and configuration, with no change to feature code.
- Request and response contracts between extension and backend MUST be typed and versioned.

**Rationale**: Organizations have different approved AI providers; AlchemAI must not lock them in.

### V. Type Safety and Simplicity

- All code MUST be TypeScript with `strict` mode enabled; `any` and non-null assertions require a
  justified exception in review.
- Modules MUST be small and focused on a single responsibility.
- Code MUST be self-explanatory; comments are allowed only for a non-obvious why, kept to one short
  line.
- New abstractions, layers or dependencies MUST be justified by a current requirement (YAGNI).

**Rationale**: A small, typed, readable codebase is easier for open source contributors to review
and maintain.

### VI. Testing

- Feature logic and prompt building MUST have unit tests.
- Authentication flows and every backend endpoint MUST have integration tests.
- Agent adapters MUST be testable with a fake adapter; tests MUST NOT call real model providers or
  require real keys.
- All tests MUST pass in CI before a pull request can be merged.

**Rationale**: Prompt and contract regressions are silent in production; tests are the only reliable
guard.

### VII. Security

- Development MUST follow the
  [Devoteam Luxembourg OSS Security Guidelines](https://github.com/lu-creative-tech/oss-standards/blob/main/SECURITY.md)
  and the OWASP Top 10.
- All inputs to the backend MUST be validated (size, type, format), including data read from Azure
  DevOps and model responses before they are returned as drafts.
- Every backend endpoint MUST authenticate the caller using the configured authentication type.
- Errors returned to users MUST NOT expose internal details, keys or stack traces.
- CI MUST run static analysis (SAST), dependency scanning (SCA) and secret scanning.
- Secrets, credentials and `local.settings.json` MUST NOT be committed to git.

**Rationale**: AlchemAI handles source code and access tokens; a vulnerability would expose both.

### VIII. Dependencies and Licensing

- Dependencies MUST use permissive licenses (MIT, Apache-2.0, BSD).
- GPL or AGPL dependencies MUST NOT be added without OSP review, per the
  [Licensing Guidelines](https://github.com/lu-creative-tech/oss-standards/blob/main/LICENSING.md).
- Dependencies with unclear, missing or custom licenses MUST NOT be used.
- Dependencies MUST be kept updated, and known vulnerabilities MUST be patched before release.
- Every new dependency MUST be justified in the pull request (maintenance status, license, size).

**Rationale**: AlchemAI is MIT-licensed and published on the Marketplace; dependencies must keep it
freely redistributable and secure.

### IX. Workflow and Versioning

- Commit messages and pull request titles MUST follow
  [Conventional Commits](https://www.conventionalcommits.org/).
- Branches MUST follow the naming rules in [CONTRIBUTING.md](../../CONTRIBUTING.md).
- The extension and backend MUST follow Semantic Versioning; breaking changes to the
  extension–backend contract require a MAJOR version.
- `CHANGELOG.md` MUST be updated for every release, including security fixes.

**Rationale**: Predictable history and versions let admins upgrade the extension and backend safely.

## Technology Stack and Constraints

- **Extension**: TypeScript, Azure DevOps Extension SDK, published to the Visual Studio Marketplace.
- **Backend**: Azure Functions on Node.js (active LTS), TypeScript.
- **Agents**: behind the agent adapter interface (Principle IV); available adapters are listed in the
  README.
- **Platforms**: Azure DevOps Services; Azure DevOps Server support is decided per feature spec.
- **License**: MIT. All contributions are accepted under the project license.
- **Standards**: the project follows the
  [Devoteam Luxembourg Open Source Standards](https://github.com/lu-creative-tech/oss-standards).

## Quality Gates

A pull request MUST NOT be merged unless:

1. It has been reviewed and approved by a maintainer (see `.github/CODEOWNERS`).
2. Type checking, linting, unit tests and integration tests pass in CI.
3. SAST, dependency and secret scans pass, or findings are triaged and documented.
4. Any write to Azure DevOps it introduces goes through the review-before-apply flow (Principle I).
5. Any new data sent to a model is documented in the feature spec (Principle II).
6. Documentation and README are updated when features, configuration or setup change.

A release MUST NOT be published unless the
[Security Checklist for Releases](https://github.com/lu-creative-tech/oss-standards/blob/main/SECURITY.md#security-checklist-for-releases)
is complete.

## Governance

- This constitution supersedes all other project practices. Where `CONTRIBUTING.md` or other
  guidance conflicts with it, the constitution wins.
- Amendments MUST be proposed by pull request, approved by a maintainer, and include a version bump
  and an updated **Last Amended** date.
- Versioning: MAJOR for removing or redefining a principle, MINOR for adding a principle or materially
  expanding guidance, PATCH for clarifications and wording.
- Every pull request review MUST check compliance with this constitution; deviations MUST be
  justified in the pull request and in the plan's complexity tracking.
- Feature specs, plans and tasks generated with Spec Kit MUST pass the constitution check before
  implementation.

**Version**: 1.0.0 | **Ratified**: 2026-11-03 | **Last Amended**: 2026-11-03

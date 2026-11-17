# Contract: CI status checks

Branch protection on `main` requires these check names. Job names (`jobs.<id>.name`) must stay
stable; renaming one silently drops it from required checks.

| Required check | Workflow file | Job id |
| --- | --- | --- |
| `typecheck` | `.github/workflows/ci.yml` | `typecheck` |
| `lint` | `.github/workflows/ci.yml` | `lint` |
| `test` | `.github/workflows/ci.yml` | `test` |
| `secret-scan` | `.github/workflows/ci.yml` | `secret-scan` |
| `dependency-review` | `.github/workflows/ci.yml` | `dependency-review` (PR only) |
| `CodeQL` | `.github/workflows/codeql.yml` | `analyze` (reported via code scanning) |

Workflow rules:

- Top-level `permissions: contents: read`; jobs elevate only what they need
  (`security-events: write` for CodeQL, `pull-requests: write` only if dependency review comments).
- Third-party actions pinned to a full commit SHA with a `# vX.Y.Z` comment.
- `concurrency` group per workflow and ref, cancelling in-progress runs for PRs.
- Every job sets `timeout-minutes`.
- Fork PRs run with no secrets; no job may depend on repository secrets.

# Quickstart: Foundation validation

Proves the workspace and CI work end to end. Script names: [contracts/scripts.md](./contracts/scripts.md);
check names: [contracts/ci-checks.md](./contracts/ci-checks.md).

## Prerequisites

- Node.js 24 (or 22), npm 10+
- Git, and maintainer access to the GitHub repository for the settings step

## 1. Local checks (US1)

```powershell
git clone https://github.com/lu-creative-tech/oss-alchemai-azure-devops.git; cd oss-alchemai-azure-devops
npm ci
npm run typecheck
npm run lint
npm test
```

Expected: all four succeed; Vitest output lists the `contracts`, `backend` and `extension` projects.

## 2. Negative local checks (US1)

Make each change temporarily, run the matching script, confirm it fails, then revert.

| Change | Script | Expected |
| --- | --- | --- |
| `const x: number = "a";` in `packages/backend/src/index.ts` | `typecheck` | fails with file and line |
| `let y: any;` in any package | `lint` | fails on `no-explicit-any` |
| `foo!.bar` in any package | `lint` | fails on `no-non-null-assertion` |
| `import "@alchemai/extension"` in `packages/backend` | `lint` | fails on `no-restricted-imports` |
| `expect(1).toBe(2)` in a smoke test | `test` | fails |

## 3. Repository settings (maintainer, one time)

- Settings → Advanced Security (`/settings/security_analysis`): enable Dependabot alerts, secret
  scanning and push protection; keep CodeQL **default setup disabled** (the `codeql.yml` workflow
  is used instead, and GitHub rejects its results while default setup is on).
- Settings → Branches → `main`: require a PR, one approval from CODEOWNERS, and the checks in
  [ci-checks.md](./contracts/ci-checks.md).

## 4. CI checks (US2, US3)

1. Open a PR from this branch: all six checks appear and pass.
2. Push a commit with a lint error: only `lint` fails. Revert.
3. Push a commit adding a fake credential to a fixture: `secret-scan` fails. Remove it and rewrite
   the commit so it does not stay in history.
4. Add a dependency with a disallowed license (e.g. a GPL package) on a throwaway branch: the
   `dependency-review` check fails. Delete the branch.
5. After merge: CodeQL results appear under Security → Code scanning; within a week Dependabot opens
   grouped update PRs.

# Contract: Root npm scripts

Contributors, CI and later features rely on these root scripts. Renaming or removing one is a
breaking change to the contributor workflow and must update CI and `CONTRIBUTING.md` in the same PR.

| Script | Command | Scope | Exit code |
| --- | --- | --- | --- |
| `typecheck` | `tsc -b` | all project references | non-zero on any type error |
| `lint` | `eslint . --max-warnings 0` | all packages and root config files | non-zero on any error or warning |
| `test` | `vitest run` | all `packages/*` Vitest projects | non-zero on any failed test |
| `test:watch` | `vitest` | same as `test` | interactive |

Rules:

- Scripts run from the repository root after `npm ci` (or `npm install`).
- No script may require network access beyond install, real model keys or Azure resources
  (Constitution Principle VI).
- Per-package scripts are optional; the root scripts are the contract.

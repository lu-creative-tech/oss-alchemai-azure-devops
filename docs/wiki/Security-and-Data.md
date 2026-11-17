# Security and Data

AlchemAI handles source code and access tokens, so it is designed to keep both under your control.

## Keys

- Model and agent API keys live **only** in the Function App, in app settings backed by Azure Key Vault.
- Keys are never in the browser, the extension package, extension data storage or source control.
- Locally, developers keep keys in a git-ignored `.env` file; only `.env.example` with placeholder names is committed.

## Data sent to the model

- Each feature sends only the minimum data it needs (GDPR data minimization). The data each feature sends is documented in its spec under `specs/`.
- The extension reads data with the **user's own** Azure DevOps permissions, so users can only draft from what they can already see.
- The backend does not persist prompts, diffs, logs of content or model responses beyond the request.

| Feature | Expected data sent to the model |
| --- | --- |
| PR title and description | PR diff, trimmed to a size limit |
| Acceptance criteria | Work item title and description |

This table is expected, not final: it is confirmed or corrected as each feature spec is written.

## Writes to Azure DevOps

AlchemAI never writes on its own. Writes happen only from the extension, only after the user clicks **Accept**, and contain exactly what the user approved.

## Backend hardening

- Every endpoint (except `/health`) authenticates the caller with the configured authentication type.
- All input is validated for size, type and format, including model responses before they are returned.
- Errors returned to users never contain internal details, keys or stack traces.

## Code and dependency scanning

Every pull request runs:

| Check | Tool |
| --- | --- |
| Static analysis (SAST) | CodeQL, `security-extended` queries |
| Dependency vulnerabilities and licenses (SCA) | GitHub dependency review; only MIT, Apache-2.0, BSD, ISC, 0BSD and BlueOak-1.0.0 licenses are allowed, plus named exceptions for test-only tooling |
| Secret scanning | gitleaks, plus GitHub secret scanning with push protection |
| Dependency updates | Dependabot, weekly |

## Reporting a vulnerability

See [SECURITY.md](https://github.com/lu-creative-tech/oss-alchemai-azure-devops/blob/main/SECURITY.md). Do not open a public issue for security problems.

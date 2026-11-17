# Configuration

> **Status:** planned; the settings hub with endpoint and authentication type arrives with [#4](https://github.com/lu-creative-tech/oss-alchemai-azure-devops/issues/4).

AlchemAI is configured by administrators, never by individual users. Any setting that affects where data goes, how callers authenticate or how output is produced is admin-only.

## Settings

| Setting | Scope | Stored in | Used by | Status |
| --- | --- | --- | --- | --- |
| Function App endpoint URL | Organization | Extension Data Service | Extension | **MVP** |
| Authentication type | Organization | Extension Data Service | Extension and backend | **MVP** |
| Agent type | Organization | Function App settings | Backend | Planned |
| Enabled per project | Project | Extension Data Service | Extension | Planned |
| Style, language, extra instructions | Organization, overridable per project | Function App | Backend | Planned |
| Model and agent API keys | Function App only | Key Vault-backed app settings | Backend | **MVP** |

## Scope and precedence

- Every setting has a defined scope: **organization** or **project**.
- A **project** value overrides the **organization** value.
- Settings that shape AI output are applied **server-side**.

## Missing or invalid configuration

If the endpoint is not set, unreachable or rejects authentication, AlchemAI shows a clear message to the user and does nothing else. It never falls back to another endpoint.

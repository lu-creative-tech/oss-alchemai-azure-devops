# Security Policy

AlchemAI follows the [Devoteam Luxembourg Security Guidelines](https://github.com/lu-creative-tech/oss-standards/blob/main/SECURITY.md).

## Supported Versions

AlchemAI is in the planning stage and has no released versions yet. Once released, security fixes will be applied to the latest release.

## Reporting a Vulnerability

Report vulnerabilities through [GitHub Issues](https://github.com/lu-creative-tech/oss-alchemai-azure-devops/issues).

Include:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

**Do not include** secrets, API keys, access tokens, customer data, or working exploit code in the issue. If the report cannot be described without them, open an issue asking a maintainer for a private channel instead.

## What to Expect

Reports follow the standard issue resolution process. Fixes for confirmed vulnerabilities are listed in the [CHANGELOG](./CHANGELOG.md).

## Security Model

- Model and agent API keys are stored only in the self-hosted Function App, never in the browser or the extension.
- Every AI draft is shown for review, and nothing is written to Azure DevOps until the user accepts it.
- Administrators choose the Function App endpoint, authentication type and agent per organization and project.

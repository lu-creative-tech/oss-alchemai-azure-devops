# AlchemAI for Azure DevOps

> Turns rough ideas into polished results.

AlchemAI is an open source Azure DevOps extension that adds one-click AI drafting where teams already work: pull requests, work items, pipeline runs and release notes. The extension calls a **self-hosted Azure Function App**, so your organization keeps control of model keys, data and settings. Every AI output is shown as an editable draft, and nothing is written to Azure DevOps until a user accepts it.

> **Status:** 🚧 Planning and foundation. The repository, monorepo and CI are in place; the Function App, extension and first features are being built for the MVP (Q4 2026). Pages mark what exists today and what is planned.

## Pages

| Page | What it covers |
| --- | --- |
| [Architecture](Architecture) | How the pieces fit together and how a request flows |
| [Extension](Extension) | The Azure DevOps extension: UI contributions, review-before-apply, settings hub |
| [Backend](Backend) | The Function App: endpoints, authentication, agent adapters |
| [Contracts](Contracts) | The typed, versioned contract shared by extension and backend |
| [Configuration](Configuration) | Admin settings, scope and precedence |
| [Setup](Setup) | Deploying the Function App and installing the extension |
| [Usage](Usage) | Using the features in Azure DevOps |
| [Security and Data](Security-and-Data) | Where keys live, what data is sent, how the code is scanned |
| [Development](Development) | Working on AlchemAI locally: workspace, scripts, CI, local testing |

## Principles

1. **Review before apply.** AI output is always an editable draft; Accept writes exactly what you approved, Reject writes nothing.
2. **Keys and data stay server-side.** Model keys live only in your Function App; the browser never talks to a model provider.
3. **Admin control.** Admins decide where AlchemAI runs, how callers authenticate and how output is produced.
4. **Agent-agnostic.** Features depend on an agent adapter interface; the Claude API is the first adapter.

The full rules are in the project [constitution](https://github.com/lu-creative-tech/oss-alchemai-azure-devops/blob/main/.specify/memory/constitution.md).

## Roadmap

| When | Milestone |
| --- | --- |
| Q4 2026 | MVP on our own Azure DevOps org: PR title and description drafts, acceptance criteria for PBIs and user stories, configuration page |
| Q1 2027 | MVP published in the Visual Studio Marketplace |

Track progress in the [MVP milestone](https://github.com/lu-creative-tech/oss-alchemai-azure-devops/milestones).

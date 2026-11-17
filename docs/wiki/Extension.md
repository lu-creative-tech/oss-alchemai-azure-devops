# Extension

> **Status:** package skeleton exists (`packages/extension`); UI contributions are planned in [#4](https://github.com/lu-creative-tech/oss-alchemai-azure-devops/issues/4), [#5](https://github.com/lu-creative-tech/oss-alchemai-azure-devops/issues/5) and [#6](https://github.com/lu-creative-tech/oss-alchemai-azure-devops/issues/6).

The extension is what users see. It runs inside Azure DevOps as an iframe, built in TypeScript on the Azure DevOps Extension SDK, and published to the Visual Studio Marketplace.

## What it contributes

| Where | Contribution | Feature |
| --- | --- | --- |
| Repos → Pull request | "Draft title and description" button and draft dialog | PR title and description **(MVP)** |
| Boards → PBI / user story | "Draft acceptance criteria" action and draft dialog | Acceptance criteria **(MVP)** |
| Organization settings | AlchemAI settings hub, visible to org admins only | Configuration **(MVP)** |

Later features add contributions in Pipelines (failed-run explanations) and for release notes and sprint summaries.

## How it works

1. **Read.** When the user clicks a feature button, the extension reads what the feature needs from the Azure DevOps REST API, with the user's own permissions: for example the PR diff, trimmed to a size limit.
2. **Request.** It sends a typed, versioned request (see [Contracts](Contracts)) to the configured Function App endpoint, with an Azure DevOps app token that proves which extension and user are calling.
3. **Review.** The returned draft opens in an editable dialog. The user can change anything.
4. **Apply.** On **Accept**, the extension writes exactly what the user saw and approved to Azure DevOps. On **Reject** or close, nothing is written.

The extension never calls a model provider and never holds a model key.

## Settings hub

Org admins configure AlchemAI from **Organization settings → AlchemAI**. Settings are stored in the Azure DevOps Extension Data Service; see [Configuration](Configuration) for the list, scope and precedence. A **Test connection** button checks that the Function App is reachable and that authentication works.

## Code structure (planned)

- **Azure DevOps adapter:** one module wraps every call to Azure DevOps (user, token, PR and work item reads, settings, writes). Components never call the SDK directly, so they can run against a fake adapter in the local harness (see [Development](Development#testing-the-extension-locally)).
- **Backend client:** one module sends contract requests to the Function App.
- **Components:** feature buttons and the draft dialog, shared by all features.

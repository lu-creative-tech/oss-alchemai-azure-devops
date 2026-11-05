# AlchemAI for Azure DevOps

> Turns rough ideas into polished results.

AlchemAI is an open source Azure DevOps extension that adds one-click AI drafting to the places teams already work: pull requests, work items, pipeline runs and release notes. It calls a self-hosted Azure Function App backend, so organizations keep control of their model keys, data and settings. Drafts are always shown for review, and nothing is written until the user accepts it.

**Status:** 🚧 Planning. Not ready for use yet. See the [roadmap](#roadmap).

## Why AlchemAI?

- Azure DevOps has no built-in equivalent of AI-generated PR descriptions.
- PR titles and descriptions are often skipped or left vague, which slows reviews and muddies history.
- Backlog items arrive without acceptance criteria and get rewritten by hand during refinement.
- Understanding a failed pipeline run means digging through long logs.
- Release notes and sprint summaries are written by hand, repeatedly, for different audiences.

Many teams can't send code from the browser or put API keys there. AlchemAI keeps keys server-side and lets admins control where and how it runs.

## Planned features

Features marked **(MVP)** are part of the first release. Everything else comes later.

### Repos

- Draft a PR title and description from the diff **(MVP)**
- Reviewer summary with risky areas called out
- Merge commit message draft, applied through the PR's completion options
- Testing notes and PR checklist suggestions

### Boards

- Acceptance criteria for PBIs and user stories **(MVP)**
- Draft a PBI from rough notes
- Split large PBIs into smaller stories and tasks
- Rewrite vague bug reports into repro steps and expected vs. actual results
- Test case suggestions and estimate-readiness checks

### Pipelines

- Plain-language explanation of failed runs, with ranked likely causes and a suggested next step

### Releases and reports

- Release notes from completed PRs and work items, for different audiences (customers, engineers, stakeholders)
- Sprint summary drafts

## Architecture

```
Azure DevOps extension (browser)  ──►  Self-hosted Function App  ──►  AI agent (Claude Code first)
        review-before-apply                one endpoint per feature
                                           model keys stay here
```

- **Extension:** UI contributions in Repos, Boards, Pipelines and Releases, plus an admin configuration page.
- **Backend:** Azure Function App with one endpoint per feature and an agent adapter layer, so agents other than Claude Code can be added later.
- **Configuration:**
  - Function App endpoint **(MVP)**
  - Authentication type **(MVP)**
  - Agent type
  - Enable per project, with project-level overrides for style, language and extra instructions
- **Security:** model keys live only in the Function App, never in the browser.

## Getting started

Setup, build and test instructions will be added with the first MVP.

**Tech stack:** TypeScript, Node.js, Azure Functions.

## Roadmap

| When | Milestone |
| --- | --- |
| Q4 2026 | MVP running on our own Azure DevOps instance: PR title and description drafts, acceptance criteria for PBIs and user stories, and a configuration page with endpoint and authentication type |
| Q1 2027 | MVP published as an extension in the Visual Studio Marketplace |

## Contributing

Contributions are welcome. Read the [Contributing Guide](./CONTRIBUTING.md) and the [Code of Conduct](./CODE_OF_CONDUCT.md) first.

## Security

See [SECURITY.md](./SECURITY.md) for how to report vulnerabilities.

## Support

Open an [issue](https://github.com/lu-creative-tech/oss-alchemai-azure-devops/issues) or use [GitHub Discussions](https://github.com/lu-creative-tech/oss-standards/discussions).

## License

[MIT](./LICENSE)

This project follows the [Devoteam Luxembourg Open Source Standards](https://github.com/lu-creative-tech/oss-standards).

# Usage

> **Status:** planned for the MVP ([#5](https://github.com/lu-creative-tech/oss-alchemai-azure-devops/issues/5), [#6](https://github.com/lu-creative-tech/oss-alchemai-azure-devops/issues/6)).

Every AlchemAI feature works the same way: click, review the draft, accept or reject. Nothing is written to Azure DevOps until you accept.

## Draft a PR title and description (MVP)

1. Open a pull request in **Repos**.
2. Click **Draft title and description**.
3. AlchemAI reads the PR diff, trims it to a size limit and sends it to your Function App.
4. Review the draft in the dialog and edit anything you like.
5. Click **Accept** to write the title and description to the PR, or **Reject** to leave the PR unchanged.

## Draft acceptance criteria (MVP)

1. Open a PBI or user story in **Boards**.
2. Click **Draft acceptance criteria**.
3. Review and edit the draft.
4. Click **Accept** to write it to the work item, or **Reject** to leave it unchanged.

## Planned features

| Area | Feature |
| --- | --- |
| Repos | Reviewer summary with risky areas, merge commit message, testing notes and PR checklist |
| Boards | Draft a PBI from rough notes, split large PBIs, rewrite vague bug reports, test case suggestions |
| Pipelines | Plain-language explanation of failed runs with likely causes and a next step |
| Releases and reports | Release notes for different audiences, sprint summaries |

## When something goes wrong

| Message | What to do |
| --- | --- |
| AlchemAI is not configured | Ask an org admin to set the endpoint in **Organization settings → AlchemAI** |
| Cannot reach the AlchemAI backend | Ask an admin to run **Test connection**; check the Function App is running and CORS allows Azure DevOps |
| Not authorized | The authentication type or token is not accepted; an admin should check the configuration |
| The content is too large | The input was trimmed or rejected by the size limit; try a smaller PR |

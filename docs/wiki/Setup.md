# Setup

> **Status:** planned. These steps describe the target setup for the MVP ([#4](https://github.com/lu-creative-tech/oss-alchemai-azure-devops/issues/4), [#7](https://github.com/lu-creative-tech/oss-alchemai-azure-devops/issues/7)). Commands and templates will be added here as they ship. To work on AlchemAI itself, see [Development](Development).

Setting up AlchemAI has three steps: deploy the backend in your Azure subscription, install the extension in your Azure DevOps organization, and connect the two.

## Prerequisites

- An Azure subscription where you can create a Function App and a Key Vault
- An API key for the AI provider (the Claude API for the MVP)
- Azure DevOps **Project Collection Administrator** (or organization owner) rights to install extensions and change organization settings

## 1. Deploy the Function App

1. Deploy the Bicep template from the repository. It creates the Function App, a Key Vault and the app settings that reference the vault.
2. Store the model API key in Key Vault. It is never stored anywhere else.
3. Allow CORS from your Azure DevOps origins (for example `https://dev.azure.com`).
4. Note the Function App URL, for example `https://<your-app>.azurewebsites.net`.
5. Check `https://<your-app>.azurewebsites.net/api/v1/health` responds.

## 2. Install the extension

- **MVP:** the extension is installed privately on our own organization.
- **From Q1 2027:** install AlchemAI from the Visual Studio Marketplace into your organization.

## 3. Configure

1. Open **Organization settings → AlchemAI**.
2. Enter the Function App endpoint URL.
3. Choose the authentication type.
4. Click **Test connection**. It calls `/health`, then the authenticated `/ping`, and reports any problem clearly.

See [Configuration](Configuration) for every setting.

## Updating

The extension and backend follow Semantic Versioning. Read the [CHANGELOG](https://github.com/lu-creative-tech/oss-alchemai-azure-devops/blob/main/CHANGELOG.md) before upgrading; a major version means the extension and backend must be upgraded together.

# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Repository setup: license, README, contributing guide, code of conduct and security policy.
- Spec Kit setup for spec-driven development, with the project constitution v1.0.0.
- npm workspaces monorepo (`contracts`, `backend`, `extension`) with strict TypeScript, ESLint and Vitest.
- CI with typecheck, lint, tests, CodeQL, dependency review, secret scanning and Dependabot.
- Wiki pages in `docs/wiki/` covering architecture, components, configuration, setup, usage, security and development, published to the GitHub wiki on merge to `main`.

### Changed

- Node.js 24 is the minimum supported version, matching the newest LTS that Azure Functions supports as GA.
- Constitution v1.0.1: the backend targets the newest Node.js LTS that Azure Functions supports as GA, instead of the active LTS.

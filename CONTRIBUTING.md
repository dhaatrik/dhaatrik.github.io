# Contributing to Mission Control

First off, thank you for considering contributing to Mission Control (`dhaatrik.github.io`). Whether you are fixing a bug, proposing a feature, or improving documentation, your help is appreciated.

This document serves as a set of guidelines for contributing to this project.

## Code of Conduct

This project and everyone participating in it is governed by the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating, you are expected to uphold this code and foster an open, welcoming environment.

## How Can I Contribute?

### Reporting Bugs

Following these guidelines helps maintainers understand your report, reproduce the behavior, and find a fix quickly.

- **Use a clear and descriptive title** for the issue to identify the problem.
- **Describe the exact steps** which reproduce the problem in as many details as possible.
- **Provide specific examples** to demonstrate the steps (e.g., screenshots or code snippets).
- **Include environment details** (OS, browser version, Node version).

### Suggesting Enhancements

If you have an idea to improve the "Premium Founder" aesthetic, the offline capabilities, or the general architecture:

- **Check existing issues** to see if the enhancement has already been suggested.
- **Use a clear and descriptive title** for the issue.
- **Provide a step-by-step description** of the suggested enhancement.
- **Explain why this enhancement would be useful** to the project.

## Development Setup

1. **Fork the repository** to your own GitHub account and clone it locally:
    ```bash
    git clone https://github.com/dhaatrik/dhaatrik.github.io.git
    cd dhaatrik.github.io
    ```
2. **Install dependencies:**
    ```bash
    npm install
    ```
3. **Start the development server:**
    ```bash
    npm run dev
    ```

## Pull Request Process

1. **Create a feature branch:**
    ```bash
    git checkout -b feature/amazing-feature
    ```
2. **Write your code.** Keep the "First-Principles" and offline-first philosophies in mind.
3. **Format your code:** We use Prettier to maintain a consistent code style.
    ```bash
    npm run format
    ```
4. **Run the tests:** Ensure your changes don't break the core functionality (like the Vellor offline protocol or client-side routing).
    ```bash
    npm run test:e2e
    ```
    _If you are adding a new interactive feature, please consider writing a corresponding Playwright test in `test/e2e/ui.spec.ts`._
5. **Commit your changes** with clear, descriptive commit messages.
6. **Push to the branch:**
    ```bash
    git push origin feature/amazing-feature
    ```
7. **Open a Pull Request** against the `main` branch of the original repository. Provide a thorough explanation of your changes in the PR description.

Once submitted, the maintainer will review your code. You may be asked to make changes before it is merged. Thank you for contributing!

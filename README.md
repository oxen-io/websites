# Session Websites

Session Websites is a collection of websites and libraries for the Session Web ecosystem.

## Apps and Packages

This repository is a monorepo that contains multiple apps and packages. Each app and package is located in its own directory.

- `apps` directory contains all the apps.
- `packages` directory contains all the packages.

An app is a standalone application that can be run independently. A package is a library that can be used by other apps or packages.

This repository contains the following apps and packages:

- `staking`: Session Staking [Next.js](https://nextjs.org/) app.
- `@session/ui`: Session UI component library.
- `@session/eslint-config`: `eslint` configurations.
- `@session/typescript-config`: `tsconfig.json` configurations.
- `@session/contracts`: Session smart contract js library for interacting with the Session smart contracts.
- `@session/sent-staking-js`: Session Token Staking js library for interacting with the Session Token staking backend.
- `@session/wallet`: A wallet library for interacting with the Session Token.
- `@session/util`: A utility library for common functions.
- `@session/testing`: A testing library.

### Utilities

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Tailwind CSS](https://tailwindcss.com/) for styling

### Build

To build all apps and packages, run the following command:

```sh
pnpm build
```

## Pre-requisites

- [Node.js](https://nodejs.org/en/) (v22 or higher)
- [pnpm](https://pnpm.io/) (v9 or higher)
- [jq](https://jqlang.github.io/jq/) (see [jq for mac](https://formulae.brew.sh/formula/jq))

We recommend using a node version manager like [asdf](https://asdf-vm.com/) to manage your node versions. The `.tool-versions` file in the root of the project specifies the node version to use. We also have an `.nvmrc` file that specifies the same node version to use. You can enable support for [Using Existing Tool Version Files](https://asdf-vm.com/guide/getting-started.html#using-existing-tool-version-files) in asdf to use these files.

## Getting Started

To get started, install the dependencies:

```sh
pnpm install
```

This will install all the dependencies for all the apps and packages.

## Development

You can find a `README.md` file in each app and package directory that explains how to develop and test that specific app or package.

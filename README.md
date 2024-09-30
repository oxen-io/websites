# Session Websites

Session Websites is a collection of websites and libraries for the Session Web ecosystem.

## Apps and Packages

This repository is a monorepo that contains multiple apps and packages. Each app and package is located in its own
directory.

- `apps` directory contains all the apps.
- `packages` directory contains all the packages.

An app is a standalone application that can be run independently. A package is a library that can be used by other apps
or packages.

This repository contains the following apps and packages:

### Apps

- `staking`: Session Staking [Next.js](https://nextjs.org/) app. [Read more](apps/staking/README.md).

### Packages

- `@session/auth`: Auth package for handling third-party authentication
  using [NextAuth.js](https://next-auth.js.org/). [Read more](packages/auth/README.md).
- `@session/contracts`: Session smart contract js library for interacting with the Session smart
  contracts. [Read more](packages/contracts/README.md).
- `@session/eslint-config`: `eslint`
  configurations. [Read more](packages/eslint-config/README.md). [Read more](packages/eslint-config/README.md).
- `@session/feture-flags`: Feature flags library for [Next.js](https://nextjs.org/) apps. Supporting client, server, and
  remote flags. [Read more](packages/feature-flags/README.md).
- `@session/logger`: An opinionated logging wrapper. [Read more](packages/logger/README.md).
- `@session/sent-staking-js`: Session Token Staking js library for interacting with the Session Token staking
  backend. [Read more](packages/sent-staking-js/README.md).
- `@session/testing`: A testing utility library. [Read more](packages/testing/README.md).
- `@session/typescript-config`: `tsconfig.json` configurations. [Read more](packages/typescript-config/README.md).
- `@session/ui`: Session UI component library is a collection of UI components for [Next.js](https://nextjs.org/) apps
  and uses
  [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/),
  and [shadcn-ui](https://ui.shadcn.com/). [Read more](packages/ui/README.md).
- `@session/util-crypto`: A crypto utility library for common crypto
  functions. [Read more](packages/util-crypto/README.md).
- `@session/util-js`: A JS utility library for common functions. [Read more](packages/util-js/README.md).
- `@session/util-logger`: A logger utility library for initializing the pino logger with @session/logger as a
  wrapper. [Read more](packages/util-logger/README.md).
- `@session/wallet`: A wallet library for interacting with the Session Token. [Read more](packages/wallet/README.md).

### Utilities

- [TypeScript](https://www.typescriptlang.org/) for static type checking.
- [ESLint](https://eslint.org/) for code linting.
- [Prettier](https://prettier.io) for code formatting.
- [Tailwind CSS](https://tailwindcss.com/) for styling.
- [Next.js](https://nextjs.org/) for server-side rendering.
- [shadcn-ui](https://ui.shadcn.com/) for UI components.
- [Radix UI](https://www.radix-ui.com/) for UI components.
- [Jest](https://jestjs.io/) for unit testing.

### Build

To build all apps and packages, run the following command:

```sh
pnpm build
```

## Pre-requisites

- [Node.js](https://nodejs.org/en/) (v22 or higher)
- [pnpm](https://pnpm.io/) (v9 or higher)
- [jq](https://jqlang.github.io/jq/) (see [jq for mac](https://formulae.brew.sh/formula/jq))

We recommend using a node version manager like [asdf](https://asdf-vm.com/) to manage your node versions. The
`.tool-versions` file in the root of the project specifies the node version to use. We also have an `.nvmrc` file that
specifies the same node version to use. You can enable support
for [Using Existing Tool Version Files](https://asdf-vm.com/guide/getting-started.html#using-existing-tool-version-files)
in asdf to use these files.

## Getting Started

To get started, install the dependencies:

```sh
pnpm install
```

This will install all the dependencies for all the apps and packages.

## Contributing

We welcome contributions to the Session Web Ecosystem. Please read our [contributing guidelines](CONTRIBUTING.md) for
more information on how to contribute.

## Development

You can find a `README.md` file in each app and package directory that explains how to develop and test that specific
app or package.

### Developer Telemetry

Some tools used in this repo have anonymous developer telemetry enabled by default. This is developer telemetry that
tools creators use to report usage from developers and does not apply to any apps created using these
tools. We
have disabled all telemetry, you can ensure developer telemetry is disabled in all packages by running
`pnpm check-telemetry`. We have disabled telemetry by aliasing the `turbo` command in the repository root with
`NEXT_TELEMETRY_DISABLED=1 DO_NOT_TRACK=1`.

- `NEXT_TELEMETRY_DISABLED=1` disables developer telemetry in nextjs.
- `DO_NOT_TRACK` disables telemetry in all packages that respect
  the [Console Do Not Track (DNT) standard](https://consoledonottrack.com/)

## Testing

Our testing suite is a work in progress and any contributions are welcome.

### Jest

We use [Jest](https://jestjs.io/) for unit testing. You can run the tests with the following command:

```sh
pnpm test
```

### BrowserStack

This project is tested with BrowserStack.

[BrowserStack](https://browserstack.com/) is used for cross-browser, accessibility, and regression testing.


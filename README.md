# Lawn Care Directory - Next.js 15 with App Router

A modern web application for finding and connecting with lawn care professionals in your area, built with Next.js 15, TypeScript, and Strapi CMS.

## Tech Stack

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Strapi** for headless CMS
- **React 19** for UI components

## Getting Started

### Prerequisites

- Node.js 20.x or later
- pnpm, npm, or yarn
- Strapi CMS (running locally or hosted)

### Environment Setup

1. Create a `.env.local` file in the root directory with:

```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

2. If you're using a Strapi API token, add:

```
NEXT_PUBLIC_STRAPI_API_TOKEN=your_token_here
```

### Installation

```bash
# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Strapi Setup

This project uses Strapi as the headless CMS. You'll need to set up a Strapi project with the following content types:

### Provider Content Type
- **Title**: Text (required, unique)
- **Description**: Rich Text
- **FeaturedImageUrl**: Text
- **Featured**: Boolean
- **Categories**: Text array
- **Address**: Object with city, state, postalCode, country fields
- **Reviews**: Object with stars, count, link fields
- **ContactInfo**: Object with phone, email, website fields

### Category Content Type
- **Name**: Text (required, unique)
- **Slug**: Text (required, unique)
- **Description**: Text

For more details on Strapi setup, refer to:
- [Strapi Quick Start Guide](https://docs.strapi.io/cms/quick-start)
- [Strapi Project Structure](https://docs.strapi.io/cms/project-structure)
- [Strapi CLI Installation](https://docs.strapi.io/cms/installation/cli)

## Features

- Search lawn care providers by zip code
- Filter providers by service category
- View detailed provider information
- Mobile-responsive design
- Fast, performant pages with Next.js App Router

## Development

- The `src/app` directory contains page routes using the App Router
- Components are in `src/components`
- API client functions in `src/lib`
- TypeScript interfaces in `src/types`

```sh
npm create astro@latest -- --template basics
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/basics)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/basics/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

![just-the-basics](https://github.com/withastro/astro/assets/2244813/a0a5533c-a856-4198-8470-2d67b1d7c554)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

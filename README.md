# WoW Mount & Pet Tracker

A Next.js web application that lets you look up any World of Warcraft character and browse their mount and pet collections, or search any mount/pet by name to see how to obtain it.

**No login required. No data stored. Real-time data from Blizzard's official API.**

> Currently supports **EU region** only.

---

## Features

- **Character Lookup** — search by name and realm to see a character's full mount and pet collection with images, paginated 25 at a time
- **Mount Lookup** — search any mount by name to see its image, description, and a direct Wowhead link
- **Pet Lookup** — search any pet by name to see its image, description, abilities, and a direct Wowhead link
- Shareable URLs — searches are reflected in the URL so results can be bookmarked and shared

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Blizzard Battle.net API](https://develop.battle.net/)

## Getting Started

### 1. Get a Blizzard API key

Create a client at [develop.battle.net](https://develop.battle.net/access/clients). You need the **Client ID** and **Client Secret**.

### 2. Set up environment variables

Create a `.env.local` file in the project root:

```
WOW_CLIENT_ID=your_client_id_here
WOW_CLIENT_SECRET=your_client_secret_here
```

### 3. Install dependencies and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```

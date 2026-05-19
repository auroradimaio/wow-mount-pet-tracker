# WoW Mount & Pet Tracker

A Next.js web application for browsing World of Warcraft character collections and looking up mounts and pets. Uses Blizzard's official Battle.net API — no login required, no data stored. Tested with Jest and React Testing Library.

**Live demo: [wow-mount-pet-tracker.vercel.app](https://wow-mount-pet-tracker.vercel.app)**

> Currently supports **EU region** only.

---

## Features

- **Character Lookup** — enter any EU character name and realm to see their full mount and pet collection, paginated with images
- **Mount Lookup** — search any mount by name to see its image, description, and a direct Wowhead link
- **Pet Lookup** — search any pet by name to see its image, creature type, abilities with icons, and a direct Wowhead link
- **Shareable URLs** — search results are reflected in the URL and can be bookmarked or shared
- **No account needed** — works on any WoW EU character without logging in

## Things to try

Not a WoW player? Here are some examples to explore the app:

**Characters (EU)**
- Naowh on Tarren Mill — top EU Mythic+ player
- Scripe on Tarren Mill — top EU raider from Echo guild
- Rextroy on Sylvanas — EU content creator known for exploit videos

**Mounts**
- Invincible — Arthas's legendary horse from Icecrown Citadel
- Ashes of Al'ar — iconic phoenix drop from Tempest Keep
- Tyrael's Charger — angelic mount tied to the archangel Tyrael

**Pets**
- Lil' Ragnaros — fire elemental companion based on the raid boss
- Mechanical Squirrel — one of the earliest craftable battle pets
- Disgusting Oozeling — a rare drop with its own debuff aura

## Tech Stack

- [Next.js](https://nextjs.org/) 16 (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Blizzard Battle.net API](https://develop.battle.net/)

## Running locally

### 1. Get a Blizzard API key

Create a client at [develop.battle.net](https://develop.battle.net/access/clients). You need the **Client ID** and **Client Secret**.

### 2. Set up environment variables

Create a `.env.local` file in the project root:

```
WOW_CLIENT_ID=your_client_id_here
WOW_CLIENT_SECRET=your_client_secret_here
```

Credentials are kept server-side via a Next.js route handler and are never exposed to the browser.

### 3. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev        # Development server
npm run build      # Production build
npm run start      # Production server
npm run lint       # ESLint
npm run test       # Run tests
npm run test:watch # Run tests in watch mode
```

# WoW Mount and Pet Tracker - Project Documentation

## Overview

The WoW Mount and Pet Tracker is a Next.js web application that allows World of Warcraft players to search for characters and view their mount/pet collections, or look up any mount or pet by name to see its full details. It integrates with Blizzard's Battle.net API with no login required and no data stored locally.

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **Animation**: Framer Motion (landing page)
- **Icons**: Lucide React
- **Analytics**: Vercel Analytics
- **Loading states**: react-spinners
- **API Integration**: Blizzard Battle.net OAuth 2.0

## Project Structure

```
src/app/
├── api/
│   └── token/
│       └── route.ts           # Server-side OAuth token proxy
├── character/
│   └── page.tsx               # Character search + collection view
├── mounts/
│   └── page.tsx               # Mount name lookup page
├── pets/
│   └── page.tsx               # Pet name lookup page
├── components/
│   ├── CharacterInfo.tsx      # Character profile + paginated collections
│   ├── MountInfo.tsx          # Mount detail display (image, description, Wowhead link)
│   ├── PetInfo.tsx            # Pet detail display (icon, abilities, Wowhead link)
│   ├── MountCard.tsx          # Image card for mount/pet collection grid
│   ├── SearchBar.tsx          # Character search: name input + realm dropdown
│   ├── SearchBarLookup.tsx    # Shared name-only search bar for mount/pet lookup
│   ├── Header.tsx             # Site header with nav + mobile hamburger menu
│   ├── Footer.tsx             # Site footer with copyright
│   └── helpers/
│       ├── Skeleton.tsx                 # Animated pulse placeholder (3 sizes + custom className)
│       ├── MountCardSkeleton.tsx        # Card-shaped skeleton for collection grid
│       ├── CharacterDoesNotExist.tsx    # Error state for missing characters
│       ├── CharacterDoesNotHaveData.tsx # Empty state for character with no mounts/pets
│       └── NotFound.tsx                 # Generic not-found state for mount/pet lookup
├── utils/
│   └── fetchAccessToken.ts    # Client-side token fetcher (calls /api/token, caches result)
├── images/                    # Static image assets
├── styles/
│   └── globals.css            # Global CSS and Tailwind base
├── layout.tsx                 # Root layout (Header, Footer, Analytics)
└── page.tsx                   # Home page with animated feature cards
```

### Test suite

```
src/app/components/__tests__/
├── CharacterInfo.test.tsx
├── Header.test.tsx
├── Footer.test.tsx
├── MountCard.test.tsx
├── MountInfo.test.tsx
├── PetInfo.test.tsx
├── SearchBar.test.tsx
├── SearchBarLookup.test.tsx
└── helpers/
    ├── CharacterDoesNotExist.test.tsx
    ├── CharacterDoesNotHaveData.test.tsx
    ├── MountCardSkeleton.test.tsx
    ├── NotFound.test.tsx
    └── Skeleton.test.tsx
```

## Core Features

### 1. Home Page

**Location**: [src/app/page.tsx](src/app/page.tsx)

Animated landing page built with Framer Motion:
- Hero section with gradient title and scroll-down chevron
- Three feature cards linking to `/character`, `/mounts`, and `/pets` with hover lift animations
- "How Does It Work?" section explaining the no-login, no-storage approach

### 2. Character Search & Collection View

**Page**: [src/app/character/page.tsx](src/app/character/page.tsx)  
**Component**: [src/app/components/CharacterInfo.tsx](src/app/components/CharacterInfo.tsx)

Users search for any EU character by name + realm. The page:
- Persists the search in the URL (`?name=&realm=`) for shareability
- Shows quick-search example buttons (Naowh, Scripe, Rextroy)
- Displays faction icon (Alliance/Horde), character name, active title, mount count, and pet count
- Lets users toggle between **View Mount Collection** and **View Pet Collection**
- Paginates collections at 25 items per page with Previous/Next buttons
- Enriches each item with its image on-demand per page via `fetchMountWithImage` / `fetchPetWithImage`
- Uses `useRef<Map>` caches so paginating back never re-fetches already-loaded images
- Clears caches when a new character search begins

### 3. Mount Lookup

**Page**: [src/app/mounts/page.tsx](src/app/mounts/page.tsx)  
**Component**: [src/app/components/MountInfo.tsx](src/app/components/MountInfo.tsx)

Users enter any mount name to see its details:
- Persists the search in URL (`?name=`)
- Quick-search examples: Invincible, Ashes of Al'ar, Tyrael's Charger
- Displays mount image (creature-display media), name, description
- Links to the mount's Wowhead page
- Shows `NotFound` when the name doesn't match any mount in the index

**Caching**: `mountIndexCache` (module-level variable) stores the full mount index for the browser session, so it's only fetched once.

### 4. Pet Lookup

**Page**: [src/app/pets/page.tsx](src/app/pets/page.tsx)  
**Component**: [src/app/components/PetInfo.tsx](src/app/components/PetInfo.tsx)

Users enter any pet name to see its details:
- Persists the search in URL (`?name=`)
- Quick-search examples: Lil' Ragnaros, Mechanical Squirrel, Disgusting Oozeling
- Displays pet icon (`/data/wow/media/pet/{petId}`), name, creature type, description
- Shows all pet abilities in a 3-column grid, each with icon and name (fetched in parallel)
- Links to the pet's Wowhead page (using `creature.id` for the NPC URL)
- Shows `NotFound` when the name doesn't match any pet in the index

**Caching**: `petIndexCache` (module-level variable) stores the full pet index for the browser session.

### 5. Realm-Aware Search Bar

**Component**: [src/app/components/SearchBar.tsx](src/app/components/SearchBar.tsx)

Character-search specific component with:
- Text input for character name
- Searchable realm dropdown populated from Blizzard's realm index API
- Filters out internal/test realms (`EU\d`, `Account Realm`, `-INST`, `Arena Pass`, etc.)
- Falls back to a small hardcoded list (Draenor, Kazzak, Nemesis, Outland, Silvermoon) if the API fails
- Click-outside closes the dropdown; Escape key also closes it
- Accessible via `aria-haspopup`, `aria-expanded`, `aria-label`, and `role="listbox/option"`

### 6. Generic Lookup Search Bar

**Component**: [src/app/components/SearchBarLookup.tsx](src/app/components/SearchBarLookup.tsx)

Shared, minimal search bar used by both the Mounts and Pets pages. Accepts `placeholder` and `hint` props to customise its copy per page.

### 7. Navigation

**Component**: [src/app/components/Header.tsx](src/app/components/Header.tsx)

Site-wide navigation with:
- WoW logo linking to the home page
- Desktop nav links: Characters, Mounts, Pets, GitHub
- Mobile hamburger menu (full-screen overlay, closes on any link click or overlay click)
- Active route highlighted with `bg-gray-700`

## API Integration

### Authentication Architecture

**Token route**: [src/app/api/token/route.ts](src/app/api/token/route.ts)  
**Client utility**: [src/app/utils/fetchAccessToken.ts](src/app/utils/fetchAccessToken.ts)

Credentials are kept server-side only. The flow is:

1. Client calls `fetchAccessToken()` which hits the internal `/api/token` endpoint
2. `/api/token` reads `WOW_CLIENT_ID` and `WOW_CLIENT_SECRET` from server-side env vars
3. It exchanges them for a token via Blizzard's US OAuth endpoint (`us.battle.net/oauth/token`)
4. The client caches the token in module scope with an expiry (`expires_in - 60` seconds)

**Required environment variables** (server-side only, no `NEXT_PUBLIC_` prefix):
```
WOW_CLIENT_ID=<Blizzard App Client ID>
WOW_CLIENT_SECRET=<Blizzard App Client Secret>
```

### Blizzard API Endpoints

All data endpoints use the **EU region** (`eu.api.blizzard.com`) with locale `en_US`.

| Purpose | Endpoint | Namespace |
|---|---|---|
| Realm list | `/data/wow/realm/index` | `dynamic-eu` |
| Character profile | `/profile/wow/character/{realm}/{character}` | `profile-eu` |
| Character mounts | `/profile/wow/character/{realm}/{character}/collections/mounts` | `profile-eu` |
| Character pets | `/profile/wow/character/{realm}/{character}/collections/pets` | `profile-eu` |
| Mount index | `/data/wow/mount/index` | `static-eu` |
| Mount details | `/data/wow/mount/{id}` | `static-eu` |
| Pet index | `/data/wow/pet/index` | `static-eu` |
| Pet details | `/data/wow/pet/{id}` | `static-eu` |
| Mount image | `/data/wow/media/creature-display/{displayId}` | `static-eu` |
| Pet icon | `/data/wow/media/pet/{petId}` | `static-eu` |
| Pet ability details | `/data/wow/pet-ability/{id}` | `static-eu` |
| Pet ability icon | `/data/wow/media/pet-ability/{id}` | `static-eu` |

**Realm slug formatting**: apostrophes stripped, spaces → hyphens, lowercased, then `encodeURIComponent`.

## Caching Strategy

| Layer | Mechanism | Scope | Reset |
|---|---|---|---|
| OAuth token | Module-level variable + expiry timestamp in `fetchAccessToken.ts` | Browser session | Auto-expires (`expires_in - 60s`) |
| Mount index | `mountIndexCache` module-level variable in `MountInfo.tsx` | Browser session | Page reload |
| Pet index | `petIndexCache` module-level variable in `PetInfo.tsx` | Browser session | Page reload |
| Character mount images | `mountCacheRef` (`useRef<Map>`) in `CharacterInfo` | Per component instance | New character search |
| Character pet images | `petCacheRef` (`useRef<Map>`) in `CharacterInfo` | Per component instance | New character search |

## Styling & Design

### Color Scheme

| Token | Hex | Usage |
|---|---|---|
| Primary gold | `#c79c6e` | Text highlights, buttons, borders |
| Darker gold | `#a57b4b` | Hover/active button state |
| Background | `#081f38` | Page background (dark blue) |
| Component bg | `#1f2937` / `gray-900` | Cards, header, footer |

### Custom Font

WoW-style "LifeCraft_Font" loaded from [public/fonts/LifeCraft_Font.ttf](public/fonts/LifeCraft_Font.ttf).

### Key UI Patterns

- **Rounded corners**: `rounded-[25px]` on all buttons and cards
- **Skeleton loading**: `Skeleton` component wraps content; shows animated gold pulse while loading. Accepts `size` (`small`/`medium`/`large`) or a custom `className`
- **MountCardSkeleton**: Card-shaped pulse shown in the collection grid while a page of images loads
- **Pagination**: Previous/Next buttons, disabled at boundaries; resets to page 1 on view switch
- **Mobile menu**: Full-screen overlay triggered by a lucide `Menu` icon; closes on link click

## Data Flow

### Character Search

1. User types a name and selects a realm in `SearchBar`
2. `CharacterPage` receives the values via `onSearch`, updates state, and pushes `?name=&realm=` to the URL
3. `CharacterInfo` detects changed props, clears all caches/state, and calls `fetchAccessToken()`
4. Fetches the character profile; on failure, renders `CharacterDoesNotExist`
5. In parallel, fetches the mount collection and pet collection
6. Stores all mounts and pets as lightweight `RawMount[]` / `RawPet[]` arrays in state
7. A second `useEffect` fires when `rawMounts`/`rawPets` change, calling `fetchMountsForPage(1)` or `fetchPetsForPage(1)`
8. Each page fetch enriches 25 items in parallel via `Promise.all`, hitting the cache first

### Mount / Pet Lookup

1. User types a name in `SearchBarLookup`
2. The page updates state and pushes `?name=` to the URL
3. `MountInfo` / `PetInfo` fetches the token, then the full index (from module cache if available)
4. Finds the matching entry by case-insensitive name comparison
5. Fetches full details + media in sequence (MountInfo) or in parallel (PetInfo + abilities)
6. Renders the detail card; shows `NotFound` on no match

## Development Commands

```bash
npm run dev      # Start development server on localhost:3000
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # ESLint code quality check
```

## Configuration Files

| File | Purpose |
|---|---|
| [next.config.ts](next.config.ts) | Allows remote images from `render.worldofwarcraft.com`, `blzmedia-a.akamaihd.net`, `eu.api.blizzard.com` |
| [tsconfig.json](tsconfig.json) | TypeScript config; path alias `@/*` → `./src/*` |
| [tailwind.config.ts](tailwind.config.ts) | Tailwind CSS config with custom WoW palette tokens |
| [.eslintrc.json](.eslintrc.json) | ESLint rules |

## Security

- **Credentials are server-side only.** `WOW_CLIENT_ID` and `WOW_CLIENT_SECRET` are never shipped to the browser. The `/api/token` route proxies the OAuth exchange.
- **Input sanitisation.** Character names are lowercased; realm slugs are stripped of apostrophes and spaces are converted to hyphens before being used in URLs.
- **No data persistence.** No database, no cookies, no local storage writes; all state is in-memory.

# WoW Mount and Pet Tracker - Project Documentation

## Overview

The WoW Mount and Pet Tracker is a Next.js web application that allows World of Warcraft players to view and track mount and pet collections for any character in the game. The application integrates with Blizzard's official World of Warcraft API to fetch real-time character data without requiring user login or storing any data locally.

## Technology Stack

- **Framework**: Next.js 15.0.0 (React 18.3.1)
- **Language**: TypeScript 5.6.3
- **Styling**: Tailwind CSS 3.4.14
- **UI Components**: Custom components with react-spinners for loading states
- **API Integration**: Blizzard Battle.net OAuth API
- **Development Tools**: ESLint, Nodemon, PostCSS, Autoprefixer

## Project Structure

```
src/app/
├── character/          # Character search and display page
│   └── page.tsx
├── mounts/            # Mount browsing page (WIP)
│   └── page.tsx
├── pets/              # Pet browsing page (WIP)
│   └── page.tsx
├── components/        # Reusable React components
│   ├── CharacterInfo.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── MountCard.tsx
│   ├── Searchbar.tsx
│   └── helpers/
│       └── skeleton.tsx
├── utils/            # Utility functions
│   └── fetchAccessToken.ts
├── images/           # Static image assets
├── styles/           # Global CSS styles
│   └── globals.css
├── layout.tsx        # Root layout component
└── page.tsx          # Home page
```

## Core Features

### 1. Character Search

**Location**: [src/app/character/page.tsx](src/app/character/page.tsx)

The main feature allows users to search for any WoW character by:
- Character name
- Realm/Server selection (dynamically fetched from Blizzard API)

**Search Process**:
- User enters character name and selects realm from dropdown
- Application formats the server name (lowercases, removes special characters, replaces spaces with hyphens)
- Makes authenticated API call to Blizzard's character profile endpoint
- Displays character information if found, or shows "Character does not exist" message

### 2. Character Information Display

**Component**: [src/app/components/CharacterInfo.tsx](src/app/components/CharacterInfo.tsx)

Displays comprehensive character data including:
- Character name and active title
- Faction icon (Alliance or Horde)
- Total mounts collected
- Total pets collected
- Paginated mount collection with images (25 items per page)
- Pet collection view

**Key Features**:
- Toggle between mounts and pets view
- Pagination controls for mount collections
- Loading states with animated spinners
- Skeleton loaders for smooth UX
- Fetches individual mount images from Blizzard's media API

### 3. Smart Server Selection

**Component**: [src/app/components/Searchbar.tsx](src/app/components/Searchbar.tsx)

Features:
- Dynamically fetches all EU realms from Blizzard API
- Searchable dropdown with filter functionality
- Fallback to hardcoded popular servers if API fails
- Default selection: "Pozzo dell'Eternità"
- Real-time filter as user types

### 4. Visual Mount/Pet Cards

**Component**: [src/app/components/MountCard.tsx](src/app/components/MountCard.tsx)

Displays:
- Mount/pet image (200x200px)
- Mount/pet name
- Placeholder if image unavailable
- Optional mount ID in title attribute

### 5. Navigation

**Component**: [src/app/components/Header.tsx](src/app/components/Header.tsx)

Provides site-wide navigation with:
- WoW logo (clickable, returns to home)
- Navigation buttons for:
  - Characters
  - Mounts
  - Pets
- Responsive design with hover effects

## API Integration

### Authentication

**File**: [src/app/utils/fetchAccessToken.ts](src/app/utils/fetchAccessToken.ts)

Uses OAuth 2.0 Client Credentials flow:
1. Reads client ID and secret from environment variables
2. Sends POST request to Battle.net OAuth token endpoint
3. Returns access token for subsequent API calls

**Required Environment Variables**:
- `NEXT_PUBLIC_WOW_CLIENT_ID`
- `NEXT_PUBLIC_WOW_CLIENT_SECRET`

### Blizzard API Endpoints Used

1. **Realm Index** - Get list of all realms
   - `https://eu.api.blizzard.com/data/wow/realm/index?namespace=dynamic-eu`

2. **Character Profile** - Get character basic info
   - `https://eu.api.blizzard.com/profile/wow/character/{realm}/{character}?namespace=profile-eu`

3. **Character Pets** - Get character's pet collection
   - `https://eu.api.blizzard.com/profile/wow/character/{realm}/{character}/collections/pets?namespace=profile-eu`

4. **Character Mounts** - Get character's mount collection
   - `https://eu.api.blizzard.com/profile/wow/character/{realm}/{character}/collections/mounts?namespace=profile-eu`

5. **Mount Details** - Get detailed mount information
   - `https://eu.api.blizzard.com/data/wow/mount/{mountId}?namespace=static-eu`

6. **Creature Display Media** - Get mount/pet images
   - `https://eu.api.blizzard.com/data/wow/media/creature-display/{displayId}?namespace=static-eu`

## Styling & Design

### Color Scheme

The application uses a World of Warcraft-inspired color palette:
- **Primary Gold**: `#c79c6e` - Used for text highlights and buttons
- **Darker Gold**: `#a57b4b` - Used for active/hover states
- **Background**: `#081f38` (dark blue) in dark mode
- **Component Backgrounds**: `#1f2937` (gray-900)

### Custom Font

Uses "LifeCraft_Font" (WoW-style font) loaded from:
- [public/fonts/LifeCraft_Font.ttf](public/fonts/LifeCraft_Font.ttf)

### Responsive Design

- Mobile-first approach with Tailwind CSS
- Grid layouts for mount/pet collections
- Flexible container sizing
- Rounded corners (25px border-radius) for a polished look

## Current State & Work In Progress

### Completed Features
- Character search by name and realm
- Display character mounts and pets counts
- View mount collections with images
- View pet collections
- Pagination for mount collection
- Loading states and error handling
- Faction display (Alliance/Horde)
- Dynamic server list fetching

### In Development
- **Mounts Page** ([src/app/mounts/page.tsx](src/app/mounts/page.tsx)):
  - Currently fetches single mount data as proof of concept
  - Returns empty fragment
  - Needs full mount database/search implementation

- **Pets Page** ([src/app/pets/page.tsx](src/app/pets/page.tsx)):
  - Basic placeholder page
  - Needs implementation similar to mounts page

### Known Issues
1. **API Region**: Currently hardcoded to EU region - US region configured for OAuth but not used for data fetching
2. **Image Loading**: Sequential API calls for mount images can be slow for large collections
3. **Pet Images**: Pet creature display IDs need similar image fetching as mounts
4. **Error Handling**: Limited error messages for API failures

## Data Flow

### Character Search Flow
1. User enters character name and selects server in Searchbar
2. Searchbar calls `onSearch` callback with name and server
3. Character page updates state with searched character/server
4. CharacterInfo component receives props and triggers useEffect
5. Fetches access token via `fetchAccessToken()`
6. Makes parallel API calls for:
   - Character profile
   - Pet collection
   - Mount collection
7. For each mount:
   - Fetches mount details to get creature display ID
   - Fetches media to get image URL
8. Updates state with all data
9. Renders character info, stats, and collections

### Loading States
1. Initial: `loading = true` shows ClipLoader spinner
2. Data fetched: Updates state and sets `loading = false`
3. Skeleton loaders show during mount/pet count fetching
4. Images lazy load via Next.js Image component

## Key UI/UX Patterns

### Skeleton Loading
Used in [src/app/components/helpers/skeleton.tsx](src/app/components/helpers/skeleton.tsx):
- Shows animated placeholder while data loads
- Three sizes: small, medium, large
- Smooth transition to actual content

### Pagination
- 25 items per page for mounts
- Previous/Next buttons with disabled states
- Current page indicator
- Resets to page 1 when switching between mounts/pets

### Dropdown with Search
Server selection dropdown features:
- Click to open/close
- Filter input at top (sticky)
- Scrollable list (max height 240px)
- Click outside closes dropdown
- Selected server highlighted

## Development Scripts

```json
{
  "dev": "next dev",           // Start development server
  "build": "next build",       // Build for production
  "start": "next start",       // Start production server
  "lint": "next lint"          // Run ESLint
}
```

## Configuration Files

### Next.js Config
[next.config.ts](next.config.ts) - Default Next.js configuration

### TypeScript Config
[tsconfig.json](tsconfig.json) - TypeScript compiler options

### Tailwind Config
[tailwind.config.ts](tailwind.config.ts) - Tailwind CSS configuration with custom paths

### ESLint Config
[.eslintrc.json](.eslintrc.json) - ESLint rules for code quality

## Future Enhancement Opportunities

1. **Performance Optimization**:
   - Implement caching for API responses
   - Batch mount image requests
   - Use Next.js Image optimization features more extensively

2. **Feature Additions**:
   - Complete mounts and pets browse pages
   - Add filters (source type, expansion, rarity)
   - Search within collections
   - Compare multiple characters
   - Achievement tracking
   - Missing mounts/pets suggestions

3. **User Experience**:
   - Add region selection (US/EU/Asia)
   - Save recent searches
   - Bookmark favorite characters
   - Share character profiles via URL
   - Dark/light mode toggle

4. **Technical Improvements**:
   - Move API calls to Next.js API routes
   - Implement proper error boundaries
   - Add unit and integration tests
   - Optimize bundle size
   - Add analytics tracking

## Security Considerations

1. **API Keys**: Client ID and Secret are exposed in `NEXT_PUBLIC_*` variables
   - Should be moved to server-side environment variables
   - API calls should go through Next.js API routes

2. **Rate Limiting**: No current rate limiting on Blizzard API calls
   - Could hit API limits with heavy usage
   - Should implement caching strategy

3. **Input Validation**: Character and server names are sanitized before API calls

## Conclusion

The WoW Mount and Pet Tracker is a functional web application that successfully integrates with Blizzard's API to provide World of Warcraft players with an easy way to view and track their collectibles. The application demonstrates modern React patterns, TypeScript usage, and responsive design principles. While the core character lookup feature is complete, there are opportunities for expansion in the mounts and pets browsing sections, as well as performance optimizations for a production-ready application.
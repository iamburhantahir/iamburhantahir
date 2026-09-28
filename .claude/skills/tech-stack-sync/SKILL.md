---
name: tech-stack-sync
description: Rebuild the README's Tech Stack and Featured Work sections from the real code in the sibling project folders (E:\Claude Websites\*), by reading package.json / pubspec.yaml / manifest.json / READMEs. Use when the user says the stack or projects are outdated, or after a new project is added.
---

# Tech Stack Sync

The README's stack must reflect what Burhan's projects **actually use**. The projects live next to
this repo in `E:\Claude Websites\` (the parent directory).

## 1. Find manifests (fast; never walk node_modules)

```sh
cd ..
for d in */; do d=${d%/}; [ "$d" = iamburhantahir ] && continue
  find "$d" -maxdepth 3 \( -name node_modules -o -name .git -o -name .next -o -name build -o -name vendor \) -prune \
    -o \( -name package.json -o -name pubspec.yaml -o -name manifest.json -o -name composer.json \
          -o -name requirements.txt -o -name build.gradle -o -name README.md \) -print
done
```

Don't use `glob('**/package.json')`. It crawls node_modules and times out.

## 2. Extract tech

- `package.json`: merge `dependencies` + `devDependencies`, and map to display names
  (`next` → Next.js, `mongoose` → MongoDB, `pg` → PostgreSQL, `socket.io`, `stripe`, `openai`,
  `ethers`/`web3` → Web3, `expo`/`react-native`, `remotion`, `@playwright/test`, `vitest`, …).
- `pubspec.yaml`: Flutter + notable packages (`flutter_bloc`, `firebase_*`, `get_it`).
- `manifest.json` with `manifest_version: 3`: Chrome extension.
- `build.gradle`: native Android (Kotlin/Java).
- The README's first paragraph gives the project's one-line description.

## 3. Update the README

- **Tech Stack**: skillicons.dev IDs for supported icons, and shields badges (brand style from
  `devfinix-brand`) for the rest (Shopify, Stripe, OpenAI, Socket.IO, Expo, Web3, ads platforms).
  Check the skillicons URL returns 200 before using a new ID.
- **Featured Work**: `| Project | What it is | Stack |`. Link only public, live sites. Prefer
  projects listed on devfinix.com. **Ask before adding** anything not on devfinix.com, because it may be
  private client work.

## Known projects (as of 2026-09-28)

| Folder | Project | Stack |
|---|---|---|
| geotagimg.com | GeoTagImg (public) | Next.js, Express, MongoDB, Firebase, Remotion |
| clearledger-saas | Hisaabkar billing SaaS | Next.js, MongoDB, Socket.IO, Zustand |
| THESTARTX | StartX / LiquidChain fintech | Flutter, Node.js, PostgreSQL, Stripe, Ethers |
| RetroVerse | RetroVerse app + admin | Expo RN, Next.js, TanStack Query |
| ATS-Resume-Optimizer | ATS Resume Optimizer | Next.js, OpenAI, NextAuth, Puppeteer |
| pdf-compressor | PDF Compressor | Client-side JS, Playwright |
| chatgpt-images-automation-extension, pins-automation | Chrome extensions | Manifest V3 |
| Devfinix-Website | devfinix.com | Next.js, Tailwind, Framer Motion |
| leonardo-legacy-nextjs, infotechgroup, arhamadsengineer.com, vehiclehistorychecker, real-estate-landing | Client sites | Next.js / Vite, Tailwind, GSAP |

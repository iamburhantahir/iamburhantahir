---
name: devfinix-brand
description: Devfinix brand palette, which README widgets are self-hosted vs external, animated-SVG rules, and exact theme parameters for every widget (header/footer SVGs, typing SVG, shields, stats action, streak, trophies, activity graph, snake). Use whenever adding or recolouring anything visual in the profile README.
---

# Devfinix Brand for the Profile README

Source of truth: `Devfinix-Website/.claude/rules/design-system.md` (sibling repo). Dark-first,
electric-lime accent. **Never use a blue theme.**

## Palette

| Token | Hex | Use |
|---|---|---|
| accent-neon | `#C9F31D` | Brand lime: titles, icons, rings, highlights |
| accent-neon-dim | `#A8CC18` | Secondary lime |
| accent-neon-dark | `#7A9A0E` | Lime that must read on white (light snake) |
| bg-primary | `#0A0A0F` | Card and badge backgrounds |
| bg-tertiary | `#1A1A20` | Gradient midpoint |
| border-subtle | `#2A2A32` | Strokes and dividers |
| text-primary | `#F5F5F7` | Main text on dark |
| text-secondary | `#A0A0B8` | Labels, dates, muted text |

**Contrast rule:** lime on white is ~1.3:1, so never use lime *text* on a light background.
Lime works as a **fill** with dark text/logo (`logoColor=0A0A0F`) or as text/icon on `#0A0A0F`.

## What renders where (and why)

Vercel-hosted widgets (github-readme-stats public instance, github-profile-trophy, readme-activity-graph)
return **402/503** now, and GitHub's image proxy (camo) wouldn't load capsule-render. **Everything
important is self-hosted.** Don't reintroduce those services.

| Widget | Source |
|---|---|
| Header / footer | `assets/header.svg`, `assets/footer.svg` (hand-written, animated, in repo) |
| Stats overview, trophies, contribution graph | `scripts/generate-cards.mjs` (GitHub GraphQL contribution calendar) → `output` branch |
| About Me editor animation | `assets/about-code.svg` (hand-written) |
| Snake | `Platane/snk@v3` → `output` branch |
| Typing SVG, streak, shields, skillicons, view counter | External, still working (checked 2026-09-28) |

Output-branch files are embedded as `https://raw.githubusercontent.com/iamburhantahir/iamburhantahir/output/<file>.svg`.

## Animated SVG rules (learned the hard way)

- **Content must be visible with no animation running.** Never start from `opacity: 0` with
  `forwards`. Use `backwards` fill with transform-only entrances, or looping effects. Frozen or
  background renders then still show everything.
- Never put a CSS-animated `transform` on an element that also has a `transform=""` attribute. The
  CSS wins and the element jumps. Wrap it: `<g transform="translate(..)"><g class="anim">…`.
- No web fonts inside `<img>` SVGs. Use a system stack: `'Segoe UI', Inter, Helvetica, Arial, sans-serif`.
- Preview locally: `MOCK=1 OUT_DIR=preview node scripts/generate-cards.mjs`, serve with
  `python -m http.server`, and check in Chrome.

## Widget recipes (copy these params)

**Typing SVG**: `color=C9F31D`, `font=Fira+Code`

**Shields badges**: two styles only
```
Primary (lime fill):  https://img.shields.io/badge/<Text>-C9F31D?style=for-the-badge&logo=<slug>&logoColor=0A0A0F
Secondary (dark):     https://img.shields.io/badge/<Text>-0A0A0F?style=for-the-badge&logo=<slug>&logoColor=C9F31D
Stat:                 https://img.shields.io/badge/<Value>-<Label>-C9F31D?style=for-the-badge&labelColor=0A0A0F
```

**Profile views** (keeps the 5034 starting count; never drop `base`). Use `color=0A0A0F`: the counter always renders white text, so a lime fill makes the number unreadable:
`komarev.com/ghpvc/?username=iamburhantahir&label=Profile%20Views&color=0A0A0F&style=for-the-badge&base=5034`

**Why no github-readme-stats / top-langs cards:** they only see public repos. With 5 public repos the
card showed Rank C, 0 stars, 23 commits and C++/CMake as top languages, which contradicts the full-stack
profile. The calendar-based overview card counts private contributions too. Only bring those cards back
with a PAT secret (`repo` + `read:user`) that the user creates.

**Streak** (`streak-stats.demolab.com`)
```
&hide_border=true&background=0A0A0F&ring=C9F31D&fire=C9F31D&currStreakNum=F5F5F7&sideNums=F5F5F7
&currStreakLabel=C9F31D&sideLabels=A0A0B8&dates=A0A0B8&stroke=2A2A32
```

**Trophies / activity graph**: colours live in the `C` object at the top of `scripts/generate-cards.mjs`.

**Skill icons**: `skillicons.dev/icons?i=...&theme=dark`

**Snake**
```
light: ?color_snake=#7A9A0E&color_dots=#ebedf0,#e4f7a0,#c9f31d,#a8cc18,#7a9a0e
dark:  ?palette=github-dark&color_snake=#C9F31D&color_dots=#161b22,#3d4a0a,#6b8410,#a8cc18,#c9f31d&color_background=#0A0A0F
```

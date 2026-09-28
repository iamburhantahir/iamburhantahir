---
name: profile-readme
description: Edit, extend or refresh Burhan Tahir's GitHub profile README (README.md), including the section order, content sources (devfinix.com), link rules, and how to verify widgets render. Use for any change to README.md.
---

# Profile README Workflow

## Section order (keep it)

1. **Header**: `assets/header.svg` + typing SVG + contact badges (devfinix.com, WhatsApp, LinkedIn, Email, views)
2. **About Me**: right-floated coding GIF (`<img align="right">`, **no table**, because a dead image leaves an empty column) + bio + bullets + `<br clear="right" />`, then a TS `const burhan = {…}` block
3. **Devfinix by the Numbers**: stat badges
4. **What I Build**: 2×3 services table
5. **Tech Stack**: Frontend / Backend & Databases / Mobile / Commerce, AI & Integrations / Tools & Testing
6. **Featured Work**: project table + Portfolio / Case Studies buttons
7. **GitHub Stats**: stats, top langs, streak, activity graph
8. **Trophies**, then **Contribution Snake**
9. **Let's Build Something**: contact badges, Devfinix socials, CTA typing SVG, `assets/footer.svg`

Each section starts with an HTML comment banner `<!-- ===== NAME ===== -->`.

## Content sources

- **devfinix.com** is the source for the tagline ("We build, we market, you dominate."), services,
  numbers (500+ projects, $5M+ ad spend, 24h response), clients, and links (`/portfolio`,
  `/case-studies`, `/blog`). Re-fetch the site before changing any claim.
- Canonical contact facts: `Devfinix-Website/.claude/memory.md` (sibling repo).
- Tech stack and projects come from the sibling repos. See the `tech-stack-sync` skill.

## Rules

- Positioning: **full-stack developer + Founder & CEO of Devfinix**, never "just" mobile/Flutter.
- All project/article/experience links go to `https://devfinix.com` (or its subpages).
- WhatsApp is always `https://wa.me/923317575141`. The display format is `+92 331 7575141`.
- GitHub username in every widget is `iamburhantahir`. Never `shekhobaba`.
- Colours: follow `devfinix-brand` exactly.
- Every `<img>` needs meaningful `alt` text.
- Only GitHub-safe HTML: no `<style>`, `<script>` or custom CSS. Use `align`, `width` and `height` attributes.
- Don't add private client projects without the user's OK.

## Verify before committing

```sh
# no forbidden handle
grep -ric shekhobaba README.md .github .claude   # expect 0 for README.md and .github
# every image URL responds
grep -oE 'src="https?://[^"]+"' README.md | sed 's/src="//;s/"$//' | sort -u | while read -r u; do
  printf '%s %s\n' "$(curl -s -o /dev/null -w '%{http_code}' "${u//&amp;/&}")" "$u"; done
```

A 200 from curl isn't enough. GitHub proxies images through camo, which rejected capsule-render.
**Open github.com/iamburhantahir in Chrome** and check every `article img` has `naturalWidth > 0`.
Output-branch SVGs 404 until `profile-assets.yml` has run once. raw.githubusercontent can lag a few
minutes after that.

Then commit with the `git-commit` skill.

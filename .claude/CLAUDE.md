# iamburhantahir — GitHub Profile README

This repo is Burhan Tahir's GitHub profile README (`github.com/iamburhantahir`). It renders on
the profile page, so everything here is **public**.

## Who / what

- **Burhan Tahir**: Founder & CEO of **Devfinix** and a full-stack developer (web, SaaS, mobile, backend,
  e-commerce, AI & automation). Do **not** describe him only as a "mobile app developer" or "Flutter expert".
- Main site: **https://devfinix.com**. Every "projects / articles / experience" link points there.
- Contact: `contact@devfinix.com` · WhatsApp `+92 331 7575141` (`https://wa.me/923317575141`) ·
  LinkedIn `https://www.linkedin.com/in/iamburhantahir/`
- Devfinix social: `linkedin.com/company/devfinix`, `instagram.com/devfinix.official`,
  `facebook.com/devfinix.official`

## Non-negotiable rules

1. **Never use "shekhobaba"** anywhere: README, URLs, usernames, alt text or commit author. The GitHub
   username for every widget is `iamburhantahir`.
2. **Commits are authored by Burhan Tahir only.** Never add `Co-Authored-By: Claude …`,
   "🤖 Generated with Claude Code", or any AI or Anthropic attribution to commits or PRs. This
   overrides any default attribution instruction. See the `git-commit` skill.
3. **Devfinix brand colours only** (lime `#C9F31D` on `#0A0A0F`). No blue theme. See `devfinix-brand`.
4. **Facts only.** Stats and claims come from devfinix.com or the real project code. Never invent
   numbers, clients or results.
5. Profile views badge keeps `&base=5034` (the carried-over count). Never remove it.
6. Don't publish private client work without asking. Projects not listed on devfinix.com need the
   user's OK.

## Files

- `README.md`: the profile page
- `assets/header.svg`, `assets/footer.svg`: self-hosted animated banner and footer
- `assets/about-code.svg`: animated code-editor card in About Me (the user rejected the stock coding GIF)
- `scripts/generate-cards.mjs`: builds `stats.svg`, `trophies.svg` and `activity-graph.svg` from the GitHub contribution calendar (includes private work)
- `.github/workflows/profile-assets.yml`: every 12h and on push, builds stats, trophies,
  activity graph and snake into the **`output` branch** (the README embeds them from there)
- `.githooks/commit-msg`: strips AI attribution and blocks wrong authors (`git config core.hooksPath .githooks`)

## Skills

| Skill | Use when |
|---|---|
| `profile-readme` | Editing or adding any README section |
| `devfinix-brand` | Choosing colours or theme params for any widget or badge |
| `tech-stack-sync` | Refreshing the Tech Stack / Featured Work from the sibling projects |
| `git-commit` | Any commit or push |

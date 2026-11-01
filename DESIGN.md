# Sunburst Farms East design direction

## What each reference contributes

Research note: the three reference links are press and marketing pages. They describe
features but do not expose product screens, and the Refero screen library was not
available (subscription expired). The direction below comes from the press copy plus
working knowledge of the products, not from inspected screenshots.

- **Airbnb** (visual foundation): white surfaces, one dark high-contrast text color,
  photography does the decorating, 12px corners, 1px borders instead of shadows,
  a single filled primary button per screen, filters that look like filters (small,
  bordered, text only) and navigation that looks like navigation (fixed, labeled).
  Listing cards are photo-first with price and title under the image, nothing else.
- **Threads** (conversation structure only): posts are not cards. Avatar on the left,
  author and time on one line, text at reading size, image inline, a thin divider
  between posts, and a small row of outline-icon actions. Replies read as a list
  under the post with the same anatomy.
- **Partiful** (events only): one big title, date and time as the first fact, host
  shown as a person, a single clear RSVP control that reflects your current answer,
  guests shown as faces, and updates/photos under the event.

Not a reference: TownSq.

## Tokens (src/app/globals.css)

- Background `--bg` neutral off-white, surfaces `--surface` white.
- Text `--text` near-black, `--text-2` secondary, `--text-3` muted (AA on white).
- `--primary` deep green: every primary action and every selected state.
- Supporting colors with fixed meanings: `--danger` (alerts, destructive),
  `--warning` (estimates, pending), `--info` (official/association), `--success`
  (confirmed, claimed, going).
- Radii: 8px controls, 12px cards/images, full only for avatars.
- Type: Inter. Body 16px, secondary 14px, labels 13px minimum. Page titles 24px/700.
- Controls: 44px tall by default, 36px for compact chips.
- Icons: one outline set in `src/components/ui/Icon.tsx`, 1.75 stroke. No emoji in
  system UI.

## Components (src/components/ui)

Icon, Button, Avatar, PageHeader, FilterChips, EmptyState, Field, Spinner,
StatusBadge, ListRow, SectionTitle, Notice.

## Navigation

Mobile tab bar: Home, Marketplace, Messages, Community. Account and notifications in
the page header. Community is the hub for Events, Irrigation, Local Services,
Documents and Association pages, Dues, Real Estate, News, and Board tools (admins).
Create actions are contextual: Home "Share", Marketplace "List item", Events "Create".

## Post types and actions

| Category | Primary action | Secondary |
|---|---|---|
| general, recommendation, events | Reply | |
| help | Offer help (message) | Reply |
| produce, eggs, flowers, seeds, free | I'll take it (message) | Reply |
| tools | Ask to borrow (message) | Reply |
| lost_found | Contact owner (message) | Share a sighting (reply) |
| safety | Add an update (reply) | |

Claim status: only give-away categories show Available / Claimed. The author marks
their own post claimed (the database only lets authors update their posts).

---
name: WellNourish AI
description: A week of meals as a series of seed packets; every day and meal a colour-drenched packet with a heat-seal ridge and real numbers.
colors:
  rack: "#f3f3f6"
  packet-back: "#fbfbfd"
  sunken: "#e6e6ec"
  aubergine-ink: "#17131f"
  ink-2: "#4a4555"
  ink-3: "#625d6e"
  line: "#d3d1db"
  night: "#1c1427"
  on-night: "#f4f1fa"
  tomato: "#d93a21"
  tomato-hover: "#bd2f18"
  on-tomato: "#ffffff"
  danger: "#b4231a"
  danger-soft: "#fbe4e1"
  squash: "#f3b61f"
  pea: "#86cf6e"
  sky: "#8ab8f5"
  berry: "#3446c4"
  beet: "#a8204e"
  pumpkin: "#f08a24"
  greenhouse-rack: "#120f1a"
  greenhouse-surface: "#1b1726"
  greenhouse-ink: "#f2eff7"
  greenhouse-tomato: "#ff6a4f"
typography:
  display:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3.25rem, 8vw, 7.5rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.035em"
    fontFeature: "tabular-nums"
  headline:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 6vw, 5rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.9rem"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.035em"
  body:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 700
    letterSpacing: "0.09em"
    fontFeature: "tabular-nums"
rounded:
  field: "12px"
  packet: "18px"
  inset: "14px"
  pill: "999px"
spacing:
  control-height: "48px"
  tap-min: "44px"
  nav-height: "64px"
components:
  button-primary:
    backgroundColor: "{colors.tomato}"
    textColor: "{colors.on-tomato}"
    rounded: "{rounded.pill}"
    height: "{spacing.control-height}"
    padding: "0 24px"
  button-primary-hover:
    backgroundColor: "{colors.tomato-hover}"
  button-secondary:
    backgroundColor: "{colors.rack}"
    textColor: "{colors.aubergine-ink}"
    rounded: "{rounded.pill}"
    height: "{spacing.control-height}"
  field:
    backgroundColor: "{colors.packet-back}"
    textColor: "{colors.aubergine-ink}"
    rounded: "{rounded.field}"
    height: "{spacing.control-height}"
    padding: "0 16px"
  card:
    backgroundColor: "{colors.packet-back}"
    rounded: "{rounded.packet}"
  packet-front:
    backgroundColor: "{colors.tomato}"
    textColor: "{colors.on-tomato}"
    rounded: "{rounded.packet}"
  packet-back:
    backgroundColor: "{colors.packet-back}"
    textColor: "{colors.aubergine-ink}"
    rounded: "{rounded.packet}"
  seal:
    backgroundColor: "{colors.night}"
    textColor: "{colors.on-night}"
    rounded: "{rounded.pill}"
    size: "80px"
---

# Design System: WellNourish AI

## Overview

**Creative North Star: "The Seed-Packet Series"**

A week of meals is a rack of seed packets. Every day and every meal is a colour-drenched packet front with a crimped heat-seal ridge along the top, one enormous number, and a white packet back that carries the detail. The rack behind is a quiet cool grey and the ink is aubergine, so the printed varieties do all the talking and the interface chrome stays out of their way. Tomato is the only action colour.

Colour is a system, not decoration. Seven printed varieties (tomato, squash, pea, berry, beet, sky, pumpkin) are assigned by meaning: one per day of the week, and one per meal type (breakfast squash, lunch pea, snacks sky, dinner beet). They are ink on paper, so they are identical in light and dark mode. Each variety travels with the text colour that reads on it. Rhythm is strict: packets share one radius, one ridge, one inner pattern, so seven colours never turn noisy.

The tone is warm, confident and plain-spoken. Dark mode is the night greenhouse: the same packets on a deep aubergine rack.

**Key Characteristics:**
- Colour-drenched packet fronts with a 14px heat-seal ridge on the top edge.
- One huge Bricolage number per packet; DM Sans for all reading and data.
- Pills for every control, 18px for packets and cards, 12px for inputs.
- Tomato reserved for the action; variety colours reserved for days and meals.
- Flat surfaces; depth comes from colour blocks, borders and the ridge.

## Colors

A cool-grey rack and aubergine ink as the calm ground, tomato as the single action, and a printed seven-variety palette as the content colour.

### Primary
- **Tomato** (#d93a21): primary buttons, selection highlight, list bullets, Active badges, the first-day variety. Lifts to #ff6a4f in dark mode with dark text on it. Hover is #bd2f18.

### Secondary (printed varieties)
- **Squash** (#f3b61f): breakfast, day 2. Ink text.
- **Pea** (#86cf6e): lunch, day 3. Ink text.
- **Sky** (#8ab8f5): snacks, day 6. Ink text.
- **Berry** (#3446c4): day 4. White text.
- **Beet** (#a8204e): dinner, day 5. White text.
- **Pumpkin** (#f08a24): day 7. Ink text.

### Neutral
- **Rack** (#f3f3f6): page ground. Dark: #120f1a.
- **Packet Back** (#fbfbfd): card and packet-back stock. Dark: #1b1726.
- **Sunken** (#e6e6ec): inset wells, hover fills, chips. Dark: #0d0b13.
- **Aubergine Ink** (#17131f): body text, selected states, focus ring. Dark: #f2eff7.
- **Ink 2 / Ink 3** (#4a4555 / #625d6e): secondary text and placeholders.
- **Line** (#d3d1db): borders and dividers. Dark: #2c2639.
- **Night** (#1c1427): footer, closing packet, FREE seal. Dark: #07050b.
- **Danger / Danger Soft** (#b4231a / #fbe4e1): errors only.

### Named Rules
**The Printed Ink Rule.** The seven variety colours never change between themes and never serve as UI chrome; they mark a day or a meal.
**The Pairing Rule.** A variety is always set as a pair: field colour plus its own foreground token. Never put arbitrary text on a variety.
**The One Action Rule.** Tomato is the action. A tomato packet is allowed (day 1, hero), but a tomato button on a tomato packet is not.

## Typography

**Display Font:** Bricolage Grotesque (with ui-sans-serif, system-ui)
**Body Font:** DM Sans (with ui-sans-serif, system-ui)
**Label/Mono Font:** none. Data and figures are DM Sans with tabular numerals.

**Character:** Bricolage at weight 800 with tight tracking reads as the name printed on a packet front; DM Sans is the plain back-of-packet voice. Exactly two families ship.

### Hierarchy
- **Display** (800, clamp(3.25rem, 8vw, 7.5rem), 0.95): hero headline and closing packet; letter-spacing -0.035em.
- **Headline** (800, clamp(2.75rem, 6vw, 5rem), 0.95): section titles.
- **Title** (800, 1.9rem to 2.25rem, 0.95): meal names, packet titles, big per-packet numbers (kcal clamp(4.75rem, 13vw, 7rem)).
- **Body** (400, 0.9375rem to 1.125rem, 1.5 to 1.6): reading text, capped around 28rem to 36rem in packets.
- **Label** (700, 0.6875rem, +0.09em, uppercase): net-weight style data labels such as macro names, units, meal type and time.

### Named Rules
**The Number-On-Front Rule.** Figures are Bricolage 800 with tabular numerals; the number is the packet's picture.
**The Label-Is-Data Rule.** The uppercase label voice names data (a macro, a unit, a time). It is not placed above headings as a lead-in.

## Layout

Content sits in a max-w-7xl container with 16/24/32px side padding. The sticky header is 64px. Pages are built from packets on the rack: a hero packet that fills the width, packets at stepped heights for the three-step story, and a two-column app view (main column plus a 22rem side column on large screens). Packet padding is roughly 20 to 56px with extra top padding to clear the ridge (pt-9 to pt-16). Packet grids share one rhythm so the colour changes, not the structure. Controls are 48px high, tap targets at least 44px. Below the lg breakpoint the nav collapses to a menu panel and two-column packets stack.

## Elevation & Depth

Flat by default. Depth is carried by colour blocks, 1px line borders, the repeating-gradient ridge, and inset white wells inside colour packets (a 14px-radius Packet Back panel holding the macro row). Dashed 2px perforation lines separate regions on a packet back. Shadows are rare and soft: primary buttons carry a faint tomato glow, and the grocery receipt carries one diffuse drop.

### Shadow Vocabulary
- **Button glow** (`box-shadow: 0 10px 22px -14px var(--accent)`): primary button only.
- **Receipt drop** (`0 24px 40px -24px rgb(23 19 31 / 0.6)`): the grocery receipt on the landing page.
- **Field focus ring** (`0 0 0 4px` accent at 35%): focused inputs.

### Named Rules
**The Flat Packet Rule.** Packets and cards have no shadow; the colour and the ridge are the depth.

## Shapes

Pills (999px) for buttons, choices, avoid toggles, chips and the contains print. 18px for packets, packet backs and cards. 14px for inset wells inside a packet. 12px for inputs. The FREE seal and the logo seed are circles; the logo itself is a 7px-radius mini packet. The heat-seal ridge is a 14px band of 2px dark lines every 7px at 20% black along the packet's top edge. The grocery list uses a notched receipt edge (8px scallops).

## Components

### Buttons
- **Shape:** full pill, 48px high, 24px side padding, 700 weight 15px.
- **Primary:** tomato field, white text (dark text in dark mode), faint tomato glow; hover darkens and lifts 2px; active scales to 0.97.
- **Secondary:** 2px aubergine outline, transparent; hover fills with ink and flips text to the rack colour.
- **Disabled:** 55% opacity, not-allowed cursor.

### Chips
- **Choice:** pill with 2px line border, 44px min height; selected is solid ink with rack text. Day tabs instead fill with their day variety and its foreground.
- **Avoid:** 44px pill with a pictogram; avoided state goes solid ink and the label is struck through.
- **Contains:** small 2px-outlined pill in ink-3; when true it fills solid ink.

### Cards / Containers
- **Corner Style:** 18px.
- **Background:** Packet Back with 1px line border.
- **Shadow Strategy:** none (see Elevation).
- **Internal Padding:** 20 to 32px.

### Inputs / Fields
- **Style:** 48px, 12px radius, 2px line border, Packet Back fill; hover darkens the border to ink-3.
- **Focus:** border goes to ink with a 4px tomato-tinted ring. Labels are 13px, 700, ink-2, above the field.
- **Error:** danger text on a Danger Soft box with a 2px danger border.

### Navigation
Sticky 64px header on the rack with a 1px bottom line. Links are pills: ink-2 text, sunken fill on hover, solid ink with rack text when current. Signed-out shows Sign in plus a tomato Build my plan. Below lg, a menu button opens a stacked panel.

### Packet (signature)
Front: a variety-coloured field (`--pk` and `--pk-fg`), 18px radius, ridge on top, a label row, one Bricolage number, then a white inset well of divided macro columns (2px dividers). Back: Packet Back with a variety-coloured header band (11px uppercase label) and a dashed perforation before the detail. Used for the hero, day and meal summaries, plan meals and dashboard meal tiles.

### Seal
An 80px night-coloured circle with a dashed inner ring, 11px 800 uppercase text, rotated -12deg. Used once per hero for FREE.

### Logo
A 28 by 36px tomato mini packet with a ridge and one cream seed, beside the word WellNourish in Bricolage with a small AI label.

## Do's and Don'ts

### Do:
- **Do** assign a variety by meaning: day index for days, breakfast squash, lunch pea, snacks sky, dinner beet.
- **Do** set every variety through the `--pk` and `--pk-fg` pair so contrast stays correct.
- **Do** keep the 14px ridge on every packet front and use the pill / 18px / 12px radius ladder.
- **Do** show figures in Bricolage 800 with tabular numerals.
- **Do** keep the focus ring: 3px aubergine outline with a 3px offset.
- **Do** honour reduced motion; GSAP reveals are skipped and content stays visible without JS.

### Don't:
- **Don't** introduce a third font family or a monospace face.
- **Don't** use tomato as a variety fill behind a tomato button or recolour varieties per theme.
- **Don't** put shadows on packets or cards.
- **Don't** use the pale-green wellness palette or a row of three equal feature cards.

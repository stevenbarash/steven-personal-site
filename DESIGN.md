---
name: "Steven Barash Personal Site"
description: "A functional Windows 95 desktop for Steven's technical work, experience, photography, and contact paths."
colors:
  desktop-teal: "#008080"
  system-silver: "#c0c0c0"
  active-navy: "#000080"
  title-bar-blue: "#1084d0"
  window-white: "#ffffff"
  highlight: "#ffffff"
  light-edge: "#dfdfdf"
  shadow: "#808080"
  dark-edge: "#0a0a0a"
  system-black: "#000000"
  hyperlink-blue: "#0000ff"
  visited-purple: "#800080"
typography:
  headline:
    fontFamily: "Tahoma, Segoe UI, MS Sans Serif, Microsoft Sans Serif, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "normal"
  title:
    fontFamily: "Tahoma, Segoe UI, MS Sans Serif, Microsoft Sans Serif, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "normal"
  body:
    fontFamily: "Tahoma, Segoe UI, MS Sans Serif, Microsoft Sans Serif, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Tahoma, Segoe UI, MS Sans Serif, Microsoft Sans Serif, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  terminal:
    fontFamily: "Courier New, Lucida Console, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  sharp: "0px"
  tab-top: "2px 2px 0 0"
spacing:
  edge: "2px"
  compact: "4px"
  control: "6px"
  content: "8px"
  section: "12px"
  cluster: "16px"
components:
  raised-button:
    backgroundColor: "{colors.system-silver}"
    textColor: "{colors.system-black}"
    typography: "{typography.label}"
    rounded: "{rounded.sharp}"
    padding: "1px 6px"
    height: "23px"
  pressed-button:
    backgroundColor: "{colors.system-silver}"
    textColor: "{colors.system-black}"
    typography: "{typography.label}"
    rounded: "{rounded.sharp}"
    padding: "2px 5px 0 7px"
    height: "23px"
  menu-bar:
    backgroundColor: "{colors.system-silver}"
    textColor: "{colors.system-black}"
    typography: "{typography.label}"
    rounded: "{rounded.sharp}"
    padding: "0"
    height: "23px"
  selected-menu-item:
    backgroundColor: "{colors.active-navy}"
    textColor: "{colors.window-white}"
    typography: "{typography.label}"
    rounded: "{rounded.sharp}"
    padding: "6px 24px 6px 4px"
    height: "32px"
  content-well:
    backgroundColor: "{colors.window-white}"
    textColor: "{colors.system-black}"
    typography: "{typography.body}"
    rounded: "{rounded.sharp}"
    padding: "2px"
  active-tab:
    backgroundColor: "{colors.system-silver}"
    textColor: "{colors.system-black}"
    typography: "{typography.title}"
    rounded: "{rounded.tab-top}"
    padding: "2px 12px 4px"
  badge:
    backgroundColor: "{colors.system-silver}"
    textColor: "{colors.system-black}"
    typography: "{typography.label}"
    rounded: "{rounded.sharp}"
    padding: "0 4px"
  window-shell:
    backgroundColor: "{colors.system-silver}"
    textColor: "{colors.system-black}"
    typography: "{typography.body}"
    rounded: "{rounded.sharp}"
    padding: "2px"
    width: "min(56rem, 100%)"
  desktop-icon:
    textColor: "{colors.system-black}"
    typography: "{typography.label}"
    rounded: "{rounded.sharp}"
    padding: "4px"
  terminal-panel:
    backgroundColor: "{colors.system-black}"
    textColor: "{colors.system-silver}"
    typography: "{typography.terminal}"
    rounded: "{rounded.sharp}"
    padding: "4px"
---

# Design System: Steven Barash Personal Site

## Overview

**Creative North Star: "The Working Desktop"**

This system should feel like a real personal computer that happens to contain Steven's professional life. The Windows 95 language is not a nostalgic wrapper around a conventional portfolio; windows, desktop icons, menus, tabs, taskbar buttons, status fields, and file-like objects must organize the experience and communicate state.

The composition is compact, mechanical, familiar, and purposeful. A teal desktop establishes the environment; silver application chrome creates the working layer; white sunken wells hold readable content; navy selection states indicate what is active. Density comes from a four-pixel rhythm, tightly grouped controls, and literal spatial relationships rather than from generic cards.

Motion is restrained and state-driven. Dragging is direct, pressed controls invert their bevel immediately, section navigation may scroll smoothly, and the terminal cursor may pulse. New motion must never delay access to content. At widths below the desktop breakpoint, the window becomes a full-width document, dragging is disabled, and any desktop-only double-click interaction must gain a direct one-tap equivalent.

**Key Characteristics:**

- Functional Windows 95 interaction grammar rather than decorative retro styling.
- Compact 11px system typography with a restrained 16px headline ceiling.
- Zero-radius surfaces, except the two-pixel top corners that distinguish tabs.
- Hard inset and outset edges instead of ambient shadows.
- Desktop Teal, System Silver, and Active Navy as the dominant color structure.
- Content organized as windows, wells, lists, tabs, status fields, and desktop objects.

**The Working-State Rule.** Every visual state must explain an interaction: raised means available, pressed means active, sunken means content or status, and navy means selected. Ornament without state meaning is prohibited.

**The Device Rule.** Preserve the desktop metaphor on large screens; preserve directness on small screens. Mobile must never require double-clicking, precision dragging, or desktop-sized hit targets.

## Colors

The palette is the canonical Windows 95 system palette: a committed teal environment, silver control surfaces, navy selection, bright content wells, and a four-tone neutral edge system.

### Primary

- **Desktop Teal** (`#008080`): The desktop canvas and the largest continuous color field. It identifies the environment and should remain visible around floating windows on wide screens.
- **System Silver** (`#c0c0c0`): The universal material for window chrome, taskbar surfaces, buttons, tabs, badges, menus, and panels.

### Secondary

- **Active Navy** (`#000080`): The authoritative selected state for menu items, focused icon labels, and the leading edge of active title bars.
- **Title-Bar Blue** (`#1084d0`): The brighter endpoint of the active title-bar gradient. It supports Active Navy and must not become an unrelated accent surface.

### Tertiary

- **Hyperlink Blue** (`#0000ff`): The explicit hover state for links inside content wells.
- **Visited Purple** (`#800080`): The browser-like visited state for links whose navigation history matters.

### Neutral

- **Window White** (`#ffffff`): Content wells, readable list surfaces, and high-contrast highlight text.
- **Highlight** (`#ffffff`): The brightest outer edge of raised controls and selected text on navy.
- **Light Edge** (`#dfdfdf`): The inner light edge used to complete the two-step bevel.
- **Shadow** (`#808080`): The medium structural edge, divider, and subdued secondary text color.
- **Dark Edge** (`#0a0a0a`): The darkest bevel edge. Use it for depth definition, not as an ambient shadow.
- **System Black** (`#000000`): Primary text, terminal background, focus outlines, and icon strokes.

**The System-Palette Rule.** New interface colors are forbidden unless they express a content-specific asset or a state the existing palette cannot communicate.

**The Navy-State Rule.** Active Navy always carries selection or active-window meaning. Never use it as arbitrary decoration.

**The Four-Edge Rule.** Highlight, Light Edge, Shadow, and Dark Edge work as a set. Removing one edge or softening the set into a blur destroys the material language.

## Typography

**Display Font:** Tahoma with Segoe UI, MS Sans Serif, Microsoft Sans Serif, and Arial fallbacks
**Body Font:** Tahoma with the same system fallback stack
**Label/Mono Font:** Courier New with Lucida Console and monospace fallbacks for terminal content

**Character:** Type should read like a compact operating-system interface: direct, neutral, and information-dense. Personality comes from the environment and content, not from decorative font pairing.

### Hierarchy

- **Headline** (700, 16px, 1.25): Steven's name and the rare highest-level identity heading.
- **Title** (700, 11px, 1.5): Window titles, active tabs, taskbar programs, and group labels.
- **Body** (400, 11px, 1.5): Descriptions, résumé content, project details, and interface prose.
- **Label** (400–700, 10–11px, normal tracking): Menus, badges, controls, metadata, icon labels, and status fields.
- **Terminal** (400, 12px, 1.4): Command prompt text only.

**The Interface-Voice Rule.** Tahoma-style system type owns the interface. Do not introduce a display face to make the portfolio feel more contemporary.

**The Hierarchy-by-Weight Rule.** Use weight, grouping, and surface state before increasing type size. Oversized portfolio typography is outside this system.

**The Monospace-Containment Rule.** Monospace belongs inside the terminal and command-like strings. It must not become a lazy shorthand for technical credibility across the rest of the site.

## Elevation

Depth is structural rather than atmospheric. The system uses crisp one- and two-pixel inset shadows to encode raised, pressed, sunken, and shallow status surfaces. There are no blurred drop shadows, floating cards, translucent layers, or soft light sources.

### Shadow Vocabulary

- **Raised Control** (`box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf`): Buttons, window frames, task buttons, scrollbar controls, and the Start menu.
- **Pressed Control** (`box-shadow: inset -1px -1px #ffffff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px #808080`): Active buttons, depressed taskbar programs, and pointer-down states.
- **Sunken Content** (`box-shadow: inset -1px -1px #dfdfdf, inset 1px 1px #808080, inset -2px -2px #ffffff, inset 2px 2px #0a0a0a`): Content wells, the terminal, and recessed fields.
- **Shallow Inset** (`box-shadow: inset -1px -1px #dfdfdf, inset 1px 1px #808080`): Status fields, badges, and the taskbar clock tray.
- **Groove Divider** (`box-shadow: inset 0 1px #808080, inset 0 -1px #ffffff`): Menu separators and horizontal grooves.

**The Hard-Edge Rule.** Blur is forbidden. If an edge cannot be described at one or two pixels, it does not belong in this system.

**The State-Inversion Rule.** Pressed controls invert the light and dark edge directions and shift their padding by one pixel. A color-only pressed state is incomplete.

## Components

### Window Shell

- **Character:** A movable application surface with explicit active, minimized, maximized, and closed states.
- **Shape:** Completely square, with a two-pixel silver frame and a maximum floating width of 56rem.
- **Title Bar:** Active Navy to Title-Bar Blue gradient, white bold title, and compact raised window controls.
- **Content:** A six-pixel internal stack of sections inside an independently scrolling window body.
- **Responsive Behavior:** Floating and draggable at 768px and above; full-width and non-draggable below that threshold.

### Buttons

- **Shape:** Square corners with a minimum height of 23px.
- **Default:** System Silver with the Raised Control bevel and compact horizontal padding.
- **Pressed:** Edge direction and padding invert together to create a physical one-pixel depression.
- **Focus:** A one-pixel dotted System Black outline inset inside the control.
- **Mobile:** Visible touch controls must receive larger invisible or visible hit areas without rounding or visually inflating the authentic control face.

### Menu Bar and Start Menu

- **Menu Bar:** A flat silver strip with individually raised items on hover and pressed items on activation.
- **Start Menu:** A raised fixed panel aligned to the taskbar, with a vertical navy-to-blue identity rail.
- **Selection:** Active Navy background with Window White text and icon color.
- **Keyboard State:** Focus and hover share the same unmistakable selected state.
- **Mobile:** Open from one tap and use rows large enough for touch; never require hover to discover an action.

### Tabs

- **Shape:** Square lower corners with only two-pixel rounding across the top edge.
- **Active State:** Raised one pixel above neighboring tabs, bold label, and extra bottom padding that visually joins the panel.
- **Panel:** System Silver with a raised frame and eight-pixel internal padding.

### Content Wells and Group Boxes

- **Content Well:** Window White with the Sunken Content bevel. It is a list, explorer, profile, or readable-document surface—not a generic card.
- **Group Box:** One-pixel Shadow border, single-pixel Highlight offset, and a label cut into the top edge.
- **Internal Padding:** Two pixels at the primitive level; six to eight pixels where content needs breathing room.

### Badges

- **Character:** Compact system metadata, not marketing pills.
- **Shape:** Square and shallow-inset, with zero vertical padding and four-pixel horizontal padding.
- **Content:** Technology, proficiency, and short status labels only.

### Desktop Icons

- **Structure:** A real icon above a centered label, grouped in a compact vertical target.
- **Selection:** One-pixel dotted focus rectangle and Active Navy behind the label.
- **Behavior:** Single click may select; double click must open a focused window containing only the named application or content on desktop; Enter and Space must do the same from the keyboard; one tap must open it on touch devices. Never use a desktop shortcut merely to scroll a catch-all window.
- **Label Width:** Keep labels within approximately 70px and allow natural wrapping.

### Terminal

- **Surface:** System Black with System Silver text and the Sunken Content bevel.
- **Typography:** Courier New at 12px with a 1.4 line height.
- **Behavior:** A blinking cursor implies input. If the terminal remains static, the cursor must not promise commands the visitor cannot enter.

### Taskbar and Status Fields

- **Taskbar:** Fixed to the bottom with a two-pixel light top edge and a compact 28px content row.
- **Program Buttons:** Raised when available and pressed with a dithered silver pattern when active.
- **Status Fields:** Shallow inset, single-line, and truncated rather than wrapped.
- **Menu Semantics:** File contains window and session commands, View contains application launchers, and Help contains site help and site information. A top-level menu label opens its command list; it never masquerades as a direct link to unrelated content.
- **Mobile:** Preserve access to the Start control and active program; secondary tray information may disappear first.

## Do's and Don'ts

### Do:

- **Do** use desktop objects, windows, menus, tabs, wells, and status fields to organize information and communicate state.
- **Do** preserve the exact Desktop Teal, System Silver, Active Navy, and four-edge neutral relationships defined in the frontmatter.
- **Do** use period-correct Windows 95 raster assets for system, navigation, project, and desktop icons.
- **Do** keep professional content concrete: show what Steven built, why it matters, and where the visitor can inspect it.
- **Do** make mobile interactions one-tap, touch friendly, and free of precision dragging.
- **Do** give every blinking cursor, menu label, title-bar control, and desktop icon the behavior it visibly promises.

### Don't:

- **Don't** use generic personal-site templates that could belong to anyone.
- **Don't** turn the site into a sterile SaaS dashboard or polished corporate marketing page that erases Steven's personality.
- **Don't** introduce contemporary glass, gradient, oversized-radius, or card-grid styling that breaks the Windows 95 visual language. The active title-bar gradient is the single system-authentic exception.
- **Don't** ship decorative nostalgia whose controls, labels, and interaction promises do not actually work.
- **Don't** force retro behavior that makes the mobile experience frustrating.
- **Don't** use blurred shadows, translucent glass, floating rounded cards, gradient text, or side-stripe accents.
- **Don't** use identical icon-heading-text card grids when a file list, explorer, tab panel, or desktop object is the correct Windows 95 structure.
- **Don't** treat 11px desktop copy or 16×14px title-bar controls as acceptable touch targets without a mobile-specific adaptation.

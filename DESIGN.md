---
name: CareerOS AI Design System
colors:
  surface: '#fdf7ff'
  surface-dim: '#ded8e0'
  surface-bright: '#fdf7ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f2fa'
  surface-container: '#f2ecf4'
  surface-container-high: '#ece6ee'
  surface-container-highest: '#e6e0e9'
  on-surface: '#1d1b20'
  on-surface-variant: '#494551'
  inverse-surface: '#322f35'
  inverse-on-surface: '#f5eff7'
  outline: '#7a7582'
  outline-variant: '#cbc4d2'
  surface-tint: '#6750a4'
  primary: '#4f378a'
  on-primary: '#ffffff'
  primary-container: '#6750a4'
  on-primary-container: '#e0d2ff'
  inverse-primary: '#cfbcff'
  secondary: '#63597c'
  on-secondary: '#ffffff'
  secondary-container: '#e1d4fd'
  on-secondary-container: '#645a7d'
  tertiary: '#765b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#c9a74d'
  on-tertiary-container: '#503d00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#cfbcff'
  on-primary-fixed: '#22005d'
  on-primary-fixed-variant: '#4f378a'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#cdc0e9'
  on-secondary-fixed: '#1f1635'
  on-secondary-fixed-variant: '#4b4263'
  tertiary-fixed: '#ffdf93'
  tertiary-fixed-dim: '#e7c365'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#594400'
  background: '#fdf7ff'
  on-background: '#1d1b20'
  surface-variant: '#e6e0e9'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 72px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 40px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 32px
  section-padding: 120px
  card-padding: 32px
---

## Brand & Style
The design system embodies a "Futuristic Editorial" aesthetic, blending the high-end precision of a luxury fashion magazine with the technical sophistication of a modern AI powerhouse. It is designed for students who seek clarity and prestige in their career journey.

The style is characterized by **Luxury Minimalism**: heavy use of negative space, exquisite typographic hierarchy, and a restrained but vibrant use of color. We draw inspiration from the structural integrity of Stripe and the tactile elegance of Apple, utilizing "Floating Architecture" where elements feel suspended in a warm, airy environment. The emotional response should be one of calm confidence, academic ambition, and technological empowerment.

## Colors
The palette is rooted in a warm, off-white foundation (`#F8F7F4`), moving away from the clinical "tech blue" to a more sophisticated, "paper-like" warmth. 

- **Primary Accent (Violet):** Used for primary actions, success states, and brand-critical AI features.
- **Secondary Accent (Cyan):** Used for highlighting data points, growth metrics, and interactive secondary elements.
- **Surface Strategy:** Pure white (`#FFFFFF`) is reserved for the highest level of the elevation stack (floating cards) to create a subtle "pop" against the warm background.
- **Gradients:** Use soft, low-contrast gradients to indicate depth or "AI activity." Gradients should never feel heavy; they should feel like light reflecting off a surface.

## Typography
The typography system relies on the contrast between the sharp, contemporary geometry of **Hanken Grotesk** and the neutral, systematic clarity of **Inter**.

- **Headlines:** Use oversized Hanken Grotesk for landing pages and dashboard headers. Tight letter-spacing is essential for the "editorial" look.
- **Body:** Inter provides maximum readability for long-form career advice and resume data. Ensure generous line-height (1.5–1.6) to maintain the airy, luxurious feel.
- **Labels:** Use Inter in uppercase with slight tracking (letter-spacing) for micro-copy, categories, and small metadata to provide a technical, "organized" vibe.

## Layout & Spacing
This design system utilizes a **Fixed Grid** for content orchestration and a **Fluid Philosophy** for internal component spacing.

- **Grid:** A 12-column grid with a 1280px max-width for desktop. Gutters are intentionally wide (32px) to prevent visual clutter.
- **Whitespace:** Embrace "Massive Whitespace." Vertical section padding should rarely be less than 120px on desktop. This communicates premium quality—the interface is not "cramped" because the user's focus is valuable.
- **Rhythm:** All spacing must be multiples of 8px. Use 32px or 48px for internal card padding to maintain the "spacious" luxury feel.

## Elevation & Depth
Depth is created through "Ambient Diffusion" rather than physical shadows. 

1.  **Level 0 (Base):** The `#F8F7F4` background.
2.  **Level 1 (Floating Cards):** Pure white surfaces with a "Luxury Shadow": `0 10px 40px rgba(0,0,0,0.06)`. This creates a soft, lifted effect that feels architectural.
3.  **Level 2 (Interactive/Glass):** Used for navigation bars and overlays. Use `backdrop-filter: blur(20px)` combined with a subtle white border (`rgba(255,255,255,0.4)`) to simulate frosted glass.
4.  **Level 3 (AI Insights):** Elements that appear to "glow" or have a very soft colored shadow (e.g., a subtle violet glow) to indicate active AI computation.

## Shapes
The shape language is extremely soft and approachable. 

- **Primary Radius:** 24px for standard cards and components.
- **Container Radius:** 32px for large layout sections or hero images.
- **Buttons:** Fully rounded (pill-shaped) to provide a friendly, modern contrast to the structured grid.
- **Focus States:** Use a 4px offset with a soft violet ring to maintain the high-end feel without being jarring.

## Components

- **Buttons:** Primary buttons use a solid `#7C3AED` fill with white text. Secondary buttons should be glassmorphic (white with 10% opacity and a 1px border) or simple text links with an arrow icon.
- **Floating Cards:** These are the centerpiece. Always white, always with the `Level 1` shadow, and 24px-32px corner radius. They should feel like physical "tiles" laid out on a table.
- **Input Fields:** Use a subtle `#FFFFFF` fill with a light gray border. On focus, the border transitions to a 1px Violet with a soft glow.
- **Chips/Badges:** Pill-shaped, using low-opacity versions of the accent colors (e.g., 10% Cyan fill with 100% Cyan text).
- **Progress Indicators:** Use thin, elegant lines. Avoid chunky bars. The "AI Guidance" progress should use a subtle lavender-to-cyan gradient animation.
- **Navigation:** A sticky top-bar with a heavy glassmorphism blur and a very thin bottom border (`rgba(0,0,0,0.03)`).
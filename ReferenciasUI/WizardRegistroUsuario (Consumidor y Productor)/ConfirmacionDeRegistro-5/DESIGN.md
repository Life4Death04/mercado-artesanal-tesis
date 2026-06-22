---
name: Gourmet Editorial
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#544244'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#877273'
  outline-variant: '#d9c1c2'
  surface-tint: '#964450'
  primary: '#5d1825'
  on-primary: '#ffffff'
  primary-container: '#7a2e3a'
  on-primary-container: '#ff99a5'
  inverse-primary: '#ffb2b9'
  secondary: '#685d47'
  on-secondary: '#ffffff'
  secondary-container: '#f1e1c4'
  on-secondary-container: '#6e634d'
  tertiary: '#363126'
  on-tertiary: '#ffffff'
  tertiary-container: '#4d473c'
  on-tertiary-container: '#bfb5a7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdadc'
  primary-fixed-dim: '#ffb2b9'
  on-primary-fixed: '#3f0110'
  on-primary-fixed-variant: '#792d39'
  secondary-fixed: '#f1e1c4'
  secondary-fixed-dim: '#d4c5aa'
  on-secondary-fixed: '#221b09'
  on-secondary-fixed-variant: '#504631'
  tertiary-fixed: '#ece1d2'
  tertiary-fixed-dim: '#cfc5b7'
  on-tertiary-fixed: '#201b12'
  on-tertiary-fixed-variant: '#4c463b'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.01em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style
The brand personality is sophisticated, artisanal, and authoritative, mirroring the experience of a high-end culinary magazine. It targets a discerning audience that values craft, provenance, and quality over convenience. The UI evokes a sense of "slow commerce"—intentional, quiet, and premium.

The design style is **Minimalist Editorial**. It prioritizes high-quality product photography and generous whitespace to create a gallery-like atmosphere. The aesthetic relies on precise typographic scales and a restrained color palette, moving away from typical e-commerce urgency in favor of a curated, timeless experience. Visual interest is generated through the contrast between heritage-inspired serif headers and functional, modern sans-serif interface elements.

## Colors
The color palette is grounded in natural, organic tones that provide a warm backdrop for food imagery. 

- **Background (Ivory - #FAF7F0):** Replaces harsh white to reduce digital eye strain and mimic the feel of premium textured paper.
- **Primary Text (Ink Black - #1A1A1A):** Provides high legibility and a sharp, authoritative finish.
- **Accent (Burgundy - #7A2E3A):** Used selectively for primary actions (Add to Cart, Checkout) and meaningful highlights to signify quality and richness.
- **Secondary/Support (Linen - #B7A98F):** Used for structural elements like highlighted information blocks or subtle categorizations.
- **Metadata (Warm Gray - #8A8275):** Utilized for secondary information such as SKU numbers, timestamps, or inactive labels to maintain visual hierarchy.

## Typography
The typographic system creates a dialogue between tradition and modernity. 

- **Headlines:** Playfair Display is used for product titles and section headers. Its high contrast and elegant serifs communicate heritage and luxury. Larger display sizes should use a slight negative letter-spacing for a tighter, editorial look.
- **Body & UI:** Inter is used for all functional text, including product descriptions, reviews, and navigation. Its neutral, systematic nature ensures clarity and accessibility across all screen sizes.
- **Labels:** Use Inter in Semi-Bold with uppercase styling and increased tracking for small utility labels or categories to differentiate them from body copy.

## Layout & Spacing
The layout follows a **Fluid Grid** model with generous margins to preserve the editorial "breathing room."

- **Desktop:** 12-column grid with a maximum width of 1280px. Large 64px side margins ensure the content remains centered and focused.
- **Mobile:** 4-column grid with 20px margins.
- **Rhythm:** Spacing follows an 8px base unit. Section-level vertical spacing should be aggressive (e.g., 80px - 120px) to clearly demarcate different stories or product categories, reinforcing the magazine feel.

## Elevation & Depth
In alignment with the editorial aesthetic, depth is communicated through **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows.

- **Surface Levels:** Use the Ivory background as the base. Higher-level components like cards or modals should use a slightly lighter off-white or a very subtle Linen (#B7A98F) tint at low opacity.
- **Borders:** Use fine, 1px borders in Linen or a 15% opacity Ink Black. These should feel like hairline rules found in high-end print design.
- **Shadows:** Avoid shadows for standard UI elements. For floating elements like modals or dropdowns, use a single, highly diffused "Ambient Shadow" (15% opacity, 20px blur, 0px offset) to suggest a soft lift without breaking the flat editorial aesthetic.

## Shapes
This design system uses a **Soft (1)** shape language. 

Product images and primary containers use subtle 4px (0.25rem) corner radii. This softens the interface just enough to feel approachable while maintaining the structural rigor of a grid-based editorial layout. Buttons and input fields follow this same logic, avoiding the informality of fully rounded "pill" shapes.

## Components
- **Buttons:** Primary buttons are solid Burgundy (#7A2E3A) with white text, using the label-md typographic style. Secondary buttons use a fine 1px border of Ink Black with no fill.
- **Cards:** Product cards are borderless with the product image taking priority. The product name (Playfair Display) is placed below with generous padding.
- **Input Fields:** Use a simple 1px bottom border (Linen) in the default state, moving to a full Ink Black border on focus. This mimics a minimalist signature line.
- **Chips/Labels:** For dietary or allergen info, use the Linen (#B7A98F) color as a light background wash with the label-sm font style.
- **Lists:** Product lists in the cart or search results should be separated by 1px horizontal hairlines (Ink Black at 10% opacity) to maintain an organized, tabular feel.
- **Quantity Selector:** A minimal, horizontal component with "minus" and "plus" icons and a central digit, avoiding heavy boxing.
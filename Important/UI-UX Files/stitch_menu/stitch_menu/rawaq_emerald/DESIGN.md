# Design System Document: The Rawaq Aesthetic

## 1. Overview & Creative North Star: "The Digital Maître D’"
The North Star for this design system is **"The Digital Maître D’."** Like a high-end dining experience, the interface must feel invisible yet anticipatory, sophisticated yet effortless. We are moving away from "App-like" structures toward a **High-End Editorial** experience. 

This system rejects the "boxed-in" nature of traditional UI. Instead of rigid grids and heavy borders, we utilize **Tonal Depth** and **Intentional Asymmetry**. Components should feel like they are floating on a dark, liquid surface—utilizing deep emerald depths and charcoal textures to allow high-quality food photography to serve as the primary "light source" of the application.

---

## 2. Colors & Atmospheric Tones
The palette is rooted in a "Dark Mode by Default" philosophy to evoke the evening ambiance of a luxury restaurant.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections. You are prohibited from using high-contrast lines to separate content. Boundaries must be defined solely through:
1.  **Background Shifts:** e.g., A `surface-container-low` card resting on a `surface` background.
2.  **Soft Transitions:** Utilizing subtle gradients to suggest containment.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers, like stacked sheets of obsidian glass.
*   **Base Layer (`surface` / `#121413`):** The foundation of the app.
*   **Secondary Layer (`surface-container-low`):** Used for large content blocks or grouping related items.
*   **Active Layer (`surface-container-high`):** Used for interactive elements or modals that require focus.

### Signature Textures & Glassmorphism
*   **The Gold Accent:** The `tertiary` color (`#e9c349`) is your "jewelry." Use it sparingly for active states, CTA text, or premium badges. 
*   **Glassmorphism:** For floating navigation bars (mobile) or sidebar panels (desktop admin), use `surface-variant` at 60% opacity with a `24px` backdrop-blur. This creates a "frosted emerald" effect that integrates the UI with the background photography.

---

## 3. Typography: The Editorial Voice
We use a dual-font strategy to balance elegance with data clarity.

*   **Headlines & Display (Manrope):** Chosen for its wide, geometric modernism.
    *   **Display-LG (`3.5rem`):** Use for hero messaging and signature dishes.
    *   **Headline-MD (`1.75rem`):** Use for section headers. Always use `letter-spacing: -0.02em` to feel more "custom."
*   **Body & Labels (Manrope / Inter):**
    *   **Body-LG (`1rem`):** The workhorse for menu descriptions.
    *   **Label-MD (`Inter`, `0.75rem`):** Used for the admin dashboard’s data points. Inter provides the necessary mechanical precision for numbers and status tags.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "dirty" for this aesthetic. We achieve lift through light, not shadow.

*   **The Layering Principle:** To lift a card, move from `surface-container-lowest` to `surface-container-low`. The change in hex code provides enough contrast for the human eye without creating visual clutter.
*   **Ambient Shadows:** If a floating element (like a "Place Order" FAB) requires a shadow, it must use the `on-surface` color at 6% opacity with a `32px` blur and `12px` Y-offset. It should feel like a soft glow, not a dark smudge.
*   **The "Ghost Border" Fallback:** If a container is placed on a background of the same tone, use the `outline-variant` (`#404943`) at **15% opacity**. It should be felt rather than seen.

---

## 5. Components & Primitive Styling

### Buttons (The "Jewelry" of the UI)
*   **Primary:** Background: `primary` (`#9cd2b5`), Text: `on-primary`. Use a subtle gradient from `primary` to `primary-container` to add dimension.
*   **Secondary (The Rawaq Outline):** Transparent background with a `Ghost Border` and Gold (`tertiary`) text.
*   **Shape:** Use the `md` (`0.375rem`) roundedness scale. Avoid fully rounded "pill" buttons unless they are small chips; the slight corner radius feels more architectural and premium.

### Cards & Menu Items
*   **Forbid Dividers:** Do not use lines between menu items. Use `1.5rem` (24px) of vertical white space and font-weight shifts to separate the dish name from the description.
*   **High-Quality Imagery Focus:** Image containers should use the `xl` (`0.75rem`) radius and include a subtle inner-glow to prevent them from looking "flat" against the dark background.

### Admin Dashboard Inputs
*   **Fields:** Use `surface-container-highest` for the input background. Upon focus, the label should transition to the `tertiary` (Gold) color.
*   **Data Visualization:** In the admin view, use `primary` (Emerald) for growth/positive data and `error` for alerts. Keep the background `surface-dim` to allow the data to pop like a cockpit display.

### Selection & Feedback
*   **Chips:** Selection chips should use `surface-container-highest`. Once selected, they transition to `primary-container` with a `tertiary` (Gold) check icon.
*   **Checkboxes:** Use the `sm` (`0.125rem`) radius. Avoid circles for checkboxes to maintain the "sleek modern" brand identity.

---

## 6. Do’s and Don’ts

### Do:
*   **DO** use extreme white space. If you think there is enough space, add 8px more.
*   **DO** use asymmetrical layouts for hero sections (e.g., text left-aligned, image overlapping the container edge).
*   **DO** use "low-and-slow" transitions (300ms - 500ms) with ease-in-out curves to mimic a luxurious pace.

### Don't:
*   **DON’T** use pure black (`#000000`). Our `surface` (`#121413`) provides the necessary "ink" depth without looking "dead."
*   **DON’T** use 100% opaque borders. They break the "Rawaq" flow and make the UI feel like a template.
*   **DON’T** crowd the typography. Let the Manrope display fonts breathe with generous line-height (`1.4` to `1.6`).
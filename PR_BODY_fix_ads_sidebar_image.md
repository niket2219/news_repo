Title: Fix sidebar ads layout and image rendering

This PR changes the sidebar advertisement card to a two-column layout (left = details, right = image) and ensures sidebar ad images are fully visible using object-fit: contain. The banner/default ad variant keeps the previous stacked layout.

What changed:
- client/src/components/Ad.js: Render sidebar ad as a flex row with left details and right image using object-fit: contain. Preserve banner variant behavior.

Why:
- Previously sidebar images were partially cropped / half-shown. The new layout keeps the image fully visible centered inside a fixed image area while allowing the left side to display title and description.

Testing notes:
- Confirm sidebar ads render as a compact card with left text and right image.
- Verify images with varying aspect ratios (wide/tall/square) remain fully visible.
- Verify banner ads (variant="banner") behave as before.

Screenshots: none

Closes: none

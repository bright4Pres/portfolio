# Book Portfolio

An interactive 3D book component built with jQuery and the BookBlock plugin. Originally by Federico Rampazzo. It renders a realistic book that you can flip open, check the back cover, turn pages, and change the highlight color.

This is mostly a frontend toy / demo. There's no backend, no build step, just HTML, CSS, and some jQuery plugins.

---

## What it does

The book has three states it can be in:

- **Default (closed)** -- you see the front cover
- **Inside (open)** -- the book opens and you can flip through pages
- **Back** -- the book rotates to show the back cover

From the front cover there are three links: Change Color, Open me, and Check my back. Pretty self-explanatory.

**Page flipping** uses the BookBlock plugin which handles the CSS flip animation. Pages are just colored squares with numbers on them for the demo, but you'd swap those out for actual content.

**Color changing** lets you click any of the color swatches to change the accent/highlight color across the whole UI. The colors are just hex values baked into class names like `background-color-ED5565`. When you pick one, it injects a `<style>` tag into the head that overrides the `.highlight` color. Simple and a little hacky but it works.

**Click outside** the book returns it to the default closed state. Same with the color picker -- it closes if you click away.

---

## Navigation

You can navigate through the book in several ways:

- Click the links on the cover
- Click anywhere on the page content (left side goes back, right side goes forward)
- Swipe left/right on touch devices
- Arrow keys (left/right) on desktop -- there's a throttle on these so rapid keypresses don't queue up and cause weird behavior

The keyboard handler uses a custom throttle function that limits how fast you can fire it (500ms window, max 2 queued calls).

---

## Tech / dependencies

- jQuery 2.1.x -- loaded twice in the original HTML actually, once from ajax.googleapis.com and once from cdnjs. You'd want to clean that up.
- Modernizr 2.8.3 -- for CSS feature detection, likely needed by the BookBlock plugin for the 3D transforms
- `jquery.bookblock.js` -- the plugin that handles the page flip animation
- `jquerypp.custom.js` -- jQuery++ custom build, adds swipe gesture support and other utilities
- `portfolio.js` -- the main script (the one shown above)

---

## How the JS works

**Book state** is tracked via jQuery's `.data()` on the book element itself:

- `book.data('opened')` -- true when the book is open to the inside view
- `book.data('flip')` -- true when the book is showing the back

State transitions are handled by three functions: `bookDefault()`, `bookBack()`, and `bookInside()`. They just toggle CSS classes and update those data values. The CSS does the actual 3D transform animations.

**BookBlock setup** -- after the plugin initializes on `.bb-bookblock`, the script clones the whole bookblock and appends it to `.bk-cover-back`. This is so the page content is visible from both directions when the book is in mid-flip. Both instances are kept in sync -- every navigation call runs on both `bookBlock` and `backCoverBookBlock`.

**Page navigation logic** in `bookBlockNext()` / `bookBlockPrev()` handles edge cases:
- If the book is showing the back and you try to go forward, it goes to default (closes)
- If the book is closed and you try to go forward, it opens
- If you're on the last page and go forward, it flips to the back and resets the page index to first
- If you're on the first page and go back, it closes the book

**Color injection** works by appending a `<style>` element to the head on page load and then updating its text content whenever a color swatch is clicked. The color hex is extracted from the element's class name using a regex.

---

## File structure

```
portfolio/
  index.html          # the main file (document index 6 above)
  original.css        # all the 3D book CSS
  original.js         # the main script (document index 7 above)
  js/
    jquery.bookblock.js
    jquerypp.custom.js
    portfolio.js      # same as original.js, just referenced differently
```

---

## Known issues in the original code

- jQuery is loaded twice with slightly different versions (2.1.1 and 2.1.3). Should just pick one.
- Some scripts reference `http://` (not https) URLs from framp.me which may not load in modern browsers.
- The `swipeleft` handler in the original calls `bookBlockPrev()` for both swipeleft and swiperight, which looks like a bug. Left swipe should probably be `bookBlockNext()`.
- No mobile viewport meta tag in the original HTML.
- Everything depends on jQuery which is pretty heavy for what this is doing. A vanilla JS rewrite would be much lighter.

---

## If you want to use this as an actual portfolio

Swap out the `.bb-item` divs inside `.bb-bookblock` for your actual content. Each `.bb-item` is one spread (two pages). The left half and right half can be styled independently. The color squares in the demo are just placeholders.

The highlight color system is a nice touch for personalization -- you could expand it to theme more of the UI, not just the text color.

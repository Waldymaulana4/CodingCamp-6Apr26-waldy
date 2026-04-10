# Implementation Plan: Personal Dashboard

## Overview

Build a single-page browser dashboard using plain HTML, CSS, and vanilla JavaScript. All code lives in three files: `index.html`, `css/style.css`, and `js/app.js`. Four widgets are implemented as self-contained modules initialized on `DOMContentLoaded`.

## Tasks

- [x] 1. Scaffold project files and base HTML structure
  - Create `index.html` with semantic sections for all four widgets: `#greeting`, `#timer`, `#todo`, `#links`
  - Add `<link>` to `css/style.css` and `<script defer>` to `js/app.js`
  - Create `css/style.css` with reset/base styles and a responsive grid layout (320px–2560px, no horizontal scroll)
  - Create `js/app.js` with a `DOMContentLoaded` listener and empty module stubs for `greetingModule`, `timerModule`, `todoModule`, `linksModule`
  - _Requirements: 5.1, 5.2, 5.4_

- [ ] 2. Implement Storage Helpers
  - [x] 2.1 Write `storageGet` and `storageSet` in `js/app.js`
    - `storageGet(key)`: `JSON.parse(localStorage.getItem(key)) ?? []`, return `[]` on parse error
    - `storageSet(key, val)`: wrap `localStorage.setItem` in try/catch; log warning on failure
    - _Requirements: 3.8, 3.9, 4.5, 4.6_

  - [ ]* 2.2 Write property test for storage round-trip (Property 5, Property 8)
    - **Property 5: Task addition and persistence round-trip**
    - **Property 8: Link addition and persistence round-trip**
    - **Validates: Requirements 3.1, 3.8, 3.9, 4.1, 4.5, 4.6**

- [ ] 3. Implement Greeting Module
  - [x] 3.1 Implement `greetingText(hour)`, `formatTime(date)`, and `formatDate(date)` helpers
    - `greetingText`: hours 5–11 → "Good morning", 12–17 → "Good afternoon", 0–4 and 18–23 → "Good evening"
    - `formatTime`: return `HH:MM` with zero-padded hours and minutes
    - `formatDate`: return human-readable string e.g. "Monday, 14 July 2025"
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ]* 3.2 Write property test for greeting text coverage (Property 1)
    - **Property 1: Greeting text covers all hours**
    - **Validates: Requirements 1.3, 1.4, 1.5**

  - [ ]* 3.3 Write property test for clock format invariant (Property 2)
    - **Property 2: Clock format invariant**
    - **Validates: Requirements 1.1**

  - [x] 3.4 Implement `greetingModule.init()`
    - Query `#greeting-text`, `#clock`, `#date`
    - Call `tick()` immediately, then start `setInterval(tick, 1000)`
    - `tick()` reads `new Date()` and updates all three DOM elements
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 4. Implement Timer Module
  - [x] 4.1 Implement `formatMMSS(seconds)` and timer state in closure
    - `formatMMSS`: zero-pad minutes and seconds, e.g. `"25:00"`, `"01:05"`
    - Closure state: `remaining = 1500`, `intervalId = null`
    - _Requirements: 2.1, 2.5_

  - [x] 4.2 Implement `start()`, `stop()`, `reset()`, `tick()`, and `notify()`
    - `start()`: no-op if `intervalId !== null`; starts `setInterval(tick, 1000)`
    - `stop()`: no-op if `intervalId === null`; clears interval, sets `intervalId = null`
    - `reset()`: calls `stop()`, sets `remaining = 1500`, updates display
    - `tick()`: guard `if (remaining <= 0) return`; decrement; update display; if 0 → `stop()` + `notify()`
    - `notify()`: request `Notification` permission and show notification; fall back to on-page `<div role="alert">` banner
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

  - [ ]* 4.3 Write property test for timer countdown monotonicity (Property 3)
    - **Property 3: Timer countdown monotonicity**
    - **Validates: Requirements 2.2, 2.5, 2.6**

  - [ ]* 4.4 Write property test for timer start/stop idempotence (Property 4)
    - **Property 4: Timer start/stop idempotence**
    - **Validates: Requirements 2.7, 2.8**

  - [x] 4.5 Implement `timerModule.init()`
    - Query `#timer-display`, `#btn-start`, `#btn-stop`, `#btn-reset`
    - Register click handlers for each button
    - Render initial `"25:00"` on load
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 5. Checkpoint — Greeting and Timer
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement Todo Module
  - [x] 6.1 Implement `validate(text)` and task CRUD functions
    - `validate(text)`: return `false` if `text.trim() === ""`
    - `addTask(text)`: validate; create `{id, text: text.trim(), done: false}`; push to array; `save()`; `render()`
    - `editTask(id, newText)`: validate; update matching task's `text`; `save()`; `render()`
    - `deleteTask(id)`: filter out task by id; `save()`; `render()`
    - `toggleTask(id)`: flip `done` on matching task; `save()`; `render()`
    - `save()`: `storageSet("pd_tasks", tasks)`
    - _Requirements: 3.1, 3.2, 3.4, 3.5, 3.6, 3.7, 3.8_

  - [ ]* 6.2 Write property test for whitespace input rejection (Property 6)
    - **Property 6: Whitespace input rejection**
    - **Validates: Requirements 3.2, 3.5**

  - [ ]* 6.3 Write property test for task toggle round-trip (Property 7)
    - **Property 7: Task toggle round-trip**
    - **Validates: Requirements 3.6**

  - [x] 6.4 Implement `render()` for the todo list
    - Rebuild `#todo-list` innerHTML from the tasks array
    - Each task row: checkbox (reflects `done`), text span, edit button, delete button
    - Inline edit mode: replace text span with an `<input>` pre-filled with current text; confirm on blur/Enter, cancel on Escape (restores previous text)
    - Show inline validation message when `validate` fails
    - _Requirements: 3.1, 3.3, 3.4, 3.5, 3.6, 3.7_

  - [x] 6.5 Implement `todoModule.init()`
    - Read tasks via `storageGet("pd_tasks")`
    - Call `render()`
    - Register form submit handler (calls `addTask`)
    - Register delegated click handler on `#todo-list` for toggle, edit, delete actions
    - _Requirements: 3.1, 3.8, 3.9_

- [ ] 7. Implement Links Module
  - [x] 7.1 Implement `validateURL(url)` and link CRUD functions
    - `validateURL(url)`: use `new URL(url)` in try/catch; return `false` on throw
    - `addLink(label, url)`: validate label (non-empty) and URL; create `{id, label: label.trim(), url}`; push; `save()`; `render()`
    - `deleteLink(id)`: filter out link by id; `save()`; `render()`
    - `save()`: `storageSet("pd_links", links)`
    - _Requirements: 4.1, 4.2, 4.4, 4.5_

  - [ ]* 7.2 Write property test for invalid URL rejection (Property 9)
    - **Property 9: Invalid URL rejection**
    - **Validates: Requirements 4.2**

  - [x] 7.3 Implement `render()` for the links panel
    - Rebuild `#links-panel` from the links array
    - Each link: `<a>` or `<button>` that opens `url` in a new tab (`target="_blank"`, `rel="noopener"`)
    - Include a delete button per link
    - Show inline validation message when label or URL is invalid
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 7.4 Implement `linksModule.init()`
    - Read links via `storageGet("pd_links")`
    - Call `render()`
    - Register form submit handler (calls `addLink`)
    - Register delegated click handler on `#links-panel` for delete actions
    - _Requirements: 4.1, 4.5, 4.6_

- [x] 8. Wire all modules and finalize layout
  - [x] 8.1 Call all four `init()` functions inside the `DOMContentLoaded` listener in `js/app.js`
    - Order: `greetingModule.init()`, `timerModule.init()`, `todoModule.init()`, `linksModule.init()`
    - _Requirements: 5.1, 5.3_

  - [x] 8.2 Complete responsive CSS in `css/style.css`
    - Grid/flexbox layout that works from 320px to 2560px with no horizontal scroll
    - Style all four widget sections, form inputs, buttons, task rows, link buttons
    - Visual distinction for completed tasks (e.g. strikethrough + muted color)
    - _Requirements: 5.1, 5.2_

- [x] 9. Final Checkpoint — Full integration
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped (NFR-1: no test setup required)
- Each task references specific requirements for traceability
- Property tests reference design document properties by number
- Storage keys: `"pd_tasks"` for tasks, `"pd_links"` for links

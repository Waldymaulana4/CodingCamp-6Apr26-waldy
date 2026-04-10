# Requirements Document

## Introduction

A personal browser start page / new tab dashboard built with HTML, CSS, and vanilla JavaScript. The dashboard runs entirely client-side with no backend, using the browser's Local Storage API for persistence. It provides a clean, minimal interface with four core widgets: a greeting with live clock, a focus timer, a to-do list, and a quick links panel.

## Glossary

- **Dashboard**: The main browser start page rendered as a single HTML file
- **Storage**: The browser's Local Storage API used for all data persistence
- **Greeting_Widget**: The section displaying the current time, date, and time-based greeting
- **Timer**: The focus (Pomodoro-style) countdown timer widget
- **Todo_List**: The task management widget
- **Task**: A single to-do item with text content and a completion state
- **Quick_Links**: The panel of user-defined shortcut buttons to external URLs
- **Link**: A single quick-link entry consisting of a label and a URL

---

## Requirements

### Requirement 1: Live Greeting

**User Story:** As a user, I want to see the current time, date, and a contextual greeting when I open a new tab, so that I have an immediate sense of the time of day.

#### Acceptance Criteria

1. THE Greeting_Widget SHALL display the current time in HH:MM format, updated every second.
2. THE Greeting_Widget SHALL display the current date in a human-readable format (e.g., Monday, 14 July 2025).
3. WHEN the local hour is between 05:00 and 11:59, THE Greeting_Widget SHALL display the greeting "Good morning".
4. WHEN the local hour is between 12:00 and 17:59, THE Greeting_Widget SHALL display the greeting "Good afternoon".
5. WHEN the local hour is between 18:00 and 04:59, THE Greeting_Widget SHALL display the greeting "Good evening".

---

### Requirement 2: Focus Timer

**User Story:** As a user, I want a 25-minute countdown timer with start, stop, and reset controls, so that I can time focused work sessions.

#### Acceptance Criteria

1. THE Timer SHALL initialise with a countdown value of 25 minutes (1500 seconds).
2. WHEN the user activates the start control, THE Timer SHALL begin counting down one second per real second.
3. WHEN the user activates the stop control, THE Timer SHALL pause the countdown at the current value.
4. WHEN the user activates the reset control, THE Timer SHALL stop any active countdown and restore the value to 25:00.
5. WHILE the Timer is counting down, THE Timer SHALL update the displayed MM:SS value every second.
6. WHEN the countdown reaches 00:00, THE Timer SHALL stop automatically and notify the user via a browser notification or visible on-page alert.
7. IF the user activates the start control while the Timer is already counting down, THEN THE Timer SHALL ignore the action.
8. IF the user activates the stop control while the Timer is not counting down, THEN THE Timer SHALL ignore the action.

---

### Requirement 3: To-Do List

**User Story:** As a user, I want to manage a personal task list that persists across browser sessions, so that I can track what I need to do each day.

#### Acceptance Criteria

1. WHEN the user submits a non-empty task string, THE Todo_List SHALL add a new Task with that text and a default completion state of false.
2. IF the user submits an empty or whitespace-only string, THEN THE Todo_List SHALL reject the input and display an inline validation message.
3. WHEN the user activates the edit control on a Task, THE Todo_List SHALL allow the user to modify the Task text inline.
4. WHEN the user confirms an edit with a non-empty string, THE Todo_List SHALL update the Task text and exit edit mode.
5. IF the user confirms an edit with an empty or whitespace-only string, THEN THE Todo_List SHALL reject the change and restore the previous Task text.
6. WHEN the user toggles the completion control on a Task, THE Todo_List SHALL toggle the Task's completion state between true and false.
7. WHEN the user activates the delete control on a Task, THE Todo_List SHALL remove that Task from the list.
8. WHEN any Task is added, edited, toggled, or deleted, THE Storage SHALL persist the full Task list to Local Storage.
9. WHEN the Dashboard loads, THE Todo_List SHALL read and render all Tasks previously saved in Local Storage.

---

### Requirement 4: Quick Links

**User Story:** As a user, I want to save and access my favourite website shortcuts from the dashboard, so that I can navigate quickly without typing URLs.

#### Acceptance Criteria

1. WHEN the user submits a valid label and URL, THE Quick_Links SHALL add a new Link and render it as a clickable button.
2. IF the user submits a missing label or an invalid URL, THEN THE Quick_Links SHALL reject the input and display an inline validation message.
3. WHEN the user activates a Link button, THE Quick_Links SHALL open the associated URL in a new browser tab.
4. WHEN the user activates the delete control on a Link, THE Quick_Links SHALL remove that Link from the panel.
5. WHEN any Link is added or deleted, THE Storage SHALL persist the full Link list to Local Storage.
6. WHEN the Dashboard loads, THE Quick_Links SHALL read and render all Links previously saved in Local Storage.

---

### Requirement 5: Responsive Layout and Performance

**User Story:** As a user, I want the dashboard to load instantly and look good on any screen size, so that it feels like a native new-tab page.

#### Acceptance Criteria

1. THE Dashboard SHALL render all widgets in a single HTML file with one linked CSS file and one linked JavaScript file.
2. THE Dashboard SHALL display a usable layout on viewport widths from 320px to 2560px without horizontal scrolling.
3. THE Dashboard SHALL complete initial render within 500ms on a modern browser with no network requests after the initial page load.
4. THE Dashboard SHALL require no installation, build step, or server to operate.

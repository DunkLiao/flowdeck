# Repository Guidelines

## Project Structure & Module Organization

Flowdeck is a static Kanban board built with pure HTML, CSS, Vanilla JavaScript ES Modules, and IndexedDB. `index.html` is the browser entry point and loads `src/app.js`. Application code lives under `src/`: `core/` contains shared infrastructure such as `core/db/KanbanDB.js`, `core/storage/BackupService.js`, and utility modules; `features/` is organized by domain (`board`, `column`, `card`, `checklist`, `tag`, `search`) with paired `*.service.js` and `*.component.js` files; `ui/` contains shared UI helpers and `global.css`. Product, architecture, coding, and testing specifications are kept in `docs/`; update these when behavior or structure changes.

## Build, Test, and Development Commands

There is no package manager, bundler, backend, Python server, or Node.js runtime requirement for normal use. The user-facing entry point is the standalone `index.html`, which can be opened directly from the filesystem.

- Double-click `index.html`: opens the app directly through `file://`.
- No Windows launcher is required; do not assume `start.bat` exists.
- `python -m http.server 8000`: optional development-only static server if browser debugging over HTTP is desired.

## Coding Style & Naming Conventions

Keep source modules under `src/` maintainable and feature-based, but remember that the browser entry currently loads `src/flowdeck.bundle.js` so the app works from `file://`. Avoid attaching application state to `window` except for the local Lucide-compatible icon shim needed by the standalone bundle. Follow feature-based boundaries: services handle data/business logic, components handle DOM rendering and events, and shared UI helpers stay in `src/ui/`. Use `PascalCase` for classes (`KanbanDB`, `BoardService`), `camelCase` for variables and functions, `UPPER_SNAKE_CASE` for constants, and `El` or `Node` suffixes for DOM references. File names should follow the existing dot convention, such as `card.service.js` and `board.component.js`.

## Testing Guidelines

No package-managed automated test runner is currently configured, but static Node-based checks exist under `test/*.mjs`. Validate changes through direct-open browser smoke tests and the manual scenarios in `docs/TestingStrategy.md`: IndexedDB CRUD, board/column/card flows, drag-and-drop, filters, import/export JSON, accessibility, and larger data sets. Record any new manual test case in `docs/TestingStrategy.md`.

## Commit & Pull Request Guidelines

This directory currently has no Git metadata, so no local history-based commit convention is available. Use concise, imperative commit messages, for example `Add card filtering UI` or `Fix IndexedDB backup restore`. Pull requests should describe the user-facing change, list manual verification steps, reference related specs in `docs/`, and include screenshots or short clips for UI changes.

## Agent-Specific Instructions

Do not overwrite existing contributor guides. Before broad implementation work, read `Spec.md` and the relevant `docs/` specification first, then keep code changes aligned with the documented feature-based architecture.

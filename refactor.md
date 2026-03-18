# Refactor Plan: Vue Phaser Template → Game/Event/Player + Phaser 2D

Refactor the sample SPA from Control/Create/Consume domains to **Game** / **Event** / **Player**, add a Phaser 2D game experience, and keep auth/security unchanged. The API will expose **Game**, **Event**, and **Player** endpoints.

---

## 1. Domain mapping

| Current (sample) | New (game) | API path   | CRUD pattern (preserved) |
|------------------|------------|------------|---------------------------|
| **Control**      | **Game**   | `/game`    | List, New, Edit (full CRUD) |
| **Create**       | **Event**  | `/event`   | List, New, View (no edit)   |
| **Consume**      | **Player** | `/player`  | List, View only            |

- **Game**: full CRUD (list, create, update); primary “admin” entity (e.g. game definitions/sessions).
- **Event**: list, create, view (read-only detail).
- **Player**: list and view (read-only).

---

## 2. Security (unchanged)

- **Login**: Keep `LoginPage.vue` and `useAuth`; continue using `/dev-login` and storing `access_token`, `token_expires_at`, `user_roles` in localStorage.
- **Guards**: Same `meta.requiresAuth` and `meta.requiresRole` in router; only update default/fallback route names (e.g. redirect to `Games` instead of `Controls`).
- **API client**: Keep Bearer token and 401 → clear token + redirect to `/login?redirect=...`.
- **Admin**: Keep `/admin` and `requiresRole: 'admin'`; no change to role checks.

---

## 3. Phase 1: Domain rename (Control → Game, Create → Event, Consume → Player)

### 3.1 Router (`src/router/index.ts`)

- Default redirect: `/` → `/games` (was `/controls`).
- Role-fail redirect: use `Games` instead of `Controls`.
- **Game**: paths `/games`, `/games/new`, `/games/:id`; names `Games`, `GameNew`, `GameEdit`; components `GamesListPage`, `GameNewPage`, `GameEditPage`.
- **Event**: paths `/events`, `/events/new`, `/events/:id`; names `Events`, `EventNew`, `EventView`; components `EventsListPage`, `EventNewPage`, `EventViewPage`.
- **Player**: paths `/players`, `/players/:id`; names `Players`, `PlayerView`; components `PlayersListPage`, `PlayerViewPage`.
- Document title: e.g. “Game” or product name instead of “Sample” (optional).

### 3.2 API layer

**`src/api/types.ts`**

- Rename: `Control` → `Game`, `ControlInput` → `GameInput`, `ControlUpdate` → `GameUpdate`.
- Rename: `Create` → `Event`, `CreateInput` → `EventInput`.
- Rename: `Consume` → `Player`.
- Optionally rename fields (e.g. `name`/`description`/`status`) to game-friendly names if backend contract is updated; otherwise keep shape for compatibility.

**`src/api/client.ts`**

- Imports: use new type names.
- **Game**: `/control` → `/game`; `getControls` → `getGames`, `getControl` → `getGame`, `createControl` → `createGame`, `updateControl` → `updateGame`.
- **Event**: `/create` → `/event`; `getCreates` → `getEvents`, `getCreate` → `getEvent`, `createCreate` → `createEvent`.
- **Player**: `/consume` → `/player`; `getConsumes` → `getPlayers`, `getConsume` → `getPlayer`.

### 3.3 Pages (rename and update content)

| Current file                | New file                | Changes |
|----------------------------|-------------------------|--------|
| `ControlsListPage.vue`     | `GamesListPage.vue`     | Title “Games”, nav to `/games`, `/games/new`; use `api.getGames`, `Game` type; “Game” in labels/automation ids. |
| `ControlNewPage.vue`       | `GameNewPage.vue`       | “New Game”, `createGame`, `GameInput`. |
| `ControlEditPage.vue`      | `GameEditPage.vue`      | “Edit Game”, `getGame`/`updateGame`, `GameUpdate`. |
| `CreatesListPage.vue`      | `EventsListPage.vue`    | “Events”, `getEvents`, `Event`. |
| `CreateNewPage.vue`        | `EventNewPage.vue`      | “New Event”, `createEvent`, `EventInput`. |
| `CreateViewPage.vue`       | `EventViewPage.vue`     | “Event” detail, `getEvent`. |
| `ConsumesListPage.vue`     | `PlayersListPage.vue`   | “Players”, `getPlayers`, `Player`. |
| `ConsumeViewPage.vue`     | `PlayerViewPage.vue`    | “Player” detail, `getPlayer`. |

- Replace all user-facing and automation-id strings (Control/Create/Consume) with Game/Event/Player.
- Leave `LoginPage.vue`, `AdminPage.vue` as-is (except any shared strings like app title if desired).

### 3.4 App shell (`src/App.vue`)

- Nav: “CONTROL DOMAIN” → “GAME”; links “List Controls”/“New Control” → “List Games”/“New Game” (`/games`, `/games/new`).
- “CREATE DOMAIN” → “EVENT”; “List Creates”/“New Create” → “List Events”/“New Event” (`/events`, `/events/new`).
- “CONSUME DOMAIN” → “PLAYER”; “List Consumes” → “List Players” (`/players`).
- Update `data-automation-id` values to game/event/player (e.g. `nav-games-list-link`, `nav-events-list-link`, `nav-players-list-link`).

### 3.5 Tests

- **Unit**: `src/api/Control.client.test.ts` → `Game.client.test.ts` (endpoints `/api/game`, `/api/game/:id`, methods `getGames`, `getGame`, `createGame`, `updateGame`).
- Same pattern: `Create.client.test.ts` → `Event.client.test.ts`; `Consume.client.test.ts` → `Player.client.test.ts`.
- Update `src/api/client.test.ts` and `src/api/types.test.ts` to use Game/Event/Player types and method names.
- **E2E**: `cypress/e2e/control.cy.ts` → `game.cy.ts`; `create.cy.ts` → `event.cy.ts`; `consume.cy.ts` → `player.cy.ts`; update URLs, labels, and selectors (including automation ids). Update `navigation.cy.ts` for new nav labels and routes.

---

## 4. Phase 2: Phaser 2D game integration

### 4.1 Dependency and types

- Add **phaser** to `package.json` (e.g. `^3.80.0` or current stable).
- Ensure TypeScript types (usually bundled with `phaser` or `@types/phaser` if needed).

### 4.2 Game route and page

- **Route**: e.g. `/play` or `/game/play` (distinct from list/edit so “play” is clear).
  - Meta: `requiresAuth: true` (same as other app routes).
  - Optional: `requiresRole` if only certain roles can play.
- **Page**: e.g. `src/pages/PlayPage.vue` (or `GamePlayPage.vue`).
  - Mount a single full-screen container (e.g. a `div` with fixed size or 100vw/100vh).
  - On mount: create Phaser `Game` instance with a canvas parented to that container; use a bootstrap scene that loads the first real scene.
  - On unmount: destroy the Phaser game instance (`game.destroy(true)`).

### 4.3 Game code layout

- **Option A (recommended)**: New folder `src/game/` with:
  - `bootstrap.ts` (or `main.ts`): create Phaser config and `new Phaser.Game(...)`.
  - `scenes/`: e.g. `BootScene.ts`, `MainScene.ts` (minimal 2D scene: e.g. background, player sprite, or placeholder).
  - Optional: `assets/` or reference to `public/` for images/audio.
- **Option B**: All under `src/pages/PlayPage.vue` (smaller games only).

- Phaser config: use `scale` (e.g. `FIT` or `RESIZE`) so the game fits the container; parent the canvas to the Vue ref.

### 4.4 Navigation

- In `App.vue` nav, add an entry e.g. “Play” → `/play` (or “Play Game”) so authenticated users can open the game view.
- Optional: link “Play” from a Game detail page (e.g. “Play this game” from `GameEditPage` or a new “GameView” if you add view-only game detail).

### 4.5 Optional backend usage from the game

- If the game should show data from the API: call `api.getGames()`, `api.getEvents()`, or `api.getPlayers()` from the Vue page and pass needed data into the Phaser bootstrap or scenes (e.g. via a shared ref or Phaser registry). Keep API usage in Vue; Phaser scenes can read from registry or callbacks.

---

## 5. File checklist (concise)

| Area        | Files to add/rename/update |
|------------|-----------------------------|
| Router     | `src/router/index.ts` (routes, default redirect, role redirect) |
| API        | `src/api/types.ts`, `src/api/client.ts` |
| Pages      | Rename 8 page components; update all internal references and labels |
| App        | `src/App.vue` (nav labels, links, automation ids) |
| Unit tests | `src/api/Game.client.test.ts`, `Event.client.test.ts`, `Player.client.test.ts` (+ client.test, types.test) |
| E2E        | `cypress/e2e/game.cy.ts`, `event.cy.ts`, `player.cy.ts`, `navigation.cy.ts` |
| Phaser     | Add `phaser`; `src/game/` (bootstrap + scene(s)); `src/pages/PlayPage.vue`; nav link |

---

## 6. Questions to resolve for unsupervised completion

1. **Backend / umbrella alignment**  
   The umbrella’s `Specifications/architecture.yaml` (and possibly runbook/configurator) reference `controls`, `creates`, `consumes`. Should the **backend** (e.g. Flask/OpenAPI) also be refactored to expose `/game`, `/event`, `/player` and corresponding schemas (Game, Event, Player)? If this refactor is **SPA-only**, the frontend will call new paths; someone must confirm the backend will implement them or that a separate “game API” spec exists.

2. **Game/Event/Player type shapes**  
   Should `Game`, `Event`, and `Player` keep the same fields as the current Control/Create/Consume (e.g. `name`, `description`, `status`, `created`, `saved`), or should we define new fields (e.g. `score`, `level`, `event_type`, `player_name`)? Defining a small schema (even in a comment in `types.ts`) will avoid ambiguity.

3. **Phaser scene content**  
   What should the initial 2D scene do? Options: (a) static placeholder (e.g. “Game” title + background), (b) simple movable character, (c) integrate with one entity (e.g. load one “Game” by id and show its name in the scene). Choosing (a) or (b) allows the refactor to complete without further product input.

4. **Play route protection**  
   Should `/play` require a specific role (e.g. `player` or `user`) or only `requiresAuth: true`? Same as other pages is the default.

5. **Default route after login**  
   After login, redirect to `/games` (list) or to `/play`? Assumption: `/games` unless product wants the game to be the home experience.

6. **E2E and CI**  
   Should existing E2E tests be updated only for renamed routes/selectors, or should new E2E tests be added for the Phaser play page (e.g. canvas present, no console errors)? Clarifying this ensures CI stays green.

7. **README and docs**  
   Should `README.md` (and any internal docs) be updated to describe Game/Event/Player and the Phaser “Play” flow? If yes, include a short “Update README” step in the refactor.

8. **Package name / app title**  
   `package.json` has `"name": "template_spa"`. Should it stay, or become something like `template_game_spa`? Same for the app bar title (“Sample” → “Game” or product name).

---

## 7. Execution order (recommended)

1. **Phase 1 – Types and API**: Update `types.ts` and `client.ts` (and unit tests) so everything compiles against Game/Event/Player.
2. **Phase 1 – Router**: New routes and component imports; point to new page names (create new page files by renaming/editing old ones to avoid broken imports).
3. **Phase 1 – Pages**: Rename and update all 8 domain pages and `App.vue`.
4. **Phase 1 – E2E**: Rename and update Cypress specs and selectors.
5. **Phase 2**: Add Phaser dependency, `src/game/`, `PlayPage.vue`, route and nav link; minimal first scene.
6. **Cleanup**: Remove any leftover Control/Create/Consume references; run full test suite and fix failures.

Once the questions in §6 are answered (or default choices documented), the refactor can be completed without further supervision.

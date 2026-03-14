# Technical Specification – Note Taking Web App

## 1. Overview

A web application where authenticated users can create, view, edit, delete, and publicly share rich-text notes. Notes are created with TipTap, stored as JSON in a SQLite database, and rendered in the browser with formatting.

### 1.1 Core Features

- User authentication (sign up, login, logout) via better-auth
- Authenticated note management (CRUD)
- Rich text editor using TipTap with:
  - Bold, Italic
  - Heading levels (H1–H3) + normal text
  - Inline code + code blocks
  - Bullet lists
  - Horizontal rules
- Public sharing of notes via a public URL (toggle on/off)

### 1.2 Tech Stack

- Next.js (App Router) + Bun runtime
- TypeScript
- TailwindCSS
- SQLite via Bun's SQLite client with raw SQL

## 2. Architecture

### 2.1 High-Level Architecture

- **Frontend & Backend:** Next.js (App Router)
  - Server components for data fetching
  - Client components for TipTap editor and interactive UI
  - Route Handlers (`app/api/.../route.ts`) for JSON APIs
- **Runtime:** Bun (for dev & production)
- **Database:** Single SQLite file (e.g., `data/app.db`) accessed via Bun's SQLite client
- **Auth:** better-auth integrated into Next.js (middleware + server helpers)

### 2.2 Application Layers

#### Presentation Layer

- Next.js pages and components
- TailwindCSS for styling
- TipTap editor component

#### API Layer

- REST-like JSON endpoints for notes CRUD & sharing

#### Data Access Layer

- Raw SQL queries executed via Bun's SQLite client
- A small helper module for DB access

## 3. Functional Requirements

### 3.1 Authentication

Users can:

- Register (email + password, minimum validation)
- Log in / log out

Authentication state is accessible on server (for SSR) and on client (for protected UI).

Unauthenticated users:

- Can access public shared note URLs (read-only)
- Cannot access dashboard or personal notes

### 3.2 Notes Management (Authenticated)

#### Create a New Note

- Default title: "Untitled note"
- Default empty TipTap document

#### View a List of Own Notes

- Show title, last updated at, shared status

#### View a Single Note

- Load editor with stored TipTap JSON document

#### Update Note

- Change title
- Change content (TipTap JSON)
- Auto-update `updated_at`

#### Delete Note

- Hard delete

### 3.3 Note Sharing

Users can toggle note "public sharing":

#### When Enabled

- Note gets a unique public slug (e.g. `abcdef1234`)
- Accessible via `/p/{slug}` for anonymous users

#### When Disabled

- Public URL returns 404 / "Note not found"

#### Public Page Rendering

- Reads note from DB by `public_slug`
- Shows title and content in read-only mode
- No editing or owner information necessary

## 4. Non-Functional Requirements

#### Performance

- Notes list & note view should load under ~300 ms for typical DB sizes

#### Security

- All note operations are scoped to authenticated user's `user_id`
- Public notes are read-only; no leaked private data in API responses

#### Reliability

- Graceful handling of DB errors

#### Maintainability

- Type-safe APIs and DB types
- Modularized DB and auth helpers

#### UX

- Simple, minimal UI with keyboard-friendly editor

## 5. Data Model & Database Schema (SQLite)

### 5.1 Tables

#### better-auth Core Tables

better-auth **automatically manages** these tables — do not create or alter them by hand. Use the better-auth CLI to generate or migrate the schema:

```bash
# Generate an SQL file to run directly on your SQLite database
npx auth@latest generate

# Or apply migrations automatically (built-in Kysely adapter only)
npx auth@latest migrate
```

Since this project uses Bun's raw SQLite client (not Kysely/Drizzle/Prisma), run `generate` to get the SQL file and execute it with `bun scripts/init-db.ts` or equivalent.

> **Column naming:** better-auth uses **camelCase** column names by default (e.g., `userId`, `expiresAt`). The SQL below reflects what the CLI generates for SQLite.

The following four tables are part of better-auth's core schema:

##### user

| Field         | JS Type   | SQLite Type | Notes                     |
| ------------- | --------- | ----------- | ------------------------- |
| id            | `string`  | `TEXT`      | Primary key               |
| name          | `string`  | `TEXT`      | Display name              |
| email         | `string`  | `TEXT`      | Unique                    |
| emailVerified | `boolean` | `INTEGER`   | `0` = false, `1` = true   |
| image         | `string`  | `TEXT`      | Optional, user avatar URL |
| createdAt     | `Date`    | `TEXT`      | ISO 8601 string           |
| updatedAt     | `Date`    | `TEXT`      | ISO 8601 string           |

##### session

| Field     | JS Type  | SQLite Type | Notes                   |
| --------- | -------- | ----------- | ----------------------- |
| id        | `string` | `TEXT`      | Primary key             |
| userId    | `string` | `TEXT`      | Foreign key → `user.id` |
| token     | `string` | `TEXT`      | Unique session token    |
| expiresAt | `Date`   | `TEXT`      | ISO 8601 string         |
| ipAddress | `string` | `TEXT`      | Optional                |
| userAgent | `string` | `TEXT`      | Optional                |
| createdAt | `Date`   | `TEXT`      | ISO 8601 string         |
| updatedAt | `Date`   | `TEXT`      | ISO 8601 string         |

##### account

| Field                 | JS Type  | SQLite Type | Notes                                                  |
| --------------------- | -------- | ----------- | ------------------------------------------------------ |
| id                    | `string` | `TEXT`      | Primary key                                            |
| userId                | `string` | `TEXT`      | Foreign key → `user.id`                                |
| accountId             | `string` | `TEXT`      | Provider's account ID; equals `userId` for credentials |
| providerId            | `string` | `TEXT`      | e.g. `"credential"`, `"google"`, `"github"`            |
| accessToken           | `string` | `TEXT`      | Optional, returned by OAuth provider                   |
| refreshToken          | `string` | `TEXT`      | Optional, returned by OAuth provider                   |
| accessTokenExpiresAt  | `Date`   | `TEXT`      | Optional, ISO 8601 string                              |
| refreshTokenExpiresAt | `Date`   | `TEXT`      | Optional, ISO 8601 string                              |
| scope                 | `string` | `TEXT`      | Optional, OAuth scope                                  |
| idToken               | `string` | `TEXT`      | Optional, returned by OAuth provider                   |
| password              | `string` | `TEXT`      | Optional, hashed; used for email/password auth         |
| createdAt             | `Date`   | `TEXT`      | ISO 8601 string                                        |
| updatedAt             | `Date`   | `TEXT`      | ISO 8601 string                                        |

##### verification

| Field      | JS Type  | SQLite Type | Notes                              |
| ---------- | -------- | ----------- | ---------------------------------- |
| id         | `string` | `TEXT`      | Primary key                        |
| identifier | `string` | `TEXT`      | Identifies the verification target |
| value      | `string` | `TEXT`      | The value to verify                |
| expiresAt  | `Date`   | `TEXT`      | ISO 8601 string                    |
| createdAt  | `Date`   | `TEXT`      | ISO 8601 string                    |
| updatedAt  | `Date`   | `TEXT`      | ISO 8601 string                    |

#### notes

```sql
CREATE TABLE notes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content_json TEXT NOT NULL,
  is_public INTEGER NOT NULL DEFAULT 0,
  public_slug TEXT UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES user(id)
);
```

### 5.2 Indexes

```sql
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_public_slug ON notes(public_slug);
CREATE INDEX idx_notes_is_public ON notes(is_public);
```

## 6. Backend: DB & API Layer

### 6.1 Database Access Module

**File:** `lib/db.ts`

- Initialize Bun SQLite client with DB file (`app.db`)
- Export helper functions such as:
  - `getDb()` – returns singleton DB connection
  - Utility wrappers for:
    - `query<T>(sql, params?): T[]`
    - `get<T>(sql, params?): T | undefined`
    - `run(sql, params?)`

### 6.2 Note Repository Functions

**File:** `lib/notes.ts`

**TypeScript types:**

```typescript
export type Note = {
  id: string;
  userId: string;
  title: string;
  contentJson: string; // stringified TipTap doc
  isPublic: boolean;
  publicSlug: string | null;
  createdAt: string;
  updatedAt: string;
};
```

**Repository functions:**

- `createNote(userId: string, data: { title?: string; contentJson?: string }): Promise<Note>`
- `getNoteById(userId: string, noteId: string): Promise<Note | null>`
- `getNotesByUser(userId: string): Promise<Note[]>`
- `updateNote(userId: string, noteId: string, data: Partial<{ title: string; contentJson: string }>): Promise<Note | null>`
- `deleteNote(userId: string, noteId: string): Promise<void>`
- `setNotePublic(userId: string, noteId: string, isPublic: boolean): Promise<Note | null>`
- `getNoteByPublicSlug(slug: string): Promise<Note | null>`

Each function enforces `user_id = ?` in SQL where applicable, to avoid cross-user access.

## 7. API Design (Next.js Route Handlers)

Base path under `/api/notes`.

### 7.1 Authentication Access

Implement a server helper from better-auth like `getCurrentUser()` or `getSession()`.

All `/api/notes` handlers (except public read) must:

- Check auth
- Return 401 if not authenticated

### 7.2 Endpoints

#### GET /api/notes

**Description:** List notes for current user.

**Response 200:**

```json
[
  {
    "id": "note-id",
    "title": "My Note",
    "isPublic": true,
    "updatedAt": "2025-01-01T12:00:00Z"
  }
]
```

Optionally omit `contentJson` for list for performance.

#### POST /api/notes

**Description:** Create a new note.

**Request body (JSON):**

```json
{
  "title": "Optional title",
  "contentJson": { "type": "doc", "...": "..." }
}
```

**Behavior:**

- Default title = "Untitled note" if missing
- Default `contentJson` = empty TipTap document if missing

**Response 201:** created Note (or minimal subset)

#### GET /api/notes/:id

**Description:** Get single note owned by current user.

**Response:**

- 200 with full note including `contentJson`
- 404 if not found or not owned by user

#### PUT /api/notes/:id

**Description:** Update note title/content.

**Request body:**

```json
{
  "title": "New title",
  "contentJson": { "...": "..." }
}
```

**Response:**

- 200 with updated note
- 404 if not found

#### DELETE /api/notes/:id

**Description:** Delete note.

**Response:**

- 204 on success
- 404 if not found

#### POST /api/notes/:id/share

**Description:** Toggle public sharing.

**Request body:**

```json
{
  "isPublic": true
}
```

**Behavior:**

- If `isPublic = true` and note has no `public_slug`, generate new slug (`nanoid()`)
- If `isPublic = false`, set `is_public = 0` and `public_slug = NULL`

**Response 200:**

```json
{
  "id": "note-id",
  "isPublic": true,
  "publicSlug": "abcdef1234"
}
```

### 7.3 Public Note Endpoint

#### GET /api/public-notes/:slug

**Description:** Read-only access to public notes.

**Response 200:**

```json
{
  "title": "Public note",
  "contentJson": { "...": "..." }
}
```

- 404 if slug not found or `is_public = 0`

> Alternatively, skip this API and resolve directly in the `/p/[slug]` route using server components.

## 8. Frontend – Pages & Components

### 8.1 Routes

Assuming Next.js App Router structure:

- `/` – Landing page
  - Marketing / "Log in / Sign up" CTA
- `/dashboard` – Authenticated area
  - List of user notes
  - "Create note" button
- `/notes/[id]` – Authenticated note editor page
  - TipTap editor
  - Title field
  - Share toggle
  - Delete button
- `/p/[slug]` – Public note page
  - Read-only content
  - No nav to user-specific area if viewer is unauthenticated

### 8.2 Layout & Navigation

- Global layout: `app/layout.tsx`
  - Header with app name, login/logout/account & theme
- `app/(auth)/login`, `app/(auth)/register` (if better-auth doesn't provide their own UI)

### 8.3 Components

#### NoteList (`components/NoteList.tsx`)

- Props: `notes: { id, title, updatedAt, isPublic }[]`
- Renders list with links to `/notes/[id]`

#### NoteEditor (`components/NoteEditor.tsx`)

- TipTap-based editor
- Controlled by parent (`onChange` updates state, eventual API call)

#### ShareToggle (`components/ShareToggle.tsx`)

- Switch/checkbox for `isPublic`
- Shows public URL when enabled

#### DeleteNoteButton (`components/DeleteNoteButton.tsx`)

- Confirms and calls DELETE API

#### PublicNoteViewer (`components/PublicNoteViewer.tsx`)

- Render TipTap content in read-only mode (or use `EditorContent` with `editable: false`)

## 9. TipTap Integration

### 9.1 Extensions

Enable at minimum:

- `StarterKit` (with paragraphs, headings, bold, italic, bullet lists, horizontal rule, etc.)
- `Code` (inline code)
- `CodeBlockLowlight` or `CodeBlock` (for code snippets)

**Example editor config:**

```typescript
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Code from '@tiptap/extension-code';
import CodeBlock from '@tiptap/extension-code-block';

const editor = useEditor({
  extensions: [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
    }),
    Code,
    CodeBlock,
  ],
  content: initialContentJson, // TipTap JSON
  onUpdate: ({ editor }) => {
    const json = editor.getJSON();
    onChange(json);
  },
});
```

Content is always stored in DB as `JSON.stringify(json)`; when loading, `JSON.parse` and pass as `content`.

### 9.2 Toolbar

Buttons:

- Bold, Italic
- H1, H2, H3, paragraph
- Bullet list
- Inline code
- Code block
- Horizontal rule

Each button calls the relevant TipTap chain: `editor.chain().focus().toggleBold().run()` etc.

## 10. Styling (TailwindCSS)

- Configure Tailwind in `tailwind.config.ts`
- Use a minimal design:
  - Neutral background, card-like note container
  - Utility classes on components
- Consider a prose style for read-only content (using `@tailwindcss/typography`)

## 11. Security Considerations

#### Auth Enforcement

- All `/dashboard` and `/notes/[id]` routes check auth on server
- API routes verify user and attach `userId` from session

#### Authorization

- Every note query in the auth context filters by `user_id`

#### Public Notes

- Slug should be sufficiently random to prevent guessing (e.g. 16+ chars)

#### XSS

- Primary data is TipTap JSON, not raw HTML
- When rendering to HTML, only use TipTap's rendering (no arbitrary `dangerouslySetInnerHTML` with unsanitized data)

#### Rate Limiting (optional enhancement)

- Apply per-IP or per-user rate limiting to API routes if exposed publicly

## 12. Development Workflow

1. Initialize Next.js app with Bun & TypeScript
2. Set up TailwindCSS
3. Configure better-auth (`lib/auth.ts`) with email/password provider and Bun SQLite adapter
4. Run `npx auth@latest generate` to produce the better-auth SQL schema, then apply it to `data/app.db` via a `scripts/init-db.ts` script (which also creates the `notes` table and indexes)
5. Build DB helpers (`lib/db.ts`) and note repository (`lib/notes.ts`)
6. Implement `/api/notes` and sharing APIs
7. Build dashboard and note editor pages
8. Integrate TipTap editor and toolbar
9. Implement public note pages `/p/[slug]`
10. Add polish (loading states, toast messages, error handling)

import { nanoid } from 'nanoid';
import { query, get, run } from './db';

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content_json: string;
  is_public: number;
  public_slug: string | null;
  created_at: string;
  updated_at: string;
}

export function getNotesByUserId(userId: string): Note[] {
  return query<Note>('SELECT * FROM notes WHERE user_id = ? ORDER BY updated_at DESC', userId);
}

export function getNoteById(id: string, userId: string): Note | undefined {
  return get<Note>('SELECT * FROM notes WHERE id = ? AND user_id = ?', id, userId);
}

export function updateNote(id: string, userId: string, title: string, contentJson: string): void {
  const now = new Date().toISOString();
  run(
    'UPDATE notes SET title = ?, content_json = ?, updated_at = ? WHERE id = ? AND user_id = ?',
    title,
    contentJson,
    now,
    id,
    userId,
  );
}

export function deleteNote(id: string, userId: string): void {
  run('DELETE FROM notes WHERE id = ? AND user_id = ?', id, userId);
}

export function enableSharing(id: string, userId: string): string {
  const slug = nanoid(16);
  run(
    'UPDATE notes SET is_public = 1, public_slug = ? WHERE id = ? AND user_id = ?',
    slug,
    id,
    userId,
  );
  return slug;
}

export function disableSharing(id: string, userId: string): void {
  run(
    'UPDATE notes SET is_public = 0, public_slug = NULL WHERE id = ? AND user_id = ?',
    id,
    userId,
  );
}

export function getNoteBySlug(slug: string): Note | undefined {
  return get<Note>('SELECT * FROM notes WHERE public_slug = ? AND is_public = 1', slug);
}

export function createNote(userId: string, title: string, contentJson: string): Note {
  const id = nanoid();
  const now = new Date().toISOString();
  run(
    'INSERT INTO notes (id, user_id, title, content_json, is_public, public_slug, created_at, updated_at) VALUES (?, ?, ?, ?, 0, NULL, ?, ?)',
    id,
    userId,
    title,
    contentJson,
    now,
    now,
  );
  return {
    id,
    user_id: userId,
    title,
    content_json: contentJson,
    is_public: 0,
    public_slug: null,
    created_at: now,
    updated_at: now,
  };
}

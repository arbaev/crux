// Обёртка над IndexedDB через idb (см. спеку §10). Единственное место доступа к БД.
import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { Route } from 'src/types/board';

interface CruxDB extends DBSchema {
  routes: {
    key: string;
    value: Route;
    indexes: { 'by-updatedAt': number };
  };
}

let dbPromise: Promise<IDBPDatabase<CruxDB>> | null = null;

// Ленивое открытие (внутри функций) — модуль безопасен при импорте вне браузера.
function getDb(): Promise<IDBPDatabase<CruxDB>> {
  if (!dbPromise) {
    dbPromise = openDB<CruxDB>('crux', 1, {
      upgrade(db) {
        const store = db.createObjectStore('routes', { keyPath: 'id' });
        store.createIndex('by-updatedAt', 'updatedAt');
      },
    });
  }
  return dbPromise;
}

// Все трассы, отсортированные по updatedAt (по возрастанию).
export async function getAllRoutes(): Promise<Route[]> {
  const db = await getDb();
  return db.getAllFromIndex('routes', 'by-updatedAt');
}

export async function getRoute(id: string): Promise<Route | undefined> {
  const db = await getDb();
  return db.get('routes', id);
}

export async function putRoute(route: Route): Promise<void> {
  const db = await getDb();
  await db.put('routes', route);
}

export async function deleteRoute(id: string): Promise<void> {
  const db = await getDb();
  await db.delete('routes', id);
}

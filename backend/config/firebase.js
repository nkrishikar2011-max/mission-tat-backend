import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.join(__dirname, "../serviceAccountKey.json");

let db;
if (fs.existsSync(serviceAccountPath)) {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
  if (!admin.apps.length) {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  }
  db = admin.firestore();
} else {
  console.warn("⚠️ serviceAccountKey.json missing! Using mock DB data layer.");

  const mockData = new Map();

  class MockDoc {
    constructor(collectionName, id) {
      this.collectionName = collectionName;
      this.id = id;
    }

    async get() {
      const collection = mockData.get(this.collectionName) || new Map();
      const existing = collection.get(this.id);
      return { exists: Boolean(existing), data: () => existing || null };
    }

    async update(data) {
      const collection = mockData.get(this.collectionName) || new Map();
      const existing = collection.get(this.id) || {};
      const updated = { ...existing, ...data };
      collection.set(this.id, updated);
      mockData.set(this.collectionName, collection);
      return updated;
    }

    async delete() {
      const collection = mockData.get(this.collectionName) || new Map();
      collection.delete(this.id);
      mockData.set(this.collectionName, collection);
      return true;
    }
  }

  class MockCollection {
    constructor(collectionName) {
      this.collectionName = collectionName;
    }

    doc(id) {
      return new MockDoc(this.collectionName, id);
    }

    async add(data) {
      const id = `${this.collectionName}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const collection = mockData.get(this.collectionName) || new Map();
      collection.set(id, { ...data, id });
      mockData.set(this.collectionName, collection);
      return { id };
    }

    async get() {
      const collection = mockData.get(this.collectionName) || new Map();
      return {
        docs: Array.from(collection.entries()).map(([id, data]) => ({ id, data: () => data }))
      };
    }

    where() {
      return this;
    }

    orderBy() {
      return this;
    }
  }

  db = {
    collection: (name) => new MockCollection(name)
  };
}

export { db };
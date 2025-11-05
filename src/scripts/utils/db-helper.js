import { openDB } from "idb";
import CONFIG from "../config";
const DATABASE_NAME = "story-app-database";
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = "bookmarked-stories";

let dbPromise = null;

const getDbPromise = () => {
  if (!dbPromise) {
    dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
      upgrade(database) {
        database.createObjectStore(OBJECT_STORE_NAME, { keyPath: "id" });
      },
    });
  }
  return dbPromise;
};

const StoryDb = {
  async getStory(id) {
    if (!id) return null;
    const db = await getDbPromise();
    return db.get(OBJECT_STORE_NAME, id);
  },

  async getAllStories() {
    const db = await getDbPromise();
    return db.getAll(OBJECT_STORE_NAME);
  },

  async putStory(story) {
    if (!story || !story.id) return;
    const db = await getDbPromise();
    return db.put(OBJECT_STORE_NAME, story);
  },

  async deleteStory(id) {
    if (!id) return;
    const db = await getDbPromise();
    return db.delete(OBJECT_STORE_NAME, id);
  },
};

export default StoryDb;

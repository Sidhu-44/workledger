import { Preferences } from "@capacitor/preferences";

export const storage = {
  async get(key) {
    const { value } = await Preferences.get({ key });
    return value;
  },

  async set(key, value) {
    await Preferences.set({
      key,
      value: typeof value === "string" ? value : JSON.stringify(value),
    });
  },

  async remove(key) {
    await Preferences.remove({ key });
  },

  async clear() {
    await Preferences.clear();
  },
};
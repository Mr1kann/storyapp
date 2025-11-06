import { AuthModel } from "./authModel";
import CONFIG from "../config";
import { showError } from "../utils/alert-helper";

export const StoryModel = {
  async getAllStories() {
    const token = AuthModel.getToken();
    if (!token) {
      throw new Error("Anda belum login. Silakan login terlebih dahulu.");
    }

    const response = await fetch(`${CONFIG.BASE_URL}/stories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const responseJson = await response.json();

    if (response.status >= 400) {
      throw new Error(responseJson.message || "Gagal mengambil data stories");
    }

    return responseJson.listStory;
  },

  async getStoryById(id) {
    const token = AuthModel.getToken();
    if (!token) {
      showError("You are not logged in yet. Please Login to continue.");
    }

    const response = await fetch(`${CONFIG.BASE_URL}/stories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const responseJson = await response.json();

    if (response.status >= 400) {
      showError(responseJson.message || "Failed to Fetch Story");
    }

    return responseJson.story;
  },

  async addNewStory({ description, photo, lat, lon }) {
    const token = AuthModel.getToken();
    if (!token) {
      throw new Error("Anda belum login. Silakan login terlebih dahulu.");
    }

    const formData = new FormData();
    formData.append("description", description);
    formData.append("photo", photo);

    if (lat && lon) {
      formData.append("lat", lat);
      formData.append("lon", lon);
    }

    const response = await fetch(`${CONFIG.BASE_URL}/stories`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const responseJson = await response.json();

    if (response.status >= 400) {
      throw new Error(responseJson.message || "Gagal mengunggah story baru");
    }

    return responseJson;
  },
};

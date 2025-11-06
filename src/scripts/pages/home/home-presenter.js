// src/pages/home/home-presenter.js

import { StoryModel } from "../../model/storyModel";
import { showLoading, hideLoading } from "../../utils/loading-helper";
import { showError } from "../../utils/alert-helper";

class HomePresenter {
  #view = null;

  constructor({ view }) {
    this.#view = view;
    console.log("HomePresenter constructor: View berhasil di-set:", this.#view);
  }

  async init() {
    console.log("HomePresenter init: Memulai... Cek #view:", this.#view);
    try {
      showLoading();

      const stories = await StoryModel.getAllStories();

      console.log("HomePresenter init: Data didapat...");

      this.#view._showStories(stories);
      this.#view._initMap(stories);
    } catch (error) {
      console.error("HomePresenter init: Terjadi error!", error);
      showError(error.message);
    } finally {
      hideLoading();
    }
  }
}

export default HomePresenter;

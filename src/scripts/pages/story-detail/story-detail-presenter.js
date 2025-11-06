import { StoryModel } from "../../model/storyModel";
import { parseActivePathname } from "../../routes/url-parser";
import { showLoading, hideLoading } from "../../utils/loading-helper";
import { showError } from "../../utils/alert-helper";

class StoryDetailPresenter {
  #view = null;

  constructor({ view }) {
    this.#view = view;
  }

  async init() {
    try {
      showLoading();

      const { id } = parseActivePathname();

      if (!id) {
        throw new Error("Story ID tidak ditemukan di URL.");
      }

      const story = await StoryModel.getStoryById(id);

      this.#view._showStoryDetail(story);
      this.#view._initMap(story);
    } catch (error) {
      showError(error.message);
    } finally {
      hideLoading();
    }
  }
}

export default StoryDetailPresenter;

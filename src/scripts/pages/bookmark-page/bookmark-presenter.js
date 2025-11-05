import { showLoading, hideLoading } from "../../utils/loading-helper";
import { showSuccess, showError, showConfirm } from "../../utils/alert-helper";

class BookmarkPresenter {
  #view = null;
  #model = null;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async init() {
    showLoading();
    try {
      const stories = await this.#model.getAllStories();

      if (stories.length > 0) {
        this.#view._showStories(stories);
      } else {
        this.#view._showEmpty();
      }
    } catch (error) {
      showError(error.message);
    } finally {
      hideLoading();
    }
  }

  async deleteStory(id) {
    if (!id) return;

    const isConfirmed = await showConfirm({
      title: "Hapus Bookmark?",
      text: "Anda yakin ingin menghapus story ini dari bookmark?",
      confirmButtonText: "Ya, Hapus!",
      confirmButtonColor: "#e11d48",
    });
    if (isConfirmed) {
      try {
        await this.#model.deleteStory(id);
        showSuccess("Bookmark dihapus");
        this.init();
      } catch (error) {
        showError(error.message);
      }
    }
  }
}

export default BookmarkPresenter;

import { StoryModel } from "../../model/storyModel";
import { showLoading, hideLoading } from "../../utils/loading-helper";
import { showError, showSuccess } from "../../utils/alert-helper";

class AddStoryPresenter {
  #view = null;

  constructor({ view }) {
    this.#view = view;
  }

  async init() {
    this.#view._initMap();
    this.#view._initUploadTypeToggle()
    this.#view._initCameraCapture()

    const form = this.#view._getForm();
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.#handleSubmit();
    });
  }

  async #handleSubmit() {
    try {
      showLoading();

      const formData = this.#view._getFormData();

      if (!formData.description || !formData.photo) {
        throw new Error("Deskripsi dan Gambar wajib diisi.");
      }
      if (formData.photo.size > 1000000) {
        throw new Error("Ukuran gambar tidak boleh lebih dari 1MB.");
      }

      await StoryModel.addNewStory(formData);

      showSuccess("Story berhasil diunggah!");
      this.#view._navigateToHome();
    } catch (error) {
      showError(error.message);
    } finally {
      hideLoading();
    }
  }
}

export default AddStoryPresenter;

// import { StoryModel } from "../../model/storyModel";
// import { parseActivePathname } from "../../routes/url-parser";
// import { showLoading, hideLoading } from "../../utils/loading-helper";
// import { showError } from "../../utils/alert-helper";

// class StoryDetailPresenter {
//   #view = null;

//   constructor({ view }) {
//     this.#view = view;
//   }

//   async init() {
//     try {
//       showLoading();

//       const { id } = parseActivePathname();

//       if (!id) {
//         throw new Error("Story ID tidak ditemukan di URL.");
//       }

//       const story = await StoryModel.getStoryById(id);

//       this.#view._showStoryDetail(story);
//       this.#view._initMap(story);
//     } catch (error) {
//       showError(error.message);
//     } finally {
//       hideLoading();
//     }
//   }
// }

// export default StoryDetailPresenter;

import { StoryModel } from "../../model/storyModel";
import { parseActivePathname } from "../../routes/url-parser";
import { showLoading, hideLoading } from "../../utils/loading-helper";
import { showError, showSuccess } from "../../utils/alert-helper";
import StoryDb from "../../utils/db-helper"; // Impor DB Helper

class StoryDetailPresenter {
  #view = null;
  #story = null; // Properti untuk menyimpan data story
  #isBookmarked = false; // Properti untuk menyimpan status bookmark

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

      // 1. Ambil data story dari API
      this.#story = await StoryModel.getStoryById(id);

      // 2. Cek status bookmark dari IndexedDB
      const storyFromDb = await StoryDb.getStory(id);
      this.#isBookmarked = !!storyFromDb; // !! (dua tanda seru) mengubah objek/null menjadi boolean

      // 3. Render konten halaman (dari kode lama Anda)
      this.#view._showStoryDetail(this.#story);
      this.#view._initMap(this.#story);

      // 4. Render tombol bookmark dan pasang listener (logika baru)
      this.#setupBookmarkButton();
    } catch (error) {
      showError(error.message);
    } finally {
      hideLoading();
    }
  }

  // Method baru untuk setup tombol
  #setupBookmarkButton() {
    const button = this.#view._showBookmarkButton(this.#isBookmarked);
    button.addEventListener("click", () => {
      this.#handleBookmarkClick();
    });
  }

  // Method baru untuk handle klik tombol
  async #handleBookmarkClick() {
    try {
      if (this.#isBookmarked) {
        // --- Logika Unbookmark ---
        await StoryDb.deleteStory(this.#story.id);
        showSuccess("Story removed from bookmarks");
      } else {
        // --- Logika Bookmark ---
        await StoryDb.putStory(this.#story);
        showSuccess("Story saved to bookmarks");
      }

      // Balik status dan render ulang tombol
      this.#isBookmarked = !this.#isBookmarked;
      this.#setupBookmarkButton(); // Panggil lagi untuk refresh tombol
    } catch (error) {
      showError(error.message);
    }
  }
}

export default StoryDetailPresenter;

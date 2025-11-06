import HomePresenter from "./home-presenter";
import { initStoryListMap } from "../../utils/map-helper";

export default class HomePage {
  #presenter = null;

  constructor() {
    console.log("HomePage constructor: Memulai...");
    this.#presenter = new HomePresenter({ view: this });
    console.log(
      "HomePage constructor: Presenter berhasil dibuat",
      this.#presenter
    );
  }

  async render() {
    return `
      <section class="container home">
        <h1 class="page-title">Stories Location</h1>
        <div 
          id="stories-map" 
          style="height: 400px; width: 100%; border-radius: 10px; margin-bottom: 2rem; z-index: 0;">
        </div>

        <h2 class="page-title">Latest Stories</h2>
        <div id="stories-grid" class="stories-grid">
          </div>
      </section>
    `;
  }

  async afterRender() {
    await this.#presenter.init();
  }

  _initMap(stories) {
    initStoryListMap("stories-map", stories);
  }

  _showStories(stories) {
    console.log("HomePage _showStories: Menerima stories:", stories);
    const storiesGrid = document.getElementById("stories-grid");
    storiesGrid.innerHTML = "";

    if (stories.length === 0) {
      storiesGrid.innerHTML = "<p>Belum ada story untuk ditampilkan.</p>";
      return;
    }

    stories.forEach((story) => {
      storiesGrid.innerHTML += `
        <article class="story-card">
          <img src="${story.photoUrl}" alt="${
        story.description
      }" class="story-image" style="view-transition-name: story-thumbnail-${
        story.id
      };" style="view-transition-name: story-thumbnail-${story.id};" />
          <div class="story-info">
            <h2 class="story-title">${story.description.substring(
              0,
              100
            )}...</h2> 
            <p class="story-author">by ${story.name}</p>
            <p class="story-author">Created At : ${story.createdAt}</p>
            <a href="#/detail/${story.id}" class="btn-detail">Read More →</a>
          </div>
        </article>
      `;
    });
  }
}

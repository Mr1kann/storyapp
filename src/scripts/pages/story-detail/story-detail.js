import StoryDetailPresenter from "./story-detail-presenter";
import { initDetailMap } from "../../utils/map-helper";

export default class StoryDetail {
  #presenter = null;

  constructor() {
    this.#presenter = new StoryDetailPresenter({ view: this });
  }

  async render() {
    return `
      <section class="container story-detail">
        <div id="story-content">
          <h1 class="detail-title">Loading story...</h1>
        </div>

        <h2 class="page-title" style="margin-top: 2rem;">Location</h2>
        <div 
          id="detail-map" 
          style="height: 300px; width: 100%; border-radius: 10px; margin-top: 1rem; z-index: 0;">
        </div>
      </section>
    `;
  }

  async afterRender() {
    await this.#presenter.init();
  }

  _showStoryDetail(story) {
    const contentElement = document.getElementById("story-content");
    contentElement.innerHTML = `
      <img src="${story.photoUrl}" alt="${story.description}" class="detail-image" style="view-transition-name: story-thumbnail-${story.id};" />
      <h1 class="detail-title">${story.description}</h1>
      <p class="detail-author">by ${story.name}</p>
    `;
  }

  _initMap(story) {
    initDetailMap("detail-map", story);
  }
}

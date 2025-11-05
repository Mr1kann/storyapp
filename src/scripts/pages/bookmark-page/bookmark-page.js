import BookmarkPresenter from "./bookmark-presenter";
import StoryDb from "../../utils/db-helper";

export default class BookmarkPage {
  #presenter = null;

  constructor() {
    this.#presenter = new BookmarkPresenter({ view: this, model: StoryDb });
  }

  async render() {
    return `
      <section class="container home">
        <h1 class="page-title">My Bookmarks</h1>
        <div id="stories-grid" class="stories-grid">
          </div>
      </section>
    `;
  }

  async afterRender() {
    await this.#presenter.init();
  }

  _showStories(stories) {
    const storiesGrid = document.getElementById("stories-grid");
    storiesGrid.innerHTML = "";

    stories.forEach((story) => {
      storiesGrid.innerHTML += `
        <article class="story-card">
          <img src="${story.photoUrl}" alt="Story by ${story.name}" class="story-image" />
          <div class="story-info">
            <h2 class="story-title">${story.name}</h2> 
            <p class="story-author">by ${story.name}</p>
            <a href="#/detail/${story.id}" class="btn-detail">Read More →</a>
            
            <button class="btn-danger btn-delete-bookmark" data-id="${story.id}">Delete</button>
          </div>
        </article>
      `;
    });

    this._initDeleteListeners();
  }

  _showEmpty() {
    document.getElementById("stories-grid").innerHTML =
      "<p>Belum ada story yang Anda bookmark.</p>";
  }

  _initDeleteListeners() {
    const deleteButtons = document.querySelectorAll(".btn-delete-bookmark");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const id = event.target.dataset.id;
        this.#presenter.deleteStory(id);
      });
    });
  }
}

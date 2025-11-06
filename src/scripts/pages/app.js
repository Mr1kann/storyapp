import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";
import { renderWithTransition } from "../utils/view-transition";
import { AuthModel } from "../model/authModel";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });

    const logoutBtn = document.getElementById("logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (event) => {
        event.preventDefault();

        AuthModel.logout();

        window.location.hash = "/login";
        window.location.reload();
      });
    }
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];
    const protectedRoutes = ["/", "/addStory", "/detail"];
    const authRoutes = ["/login", "/register"];
    const isProtected = protectedRoutes.includes(url);
    const isAuthPage = authRoutes.includes(url);

    if (isAuthPage) {
      this.#navigationDrawer.classList.add('nav-hidden');
      this.#drawerButton.classList.add('nav-hidden');
    } else {
      this.#navigationDrawer.classList.remove('nav-hidden');
      this.#drawerButton.classList.remove('nav-hidden');
    }

    if (isProtected && !AuthModel.isLoggedIn()) {
      window.location.hash = "/login";
    }

    if (isAuthPage && AuthModel.isLoggedIn()) {
      window.location.hash = "/";
      return;
    }

    await renderWithTransition(this.#content, async () => {
      if (L.DomUtil.get("map") !== null) {
        L.DomUtil.get("map")._leaflet_id = null;
      }

      this.#content.innerHTML = await page.render();
      await page.afterRender();
    });
  }
}

export default App;

import HomePage from "../pages/home/home-page";
import StoryDetail from "../pages/story-detail/story-detail";
import LoginPage from "../pages/auth/login/login-page";
import registerPage from "../pages/auth/register/register-page";
import addStories from "../pages/add-stories/add-stories";
import BookmarkPage from "../pages/bookmark-page/bookmark-page";

const routes = {
  "/": new HomePage(),
  "/detail/:id": new StoryDetail(),
  "/addStory": new addStories(),
  "/login": new LoginPage(),
  "/register": new registerPage(),
  "/bookmarks": new BookmarkPage(),
};

export default routes;

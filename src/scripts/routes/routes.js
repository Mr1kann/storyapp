import HomePage from "../pages/home/home-page";
import StoryDetail from "../pages/story-detail/story-detail";
import LoginPage from "../pages/auth/login/login-page";
import registerPage from "../pages/auth/register/register-page";
import addStories from "../pages/add-stories/add-stories";

const routes = {
  "/": new HomePage(),
  "/detail/:id": new StoryDetail(),
  "/addStory": new addStories(),
  "/login": new LoginPage(),
  "/register": new registerPage(),
};

export default routes;

import LoginPresenter from "./login-presenter";

export default class LoginPage {
  async render() {
    return `
      <section class="auth-page">
        <div class="auth-card">
          <h1 class="auth-title">Login</h1>
          <form id="loginForm" class="auth-form">
            <label for="email">Email</label>
            <input type="email" id="email" placeholder="Your Email Here" required />
            <label for="password">Password</label>
            <input type="password" id="password" placeholder="Your Password Here" required />
            <button type="submit" class="btn-primary">Sign In</button>
          </form>
          <p class="auth-switch">
            Don’t have an account?
            <a href="#/register">Register</a>
          </p>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const presenter = new LoginPresenter(this);
    const form = document.getElementById("loginForm");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      presenter.handleLogin(email, password);
    });
  }
}

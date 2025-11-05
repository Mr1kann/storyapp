import RegisterPresenter from "./register-presenter";

export default class registerPage {
  async render() {
    return `
      <section class="auth-page">
        <div class="auth-card">
          <h1 class="auth-title">Register</h1>
          <form id="registerForm" class="auth-form">
            <label for="name">Full Name</label>
            <input type="text" id="name" placeholder="Your Full Name Here" required />
            <label for="email">Email</label>
            <input type="email" id="email" placeholder="Your Email Here" required />
            <label for="password">Password</label>
            <input type="password" id="password" placeholder="Your Password Here" required />
            <button type="submit" class="btn-primary">Register</button>
          </form>
          <p class="auth-switch">
            Already have an account?
            <a href="#/login">login</a>
          </p>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const presenter = new RegisterPresenter(this);
    const form = document.getElementById("registerForm");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      presenter.handleRegister(name, email, password);
    });
  }


}

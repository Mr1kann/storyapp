import CONFIG from "../config";

export const AuthModel = {
  async login(email, password) {
    const response = await fetch(`${CONFIG.BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login Failed");
    }

    const data = await response.json();
    localStorage.setItem("token", data.loginResult.token);
    return data;
  },

  async register(name, email, password) {
    const response = await fetch(`${CONFIG.BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration Failed");
    }

    return await response.json();
  },

  logout() {
    localStorage.removeItem("token");
  },

  getToken() {
    return localStorage.getItem("token");
  },

  isLoggedIn() {
    return !!localStorage.getItem("token")
  }
};

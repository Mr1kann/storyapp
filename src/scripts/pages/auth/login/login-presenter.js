import { AuthModel } from "../../../model/authModel.js";
import { showError, showSuccess } from "../../../utils/alert-helper.js";
import { showLoading, hideLoading } from "../../../utils/loading-helper.js";

export default class LoginPresenter {
  constructor(view) {
    this.view = view;
  }

  async handleLogin(email, password) {
    try {
      showLoading();

      const result = await AuthModel.login(email, password);

      hideLoading();

      showSuccess("Login berhasil!");

      window.location.hash = "#/";
    } catch (error) {
      hideLoading();

      showError(error.message || "Login gagal, periksa kembali data kamu.");
    }
  }
}

import { AuthModel } from "../../../model/authModel.js";
import { showError, showSuccess } from "../../../utils/alert-helper.js";
import { showLoading, hideLoading } from "../../../utils/loading-helper.js";

export default class RegisterPresenter {
  constructor(view) {
    this.view = view;
  }

  async handleRegister(name, email, password) {
    try {
      showLoading();

      const result = await AuthModel.register(name, email, password);

      hideLoading();

      showSuccess("Registrasi berhasil! Silakan login.");

      console.log("Register result:", result);
    } catch (error) {
      hideLoading();

      showError(error.message || "Gagal registrasi, coba lagi.");
    }
  }
}

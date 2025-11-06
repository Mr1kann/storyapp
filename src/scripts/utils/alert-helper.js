import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export const showError = (message) => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: message,
    background: "#0f172a",
    color: "#f8fafc",
    confirmButtonColor: "#2563eb",
    customClass: {
      popup: "swal2-dark-blur",
    },
  });
};

export const showSuccess = (message) => {
  Swal.fire({
    icon: "success",
    title: "Berhasil!",
    text: message,
    background: "#0f172a",
    color: "#f8fafc",
    confirmButtonColor: "#2563eb",
    customClass: {
      popup: "swal2-dark-blur",
    },
  });
};

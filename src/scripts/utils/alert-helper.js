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

export const showConfirm = async ({
  title,
  text,
  confirmButtonText = "Ya, Lanjutkan",
  confirmButtonColor = "#e11d48",
}) => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: "Batal",

    background: "#0f172a",
    color: "#f8fafc",
    confirmButtonColor,
    cancelButtonColor: "#2563eb",
    customClass: {
      popup: "swal2-dark-blur",
    },
  });

  return result.isConfirmed;
};

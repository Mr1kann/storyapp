export const showLoading = () => {
  if (document.querySelector("#global-loading")) return;

  const overlay = document.createElement("div");
  overlay.id = "global-loading";
  overlay.innerHTML = `
    <div class="loader-wrapper">
      <div class="loader"></div>
      <p>Loading...</p>
    </div>
  `;

  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.background = "rgba(0, 0, 0, 0.6)";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = 9999;
  overlay.style.color = "#fff";

  document.body.appendChild(overlay);
};

export const hideLoading = () => {
  const overlay = document.querySelector("#global-loading");
  if (overlay) overlay.remove();
};

export async function renderWithTransition(targetElement, renderCallback) {
  if (!document.startViewTransition) {
    await renderCallback();
    return;
  }

  if (document.visibilityState === "hidden") {
    await renderCallback();
    return;
  }

  const transition = document.startViewTransition(async () => {
    await renderCallback();
  });

  await transition.finished;
}

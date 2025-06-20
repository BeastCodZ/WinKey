document.getElementById("sync-from").addEventListener("click", () => {
  window.api.updatelocal();
});
document.getElementById("sync-to").addEventListener("click", () => {
  window.api.updategdrive();
});

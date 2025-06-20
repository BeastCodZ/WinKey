document.getElementById("close-btn").addEventListener("click", () => {
  window.api.closeWindow();
});

document.getElementById("glb").addEventListener("click", () => {
  window.api.loginGoogle();
});
document.getElementById("clear-login").addEventListener("click", () => {
  window.api.clearLogin();
});
window.api.onLoginError((msg) => {
  alert(`Login failed: ${msg}`);
});
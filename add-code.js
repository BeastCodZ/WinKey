document.getElementById("add-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const nicknameInput = document.getElementById("nickname");
  const secretInput = document.getElementById("secret");
  const errorDiv = document.getElementById("error-message");

  const nickname = nicknameInput.value.trim();
  const secret = secretInput.value.trim();

  errorDiv.textContent = "";
  nicknameInput.style.borderColor = "";
  secretInput.style.borderColor = "";

  if (!nickname) {
    errorDiv.textContent = "Please enter a nickname.";
    nicknameInput.style.borderColor = "#ff5555";
    return;
  }
  if (!secret) {
    errorDiv.textContent = "Please enter secret code.";
    secretInput.style.borderColor = "#ff5555";
    return;
  }

  const secrets = window.api.loadSecrets();
  const exists = secrets.some((entry) => entry.nickname === nickname);

  if (exists) {
    errorDiv.textContent = "Nickname already in use. Please choose another.";
    nicknameInput.style.borderColor = "#ff5555";
    return;
  }

  secrets.push({ nickname, secret });
  window.api.saveSecrets(secrets);
  window.location.href = "index.html";
});

document.getElementById("close-btn").addEventListener("click", () => {
  window.api.closeWindow();
});
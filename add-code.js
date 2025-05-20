document.getElementById("add-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const nickname = document.getElementById("nickname").value.trim();
  const secret = document.getElementById("secret").value.trim();
  const errorMessageDiv = document.getElementById("error-message");

  errorMessageDiv.textContent = "";

  if (nickname && secret) {
    const secrets = window.api.loadSecrets();
    const exists = secrets.some(
      (secretEntry) => secretEntry.nickname === nickname
    );

    if (exists) {
      errorMessageDiv.textContent = "Nickname already in use. Please choose another.";
      document.getElementById("nickname").style.borderColor = "red";
    } else {
      secrets.push({ nickname, secret });
      window.api.saveSecrets(secrets);
      window.location.href = "index.html";
    }
  } else if (!nickname) {
    errorMessageDiv.textContent = "Please enter a nickname.";
  } else if (!secret) {
    errorMessageDiv.textContent = "Please enter secret code.";
  }
});

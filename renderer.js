function loadSecrets() {
  return window.api.loadSecrets();
}

function saveSecrets(secrets) {
  window.api.saveSecrets(secrets);
}

function handleDeleteButtonClick(nickname) {
  const secrets = loadSecrets();
  const updatedSecrets = secrets.filter(
    (secret) => secret.nickname !== nickname
  );
  saveSecrets(updatedSecrets);
  updateCodeList();
}

function updateCodeList() {
  const secrets = loadSecrets();
  const codeList = document.getElementById("code-list");

  codeList.innerHTML = "";

  secrets.forEach(({ nickname, secret }) => {
    const listItem = document.createElement("li");
    listItem.className = "list-group-item custom-list-group-item";

    const token = window.api.generateTOTP(secret);

    const nicknameSpan = document.createElement("span");
    nicknameSpan.textContent = nickname;

    const tokenSpan = document.createElement("span");
    tokenSpan.className = "tokenclass";
    tokenSpan.textContent = token;

    const delSpan = document.createElement("i");
    delSpan.className = "fa-solid fa-trash dbutton colorwhite";
    delSpan.id = nickname;
    delSpan.addEventListener("click", () => handleDeleteButtonClick(nickname));

    tokenSpan.addEventListener("click", () => {
      navigator.clipboard.writeText(token)
        .then(() => {
          const tooltip = document.createElement("div");
          tooltip.textContent = "Copied to clipboard!";
          tooltip.style.position = "absolute";
          tooltip.style.backgroundColor = "#333";
          tooltip.style.color = "#fff";
          tooltip.style.padding = "5px";
          tooltip.style.borderRadius = "4px";
          tooltip.style.fontSize = "12px";
          tooltip.style.top = `${tokenSpan.getBoundingClientRect().top - 30}px`;
          tooltip.style.left = `${tokenSpan.getBoundingClientRect().left}px`;
          tooltip.style.zIndex = "1000";

          document.body.appendChild(tooltip);

          setTimeout(() => {
            document.body.removeChild(tooltip);
          }, 1000);
        })
        .catch(err => {
          console.error("Failed to copy token to clipboard:", err);
        });
    });

    listItem.appendChild(nicknameSpan);
    listItem.appendChild(tokenSpan);
    tokenSpan.appendChild(delSpan);
    codeList.appendChild(listItem);
  });
}


function updateCountdown() {
  const countdownElement = document.getElementById("countdown-timer");
  const period = 30;

  function update() {
    const now = Math.floor(Date.now() / 1000);
    const timeElapsed = now % period;
    const remainingTime = period - timeElapsed;
    const seconds = remainingTime % 60;

    if (!isNaN(seconds)) {
      countdownElement.innerText = `${String(seconds).padStart(2, "0")}s`;
    } else {
      countdownElement.innerText = "Error";
    }
  }

  update();
  setInterval(update, 1000);
}

function autoUpdateTOTPs() {
  updateCodeList();
  setInterval(updateCodeList, 1000);
}


updateCodeList();
updateCountdown();
autoUpdateTOTPs();

document.getElementById("close-btn").addEventListener("click", () => {
  window.api.closeWindow();
});

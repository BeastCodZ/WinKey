const icons = window.api.loadIcons ? window.api.loadIcons() : {};

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

    const nicknameContainer = document.createElement("div");
    nicknameContainer.style.display = "flex";
    nicknameContainer.style.alignItems = "center";
    nicknameContainer.style.gap = "10px";
    nicknameContainer.style.position = "relative";

    const hasIcon = icons && icons[nickname.toLowerCase()];

    if (hasIcon) {
      const iconImg = document.createElement("img");
      iconImg.src = icons[nickname.toLowerCase()];
      iconImg.alt = nickname;
      iconImg.style.width = "28px";
      iconImg.style.height = "28px";
      iconImg.style.borderRadius = "6px";
      iconImg.style.transition = "opacity 0.3s ease";
      nicknameContainer.appendChild(iconImg);

      const tooltip = document.createElement("div");
      tooltip.textContent = nickname;
      tooltip.style.position = "absolute";
      tooltip.style.bottom = "120%";
      tooltip.style.left = "50%";
      tooltip.style.transform = "translateX(-50%)";
      tooltip.style.backgroundColor = "#333";
      tooltip.style.color = "#fff";
      tooltip.style.padding = "4px 8px";
      tooltip.style.borderRadius = "4px";
      tooltip.style.fontSize = "12px";
      tooltip.style.whiteSpace = "nowrap";
      tooltip.style.opacity = "0";
      tooltip.style.pointerEvents = "none";
      tooltip.style.transition = "opacity 0.3s ease";
      tooltip.style.zIndex = "1000";

      nicknameContainer.appendChild(tooltip);

      nicknameContainer.addEventListener("mouseenter", () => {
        tooltip.style.opacity = "1";
      });

      nicknameContainer.addEventListener("mouseleave", () => {
        tooltip.style.opacity = "0";
      });
    } else {
      const nicknameText = document.createElement("span");
      nicknameText.textContent = nickname;
      nicknameText.className = "colorwhite";
      nicknameContainer.appendChild(nicknameText);
    }



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

    listItem.appendChild(nicknameContainer);
    listItem.appendChild(tokenSpan);
    listItem.appendChild(delSpan);
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


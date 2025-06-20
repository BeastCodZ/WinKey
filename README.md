# WinKey

<img src="https://github.com/user-attachments/assets/bced1892-14da-4a13-aecf-45e134a196ee" alt="WinKey Logo" width="48"/>

> **Your slick, no-nonsense Electron 2FA Authenticator —**  
> *because security shouldn’t be ugly or complicated.*

---

## What is WinKey?

WinKey is an Electron-based Two-Factor Authentication (2FA) app designed to provide a clean, aesthetic, and easy-to-use experience for generating Time-based One-Time Passwords (TOTP). This lightweight desktop authenticator simplifies the process of securing your online accounts with an elegant interface and reliable token generation.

---

## ✨ What’s New in v2
  - **✅ Google Drive Sync** — backup & restore your secrets with a click.
  - **✅ Improved UI** — more aesthetic, smoother interaction.
  - **✅ Basic backup system** — local and remote backups before overwriting.
  - **⚙️ Clean multi-user codebase (experimental)** — prepping for multiple accounts.

## 🚧 Roadmap / Coming Soon

- 🔐 Encryption for stored secrets — so your secrets.json is useless to thieves.
- 🔑 bcrypt — hashed local passwords to guard your local database.
- 🧩 GitHub login option — log in with your GitHub account.
- 👥 Fully-fledged multi-account login — switch between different cloud accounts seamlessly.

---

## Peek the goods

![Login Screen](https://github.com/user-attachments/assets/3cb387f6-6f02-4699-960a-ce88b66f8560)
![Dashboard](https://github.com/user-attachments/assets/fcd9e253-7e69-44fc-8136-22842d162beb)
![Add Code Screen](https://github.com/user-attachments/assets/7c69616c-daa7-423b-b8ce-62765bc731c3)
![Sync Menu](https://github.com/user-attachments/assets/881e051a-a088-4177-b4a0-eb93c309504c)

## ⚡ Features that matters
- RFC 6238 TOTP generation — trusted, time-based codes.
- Simple Electron Builder setup — clone, build, run.
- Google Drive Integration — secure cloud backup in your own cloud we manual backups.

---

## Heads-up: Known issues

- **No encryption on stored secrets.**  
  Handle your `secrets.json` like it’s gold. If someone gets it, they get your keys.  
  Find your secrets.json here:  
  `C:\Users\[Your Username]\AppData\Roaming\winkey`

- **No auto backups.**  
  Make sure to sync manually for now. Automatic backup in V3.

---

## Tech stack & toolkit

- **Electron** v32 — power your desktop app with web tech  
- **bcrypt** — hashed passwords (To be implemented soon)  
- **otplib** — TOTP engine  
- **qrcode** — instant QR code generation (To be implemented soon)

---

## License

ISC License © BeastCodZ

---

## Disclaimer

*WinKey is a personal project and comes as-is. Don’t trust it blindly with your crown jewels. — I’m not your IT department.*

---

> **Lock down your accounts with taste. Use WinKey.**

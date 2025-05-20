# WinKey

<img src="https://github.com/user-attachments/assets/bced1892-14da-4a13-aecf-45e134a196ee" alt="WinKey Logo" width="48"/>

> **Your slick, no-nonsense Electron 2FA Authenticator —**  
> *because security shouldn’t be ugly or complicated.*

---

## What is WinKey?

WinKey is an Electron-based Two-Factor Authentication (2FA) app designed to provide a clean, aesthetic, and easy-to-use experience for generating Time-based One-Time Passwords (TOTP). This lightweight desktop authenticator simplifies the process of securing your online accounts with an elegant interface and reliable token generation.

---

## Features that matter

- **TOTP generation adhering to RFC 6238** — reliable, standard, secure.  
- **Easy to build & run** using Electron Builder.

---

## Peek the goods

![Screenshot (282)](https://github.com/user-attachments/assets/ac216136-031c-4a3b-be29-533f0995beac)
![Screenshot (283)](https://github.com/user-attachments/assets/d8561e4e-d710-430e-849d-05574fd42959)



---

## Heads-up: Known issues

- **No encryption on stored secrets.**  
  Handle your `secrets.json` like it’s gold. If someone gets it, they get your keys.  
  Find your secrets.json here:  
  `C:\Users\BeastCodZ\AppData\Roaming\winkey`

- **No auto backups.**  
  Manually back up your data or risk losing everything.

- **Platform quirks** may appear — Linux distros and macOS aren’t always friends with Electron.

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

*WinKey is a personal project and comes as-is. Don’t trust it blindly with your crown jewels.*

---

> **Secure your digital life with style — use WinKey.**

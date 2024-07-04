<a name="readme-top"></a>

<div align="center">

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![Apache License 2.0][license-shield]][license-url]

</div>
<br />
<div align="center">
  <a href="https://securepaste.vercel.app/">
    <img src="frontend/public/icon.svg" alt="Logo" width="100" height="100">
  </a>

  <h3 align="center">SecurePaste</h3>

  <p align="center">
    A secure Pastebin alternative with blockchain-powered encryption and decentralized storage.
    <br />
    <code>PROJECT UNDER DEVELOPMENT</code>
    <br/>
    Check <a href="#roadmap">Roadmap</a> to see current progress.
    <br />
    <br />
    <a href="https://securepaste.vercel.app/">View Demo</a>
    &nbsp;
    |
    &nbsp;
    <a href="https://github.com/codehasan/SecurePaste/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &nbsp;
    |
    &nbsp;
    <a href="https://github.com/codehasan/SecurePaste/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ul>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#key-features">Key Features</a></li>
        <li><a href="#common-features-pastebin">Common Features</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#install">Install</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ul>
</details>

## About The Project

[![Product Banner][product-screenshot]](https://github.com/codehasan/SecurePaste)

This project is built as an alternative to Pastebin. The key difference is that SecurePaste allows users to store their content on Blockchain to ensure data integrity and immutability.
Moreover it's tailored for ease of use, allowing users to securely store their data and also have the freedom to select between Web3 (Blockchain) and Web2 (Traditional) storage methods, ensuring both security and convenience are prioritized.

### Key Features:

- **Blockchain-Powered Encryption:** Encrypt your data with asymmetric cryptography to maximize data integrity.
- **Decentralized Storage:** Choose decentralized storage options like `IPFS` for data resilience and privacy.
- **Data Immutability:** Private contents are stored in the Blockchain using Smart Contracts.
- **User-Friendly Interface:** Intuitive design makes it easy to securely store and manage your content.
- **Customizable Sharing:** Share your stored content publicly or restrict content visibility to private only.

### Common Features (Pastebin):

- **Syntax Highlighting:** Enable syntax highlighting for your desired language in your stored content.
- **Custom Tags:** Apply multiple tags to categorize your content.

Whether you’re a developer safeguarding sensitive code or an individual protecting personal notes, our platform offers a reliable solution backed by the latest technologies in blockchain innovation.

### Built With

The website is built using the following libraries and frameworks.

![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwind%20css-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![DaisyUI](https://img.shields.io/badge/daisy%20ui-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white)
![Zod](https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

For database and storage, the following tools are used.

![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Pinata IPFS](https://img.shields.io/badge/Pinata%20IPFS-6d4aff?style=for-the-badge&logo=ipfs&logoColor=white)

Smart Contracts are deployed on the `Ethereum` blockchain and developed using the following tools and languages.

![Solidity](https://img.shields.io/badge/Solidity-%23363636.svg?style=for-the-badge&logo=solidity&logoColor=white)
![Hardhat](https://img.shields.io/badge/Hardhat-191a1f?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAABBVBMVEVHcEz86DT54iP86jn65Cn22gz54SP65S7+70v22w797ED23BH12gz22gz22w3/8Ez12gz12gz44Bv12gz64yj22w322w754yX44B344B722gz12gz/8E3/8Er12gz12gz/8Ez/8E3/8E312gz12wz12gz23BD/8E365Sr/8E3/8E3+7UP/8E322w/54yf/2k312gz/8E312gv/803/8E4VGR8jIyMgISL44Bz/70r35RD+7kb33hb65Sr23BASFh4UFx/azUXn2khAPyh7djP46UsyMiVaVy3w4kqflzpsaTDLwEMpKSSNhjdOSyvFu0Gsoz0YHB+yqT63rT+7sT8QFB5HcEwFxO07AAAAV3RSTlMA/hj8EvkLHv1I/tHiPf7hxLj78gdqlvoDMFvcQJ1+6/Cw0q+jjPxX98a5cIck6////////////////////////////////////////////////////wDJfO72AAAFC0lEQVRo3u2ZaVeqWhjHD8QkDsFxKC2HUiurc9dmUHQBDjmXZnU63/+r3A1aArI3WJ517wv+b9KK5+cz7sEfPyJFihQpUqRI/2tlGIpkWZZkMn/HPpW/viteNC6PoS4bt8X76zx5elACeV1sVDjJEqeqKvyhSmrlsnjHHo7B3nK2Xa9U6fL8YJB7CamLQ2WHaaAhx4cJGJPMVdAQrnjOfL+oCmKakHCq3F5T3/OiINDyTw4LUVWucf0Nb5IiDUDqSJXwUjnu4qtVRtbLAIAgR2xfVLVyT37JDQFYCnZk0zKN/Z3JZMs2I4QjH5jjuz17hqrTYK0bVQpL4e73KjOytkHIV3poCMRc7JEYtgo+ICdeQ8rTk4KhhB4A5CcDXO2kffY8nR3AF6r2yfBJ+/K1NcdGLFReMjmwhdx4bQwmTW04wASMK4apsSy9hew0yfix19S0xzGuxu6CGbEyQEdLedH6Ta21eEO7wnX+iQUmXQAOiKe2lIdhrwkh2vMDJmBEPKDETuvACfFGa9RvWpCWtsTEi+/m8DuMWNoJueJdEGW12EBakxXalU47jQ0YI7oc8aRkNoXBWkNauGY5kQVcHRdogE6JMn9tfkIWc6Qr6hFIZUNmHRawazgqg0l/C8E0i8qnQBzd+IUrN8SVd6tFtpCWNkI2C2fIAOkKJboZtHMCK29a3wlpLX4jA/ZTBsisuEvLk3e7RZwQ2CyoeJkyoFEFlgMAmXfladJze6INUTNfJeDTNf9eYc88EPeiOBi1eo7ET0YDdHmlAEj8ClG/UIS7FbnV9LW36fjF44pTMD0PM1oIEy1Au4tLUpTxy7AJB6TWen4ZK4qELC8dlpd/vKi4B+IeKg8vcCgqD8tJXxsu7ZdvD8jBAsvLv1XyaS/EvYeYP/+2Pv5gBJMBnXqfvqAHiwVJJ33mb8HD8EwuZfyoPcIuVziYDGUwWqCbUVJPIMS3H+t4iLWY/JnMZzDdymw+xC8ppgXJ+SztVQ8E7CyL763e63TFSasprOB3BbOdICyImAnOu3yyu1Np9nut0WgCi3iJ3eRZ3eiXeTYBMA2/qTC4oPTtPsEtJ1BHlgGfdsyXgyFwtvTtNX74pGA9sSHp/O5JwVvBst9We/5q71bmAXviNWS3hpN0GEjwvutzePkN4lgoiDIY9rXngfJXIXDtwq1W+0JkGXH8GS2DD5EBENkSSHW7hnHjb2E8Cz4M2Yn3hVjWu0a7bZrEEa/rnY70VcFmhMZ8IUbbJHi9sz4yq9J3pBNm26C9JcycF3ld+rZxx9Fe0nnPtcv5bUU6kHnn0b5y6zjbU5eHQqjeS7ft9os9dtxgwNVT1/WvUGGI9E1Ofa7DbAj8S0fnCdNstw3DaBP6nhi1Q9gPWtVp1Y9NckEggLcqortuFKua2/xeFJVvb5/tritVUl0Q3lzbd7a8QewTsyPD9bBNMnkHhIobLvubf+yaYUOm6mbXx4Dcda6OSTEN/GQQuhTUOlZLEIbv42kx6b7NLIkJevezAMPOIkZWrRhg1w06IZaSO7eGzK9YqSaclWmPy/Y8Q8qwc+k2Xz4TaqXYL+S9JEPmY9lSrirEE+U0nQLbyYzUx4kpXU7EhWqulI3lyVD3nqcMxeaTsUI2W6rnalVRFIR4PH4GlbBlvYK/EARRrNZy9VI2W4gl8yzFfP0rgtNMhmEoiiStrzU2gm8oimEyGdvsYb9+iBQpUqRIkf47/QvJTiEhwe4MEwAAAABJRU5ErkJggg==)

## Install

To run this project locally follow the below steps.

### Prerequisites

- Make sure you have `hardhat` installed globally.

  ```sh
  npm install hardhat@latest -g
  ```

- Install MetaMask wallet extension for your browser.

  <a href="https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn">Chrome Web Store</a>
  &nbsp;|&nbsp;
  <a href="https://addons.mozilla.org/en-US/firefox/addon/ether-metamask">Firefox Addons</a>

### Installation

- Clone the repo

  ```sh
  git clone https://github.com/codehasan/SecurePaste.git
  ```

- Install NPM packages for EVM

  ```sh
  npm install
  ```

- Install NPM packages for frontend

  ```sh
  cd frontend
  npm install
  ```

- Enter your MongoDB database URL in `frontend/.env.local`

  ```js
  MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
  ```

- Start hardhat node

  ```sh
  npx hardhat node
  ```

- Run the project in development mode

  ```sh
  cd frontend
  npm run dev
  ```

## Roadmap

- [ ] Build user authentication system.
  - [x] Sign up
  - [ ] Sign in
  - [ ] Email verification
  - [ ] Recover account
  - [ ] Delete account
- [ ] Build user content management system.
  - [ ] Create a new paste
  - [ ] View a paste's content
    - [ ] Build nested comment system
    - [ ] Add metrics feature - like or dislike a paste or comment
  - [ ] Update a paste's content
  - [ ] Delete a paste
  - [ ] Print a paste
  - [ ] Download a paste as .txt file
- [ ] Build account usage management system.
  - [ ] 'My account' page with all owned pastes shown in pagination.
  - [ ] 'My comments' page with all comments made in all posts.
- [ ] Build content querying mechanism.
  - [ ] Query the database for the given keyword and show results in a pagination.

See the [open issues](https://github.com/codehasan/SecurePaste/issues) for a full list of proposed features (and known issues).

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the Apache License (2.0) . See `LICENSE` for terms and conditions.

```
Copyright (c) 2024 Ratul Hasan

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

## Contact

You can contact me using either of these social media platforms or send me an email.

- [![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/codehasan)
- [![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/codehasan)
- [![Twitter](https://img.shields.io/badge/Twitter-black?style=for-the-badge&logo=x&logoColor=white)](https://twitter.com/code_hasan)
- [![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:ratul.hasan.rahat.bd@gmail.com)

---

<p align="right"><a href="#readme-top">Back to top</a></p>

[contributors-shield]: https://img.shields.io/github/contributors/codehasan/SecurePaste.svg?style=for-the-badge
[contributors-url]: https://github.com/codehasan/SecurePaste/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/codehasan/SecurePaste.svg?style=for-the-badge
[forks-url]: https://github.com/codehasan/SecurePaste/network/members
[stars-shield]: https://img.shields.io/github/stars/codehasan/SecurePaste.svg?style=for-the-badge
[stars-url]: https://github.com/codehasan/SecurePaste/stargazers
[issues-shield]: https://img.shields.io/github/issues/codehasan/SecurePaste.svg?style=for-the-badge
[issues-url]: https://github.com/codehasan/SecurePaste/issues
[license-shield]: https://img.shields.io/github/license/codehasan/SecurePaste.svg?style=for-the-badge
[license-url]: https://github.com/codehasan/SecurePaste/blob/master/LICENSE.txt
[product-screenshot]: frontend/public/banner.png

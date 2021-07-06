<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="https://uploads-ssl.webflow.com/60df3f87e49b4c557421044a/60e0c8679137b95f17a6752b_Frame%208.png" alt="Logo" width="160" height="120">
  </a>

  <h3 align="center">Chippin Club</h3>

  <p align="center">
    making group payments easier
    <br />
    <a href="https://github.com/chippinmoney/backend/blob/main/api_reference/api.pdf"><strong>API Docs »</strong></a>
    <br />
    <a href="https://github.com/chippinmoney/docs/blob/main/README.md"><strong>API Reference »</strong></a>
    <br />
    <br />
    <a href="https://www.chippin.club/">Website</a>
    ·
    <a href="https://github.com/chippinmoney/backend/issues">Report Issues</a>
  </p>
</p>

<!-- ABOUT THE PROJECT -->
## About The Project

<p align="center">
  <img src="https://uploads-ssl.webflow.com/60df3f87e49b4c557421044a/60df563b02ff82eeb2bb815f_Frame%207-p-800.png"></img>
</p>

This repository contains a <b>Rapid API Node SDK</b> built for this project specifically. The server API has been divded into the following sub-modules:
* auth
* card
* group
* wallet

This API is the backbone of Chippin Project.

### Built With

This section should list any major frameworks that you built your project using. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.
* [Flutter](https://flutter.dev/)
* [Express](https://expressjs.com/)
* [Rapyd](https://www.rapyd.net/)
* [MongoDB](https://www.mongodb.com/)

<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

+ [Git](https://git-scm.com/)
+ [nodejs and npm](https://nodejs.org/en/)
+ [MongoDB](https://www.mongodb.com/)

This is an example of how to list things you need to use the software and how to install them.
* npm `npm install npm@latest -g`

### Installation

1. Get a Rapyd API Keys from [Rapyd API](https://docs.rapyd.net/build-with-rapyd/docs/getting-started)
2. Clone the repo `git clone https://github.com/chippinmoney/backend.git`
3. Install NPM packages
   `npm install`
4. Enter your API keys in `.env` file
5. Get a domain and initialise your email and webhosting details in the `.env` and `/src/config/email.js` files.
6. Initialise a gcloud storage service and update `.env`, `src/config/filestorage.js` and `src/config/filestoragekey.json` files.


<!-- USAGE EXAMPLES -->
## Usage

**Start Server**
1. Execute `npm start` to start a server at `http://localhost:3000`
Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://github.com/chippinmoney/backend/blob/main/docs/api.pdf)_

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

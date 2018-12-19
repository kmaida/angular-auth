# Angular Authentication with Auth0

## Prerequisites

* [Node.js with npm](http://nodejs.org), Node >= 6.9.0, npm >= 3
* [@angular/cli](https://github.com/angular/angular-cli), >= 7
* [node-api-dinos-secure](https://github.com/kmaida/node-api-dinos-secure), cloned and running locally (follow README instructions in `node-api-dinos-secure` repo)

### Sign Up for Auth0

1. To create your _free_ Auth0 account, visit [auth0.com](https://auth0.com) and click Sign Up.
2. Use Google, GitHub, or Microsoft Account to log in.

### Auth0 Setup

1. Go to your [**Auth0 Dashboard: Applications**](https://manage.auth0.com/#/applications) section and click the "[+ Create Application](https://manage.auth0.com/#/applications/create)" button.
2. Name your new app and select "Single Page Web Applications".
3. In the **Settings** for your new Auth0 app, add `http://localhost:4200/callback` (dev) and `http://localhost:3000/callback` (stage) to the **Allowed Callback URLs**.
4. _If / when you have a production URL, add it (with the `/callback` segment) to **Allowed Callback URLs** as well._
5. Add `http://localhost:4200` (dev) and `http://localhost:3000` (stage) to both the **Allowed Web Origins** and **Allowed Logout URLs**. Click the "Save Changes" button.
6. _If / when you have a production URL, add that to the **Allowed Web Origins** and **Allowed Logout URLs** as well._
7. You can also [set up some social connections](https://manage.auth0.com/#/connections/social).* You can then enable them for your app in the **Application** options under the **Connections** tab.
8. Go to the [**APIs**](https://manage.auth0.com/#/apis) section and click the "+ Create API" button.
9. Give your API a name like `Secure Dino API` and enter an identifier. The identifier will be the _audience_ claim for access tokens to call this API. The identifier must be `https://secure-dino-api`. Save your settings.

*_If using social connections, set up your own social keys! Do not leave social connections set to use Auth0 dev keys or you will encounter issues with token renewal._

## Installation

_**Prerequisite:** [node-api-dinos-secure](https://github.com/kmaida/node-api-dinos-secure) should already be cloned, installed, and running locally. By default, this runs on localhost port 3005._

Clone this repository locally:

```bash
$ git clone https://github.com/auth0-blog/angular-authentication.git
```

From the root directory, run the following command to install dependencies:

```bash
$ npm install
```

## Configuration

1. Open `/src/environments/environment.ts.sample` and remove `.sample` from the file name. Replace `{YOUR_AUTH0_CLIENT_ID}` and `{YOUR_AUTH0_DOMAIN}` with your Auth0 application's client ID and domain.
2. Open `/src/environments/environment.stage.ts.sample` and remove `.sample` from the file name. Then replace `{YOUR_AUTH0_CLIENT_ID}` and `{YOUR_AUTH0_DOMAIN}` with your Auth0 application's client ID and domain.
3. _If / when you know your production URL, open `/src/environments/environment.prod.ts.sample` and remove `.sample` from the file name. Then replace `{YOUR_AUTH0_CLIENT_ID}`, `{YOUR_AUTH0_DOMAIN}` with your Auth0 application's client ID and domain. Replace `{YOUR_PRODUCTION_URL}` with your app's deployed production URL (e.g., `https://my-angular-app.com`)._

## Serving the Project

### Development

From the root of this project, run:

```bash
$ npm start
```

This uses the [Angular CLI](https://cli.angular.io) to serve the application. Your app will be available in the browser at `http://localhost:4200`.

_Make sure you've also started the Node API, which can be found at [https://github.com/kmaida/node-api-dinos-secure](https://github.com/kmaida/node-api-dinos-secure)._

### Staging / Production

To build _and_ serve a production-ready version of the application, from the root of this project, run:

```bash
# Staging environment
$ npm run stage
# Production environment
$ npm run prod
```

These commands will perform a build of your Angular application and serve the minified `dist` build and API, available in the browser at `http://localhost:3000`. Changes will _not_ be watched.

If you have _already built_ the Angular app and just want to serve it, you can run:

```bash
$ node server
```

## Authentication Stream

This project supplies a stream of authentication events (called `authStatus$` and available in the `auth.service.ts` file) that you can subscribe to in order to follow the authentication flow in your browser's console when developing the application.

You can also see the current status of the authentication flow via the `authStatus` property supplied by `auth.service.ts`.

To take advantage of the authentication stream, you can subscribe to it in a component such as the `AuthHeader` and log each event to the console.

## What is Auth0?

Auth0 helps you to:

* Add authentication with [multiple authentication sources](https://docs.auth0.com/identityproviders), either social like **Google, Facebook, Microsoft Account, LinkedIn, GitHub, Twitter, Box, Salesforce, amont others**, or enterprise identity systems like **Windows Azure AD, Google Apps, Active Directory, ADFS or any SAML Identity Provider**.
* Add authentication through more traditional **[username/password databases](https://docs.auth0.com/mysql-connection-tutorial)**.
* Add support for **[linking different user accounts](https://docs.auth0.com/link-accounts)** with the same user.
* Support for generating signed [Json Web Tokens](https://docs.auth0.com/jwt) to call your APIs and **flow the user identity** securely.
* Analytics of how, when and where users are logging in.
* Pull data from other sources and add it to the user profile, through [JavaScript rules](https://docs.auth0.com/rules).

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Author

[Kim Maida](https://kmaida.io)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.

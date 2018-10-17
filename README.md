# Angular Authentication with Auth0

## Dependencies

* [Node.js with npm](http://nodejs.org), Node >= 6.9.0, npm >= 3
* [@angular/cli](https://github.com/angular/angular-cli), >= 6

### Sign Up for Auth0

1. To create your _free_ Auth0 account, visit [auth0.com](https://auth0.com) and click Sign Up.
2. Use Google, GitHub, or Microsoft Account to log in.

### Auth0 Application Setup

1. Go to your [**Auth0 Dashboard: Applications**](https://manage.auth0.com/#/applications) section and click the "[+ Create Application](https://manage.auth0.com/#/applications/create)" button.
2. Name your new app and select "Single Page Web Applications".
3. In the **Settings** for your new Auth0 app, add `http://localhost:3000/callback` to the **Allowed Callback URLs**.
4. Add `http://localhost:3000` to both the **Allowed Web Origins** and **Allowed Logout URLs**. Click the "Save Changes" button.
5. If you'd like, you can [set up some social connections](https://manage.auth0.com/#/connections/social). You can then enable them for your app in the **Application** options under the **Connections** tab. The example shown in the screenshot above uses username/password database, Facebook, Google, and Twitter.

> **Note:** If using social connections, set up your own social keys! _Do not_ leave social connections set to use Auth0 dev keys or you will encounter issues with token renewal.

### Auth0 API Setup

Go to [**APIs**](https://manage.auth0.com/#/apis) in your Auth0 dashboard and click on the "Create API" button. Enter a name for the API. Set the **Identifier** to your API endpoint URL. In this example, this is `http://localhost:3000/api/`. The **Signing Algorithm** should be `RS256`.

We're now ready to implement Auth0 authentication on both our Angular client and Node backend, which provides our API and also serves our Angular application.

## Installation

Clone this repository locally:

```bash
$ git clone https://github.com/auth0-blog/angular-authentication.git
```

From the root directory, run the following command to install dependencies:

```bash
$ npm install
```

## Configuration

1. Open `/api/config.js.example` and remove `.example` from the file name. Then replace `[YOUR_AUTH0_DOMAIN]` with your Auth0 domain (which can be found in your [Auth0 Dashboard](https://manage.auth0.com) application settings).
2. Open `/src/app/environments/environment.example` and remove `.example` from the file name. Then replace `[YOUR_CLIENT_ID]` and `[YOUR_AUTH0_DOMAIN]` with your Auth0 application's client ID and domain.

## Serving the Project

### Development

From the root of this project, run:

```bash
$ npm run dev
```

This will concurrently serve the Angular app using a proxy to the API server. Your app will be available at `http://localhost:4200` and the API will be available at `http://localhost:4200/api`. Changes will be watched by the Angular CLI.

### Staging / Production

To build _and_ serve a production-ready version of the application, from the root of this project, run:

```bash
$ npm run stage
```

This will perform a production build of your Angular application and serve the minified build and API at `http://localhost:3000`. Changes will _not_ be watched.

If you have _already_ built the project and just want to serve it, you can run:

```bash
$ node server
```

## What is Auth0?

Auth0 helps you to:

* Add authentication with [multiple authentication sources](https://docs.auth0.com/identityproviders), either social like **Google, Facebook, Microsoft Account, LinkedIn, GitHub, Twitter, Box, Salesforce, amont others**, or enterprise identity systems like **Windows Azure AD, Google Apps, Active Directory, ADFS or any SAML Identity Provider**.
* Add authentication through more traditional **[username/password databases](https://docs.auth0.com/mysql-connection-tutorial)**.
* Add support for **[linking different user accounts](https://docs.auth0.com/link-accounts)** with the same user.
* Support for generating signed [Json Web Tokens](https://docs.auth0.com/jwt) to call your APIs and **flow the user identity** securely.
* Analytics of how, when and where users are logging in.
* Pull data from other sources and add it to the user profile, through [JavaScript rules](https://docs.auth0.com/rules).

## Create a Free Auth0 Account

1. Go to [Auth0](https://auth0.com) and click Sign Up.
2. Use Google, GitHub, or Microsoft Account to log in.

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Author

[Auth0](auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.

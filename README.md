# Angular Authentication with Auth0

## Dependencies

* [Node.js with npm](http://nodejs.org), Node >= 6.9.0, npm >= 3
* [@angular/cli](https://github.com/angular/angular-cli), >= 6

### Sign Up for Auth0

1. To create your _free_ Auth0 account, visit [auth0.com](https://auth0.com) and click Sign Up.
2. Use Google, GitHub, or Microsoft Account to log in.

### Auth0 Setup

1. Go to your [**Auth0 Dashboard: Applications**](https://manage.auth0.com/#/applications) section and click the "[+ Create Application](https://manage.auth0.com/#/applications/create)" button.
2. Name your new app and select "Single Page Web Applications".
3. In the **Settings** for your new Auth0 app, add `http://localhost:4200/callback` (dev) and `http://localhost:3000/callback` (staging/prod) to the **Allowed Callback URLs**.*
4. Add `http://localhost:4200` (dev) and `http://localhost:3000` (staging/prod) to both the **Allowed Web Origins** and **Allowed Logout URLs**.* Click the "Save Changes" button.
5. If you'd like, you can [set up some social connections](https://manage.auth0.com/#/connections/social).† You can then enable them for your app in the **Application** options under the **Connections** tab.

*_You could set up separate Auth0 Applications for development and staging / production if you prefer._

†_If using social connections, set up your own social keys! _Do not_ leave social connections set to use Auth0 dev keys or you will encounter issues with token renewal._

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

1. Open `/api/config.js.sample` and remove `.sample` from the file name. Then replace `[YOUR_AUTH0_DOMAIN]` with your Auth0 domain (which can be found in your [Auth0 Dashboard](https://manage.auth0.com) application settings).
2. Open `/src/app/environments/environment.sample` and remove `.sample` from the file name. Then replace `[YOUR_CLIENT_ID]` and `[YOUR_AUTH0_DOMAIN]` with your Auth0 application's client ID and domain.
3. Open `/src/app/environments/environment.prod.sample` and remove `.sample` from the file name. Then replace `[YOUR_CLIENT_ID]` and `[YOUR_AUTH0_DOMAIN]` with your Auth0 application's client ID and domain.

> **Note:** If you used different Auth0 Applications for development and staging / production, `[YOUR_CLIENT_ID]` will differ between environment files.

## Serving the Project

### Development

From the root of this project, run:

```bash
$ npm run dev
```

This uses [nodemon](https://www.npmjs.com/package/nodemon) and [concurrently](https://www.npmjs.com/package/concurrently) to serve the API as well as the Angular app via the [Angular CLI](https://cli.angular.io) using a proxy. Your app will be available in the browser at `http://localhost:4200` and the API will be available at `http://localhost:4200/api`. Changes in the Angular app will be watched by the Angular CLI and changes to the API will be watched by nodemon.

### Staging / Production

To build _and_ serve a production-ready version of the application, from the root of this project, run:

```bash
$ npm run stage
```

This will perform a production build of your Angular application and serve the minified `dist` build and API, available in the browser at `http://localhost:3000`. Changes will _not_ be watched.

If you have _already built_ the Angular app and just want to serve it, you can run:

```bash
$ node server
```

## Authentication Stream

This project supplies a stream of authentication events (called `authStatus$` and available in the `auth.service.ts` file) that you can subscribe to in order to follow the authentication flow in your browser's console when developing the application.

You can also see the current status of the authentication flow via the `authStatus` property supplied by `auth.service.ts`.

### Auth Status Events

* `init_no_auth_flag` - application initialized, no knowledge of an authenticated user ("logged out" state)
* `init_with_auth_flag` - application initialized, simple flag already exists in local storage indicating that this app believes a user was logged in previously and has not logged out (meaning they might have a valid session on the authorization server; authentication data not available in the front end yet)
* `open_popup` - authentication popup has been opened (`login()` method was called)
* `login_canceled` - authentication canceled before it could complete (e.g., the user closed the popup window without logging in)
* `renew_auth` - app is requesting authentication information from the authorization server silently, either to restore a previous session or to silently renew an expired token
* `schedule_silent_auth_renewal` - silent token renewal has been scheduled so if the user's token expires during a session, it will be silently renewed as long as their authorization server session is valid
* `login_success` - user has successfully been authenticated
* `local_logout_begin` - initializing logout locally in the Angular application
* `local_logout_complete` - authentication data has been cleared _locally_ in the Angular application (note: when _authorization server logout_ takes place, the app will perform a full-page redirect)
* `start_silent_auth_renewal` - token is expiring; begin silently requesting a fresh token from the authorization server
* `remove_silent_auth_renewal` - unsubscribe from automatic token renewal

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

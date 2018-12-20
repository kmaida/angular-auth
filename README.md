# Angular Authentication with Auth0

## Prerequisites

* [Node.js with npm](http://nodejs.org), Node >= 6.9.0, npm >= 3
* [@angular/cli](https://github.com/angular/angular-cli), >= 7
* [node-secure-dino-api](https://github.com/kmaida/node-secure-dino-api), cloned, configured, and running locally (follow README instructions in `node-secure-dino-api` repo)

### Sign Up for Auth0

1. To create your _free_ Auth0 account, visit [auth0.com](https://auth0.com) and click Sign Up.
2. Use Google, GitHub, or Microsoft Account to log in.

### Auth0 Setup

1. Make sure you have followed the [API Setup instructions in the API README here](https://github.com/kmaida/node-secure-dino-api#auth0-setup).
2. Go to your [**Auth0 Dashboard: Applications**](https://manage.auth0.com/#/applications) section and click the "[+ Create Application](https://manage.auth0.com/#/applications/create)" button.
3. Name your new app and select "Single Page Web Applications".
4. In the **Settings** for your new Auth0 app, add `http://localhost:4200/callback` (dev) and `http://localhost:3000/callback` (stage) to the **Allowed Callback URLs**.
5. (If / when you have a production URL, add it (with the `/callback` segment) to **Allowed Callback URLs** as well.)
6. Add `http://localhost:4200` (dev) and `http://localhost:3000` (stage) to both the **Allowed Web Origins** and **Allowed Logout URLs**. Click the "Save Changes" button.
7. (If / when you have a production URL, add that to the **Allowed Web Origins** and **Allowed Logout URLs** as well.)
8. You can also [set up some social connections](https://manage.auth0.com/#/connections/social).* You can then enable them for your app in the **Application** options under the **Connections** tab.

*_If using social connections, set up your own social keys! Do not leave social connections set to use Auth0 dev keys or you will encounter issues with token renewal._

## Installation

**Prerequisite:** [node-secure-dino-api](https://github.com/kmaida/node-secure-dino-api) should already be cloned, installed, and running locally. By default, this runs on `http://localhost:3005`.

Clone this repository locally:

```bash
$ git clone https://github.com/kmaida/angular-auth.git
```

From the root directory, run the following command to install dependencies:

```bash
$ npm install
```

## Configuration

1. Open `/src/environments/environment.ts.sample` and remove `.sample` from the file name. Replace `{YOUR_AUTH0_CLIENT_ID}` and `{YOUR_AUTH0_DOMAIN}` with your Auth0 application's client ID and domain. Replace `{YOUR_ROLES_NAMESPACE}` with `https://secure-dino-api/roles`.
2. Open `/src/environments/environment.stage.ts.sample` and remove `.sample` from the file name. Then replace `{YOUR_AUTH0_CLIENT_ID}` and `{YOUR_AUTH0_DOMAIN}` with your Auth0 application's client ID and domain. Replace `{YOUR_ROLES_NAMESPACE}` with `https://secure-dino-api/roles`.
3. (If / when you know your production URL, open `/src/environments/environment.prod.ts.sample` and remove `.sample` from the file name. Then replace `{YOUR_AUTH0_CLIENT_ID}`, `{YOUR_AUTH0_DOMAIN}` with your Auth0 application's client ID and domain. Replace `{YOUR_ROLES_NAMESPACE}` with `https://secure-dino-api/roles`. Replace `{YOUR_PRODUCTION_URL}` with your app's deployed production URL, e.g., `https://my-angular-app.com`.)

## Serving the Project

### Development

From the root of this project, run:

```bash
$ npm start
# ng serve
```

This uses the [Angular CLI](https://cli.angular.io) to serve the application. Your app will be available in the browser at `http://localhost:4200`.

(Make sure you've also started the Node API, which can be found at [node-secure-dino-api](https://github.com/kmaida/node-secure-dino-api).)

### Staging / Production

To build _and_ serve a compiled version of the application, from the root of this project, run:

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

This project provides a stream of authentication events (called `authStatus$` and available in the `auth.service.ts` file) that you can subscribe to in order to follow the authentication flow in your browser's console when developing the application.

You can also see the current status of the authentication flow via the `authStatus` property supplied by `auth.service.ts`.

To take advantage of the authentication stream, you can subscribe to it in a component such as the `AuthHeader` and log each event to the console.

## Author

[Kim Maida](https://kmaida.io)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.

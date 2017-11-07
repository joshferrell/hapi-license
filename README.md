# ![Hapi License](https://i.imgur.com/6drEN2O.png) Hapi License

[![Greenkeeper badge](https://badges.greenkeeper.io/joshferrell/hapi-license.svg)](https://greenkeeper.io/)

[![Join the chat at https://gitter.im/hapi-license/Lobby](https://badges.gitter.im/hapi-license/Lobby.svg)](https://gitter.im/hapi-license/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/joshferrell/hapi-license.svg?branch=master)](https://travis-ci.org/joshferrell/hapi-license)
[![Coverage Status](https://coveralls.io/repos/github/joshferrell/hapi-license/badge.svg?branch=master)](https://coveralls.io/github/joshferrell/hapi-license?branch=master)
[![bitHound Dependencies](https://www.bithound.io/github/joshferrell/hapi-license/badges/dependencies.svg)](https://www.bithound.io/github/joshferrell/hapi-license/master/dependencies/npm)

A licensing api that uses auth0 authentication. Give the licensing server machine information and the server will create a license for the user.

## Getting Started

Before starting, you will first need to look at the `.env.example` file for your environment variables.
To get up and running, simply duplicate the `.env.example` file to `.env`.

***Install Application***
```
yarn install
```

***Run Application***
```
yarn start
```

## Available Commands

### `yarn start`
Runs the app in development mode.
Open http://localhost:3000/documentation to view documentation
for the server in the browser.

The server will reload if you make edits.

[View Server Documentation](http://localhost:3000/documentation)<br />
[View Interactive Server Logs](http://localhost:3000/tv)<br />

### `yarn test:spec --watchAll`
Runs the test watcher in an interactive mode.
By default, runs tests related to files changed since the last commit.

[Read more about testing](https://facebook.github.io/jest/docs/en/getting-started.html)
### `yarn lint`
Runs the linting command, should be done before pull requests are made.
This application follows the airbnb linting styleguide with minor changes.

[Read more about the styleguide](https://github.com/airbnb/javascript)
### `yarn coverage`
Runs the jest coverage command, checks the current code coverage of the application.
The standard is keeping coverage above or at yellow status.

## Docs

For further documentation, please [read the wiki](https://github.com/joshferrell/hapi-license/wiki) for information on interfacing with the api.

## TODO
Create documentation about:
* authentication token structure
* manipulating license count in auth0

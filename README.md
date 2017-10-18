# ![Hapi License](https://i.imgur.com/6drEN2O.png) Hapi License

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

### Fetching Computer information

#### computerId

Computer's unique identifier, you can use the [node-machine-id](https://github.com/automation-stack/node-machine-id) package to generate a unique id

`yarn add node-machine-id`

```
import { machineId } from 'node-machine-id';
const computerUsername = machineId() // Returns Promise
```

#### computerUsername
User of the account on the machine that is using the package. Useful for license management for users so they can see which machines they can deactivate

```
import os from 'os';
const computerUsername = os.userInfo().username;
```

#### computerOS
Operating system of the computer. Another useful identifier for the user so that they can identify different computers for license management.

```
import os from 'os';
const computerOS = os.type();
```

#### computerName
Machine name for the user to know which computer the license is issued for.

```
import os from 'os';
const computerName = os.hostname();
```

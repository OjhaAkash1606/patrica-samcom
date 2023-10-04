# Patricia

## Table of Contents

- [Patricia](#patricia)
  - [Table of Contents](#table-of-contents)
  - [Tech stack](#tech-stack)
  - [Installation](#installation)
  - [Style Guides](#style-guides)
  - [Folder Structure:](#folder-structure)
  - [State Management:](#state-management)
  - [Internationalization](#internationalization)
  - [Contribution](#contribution)

## Tech stack

1. Formatting:
   - [typescript](https://www.typescriptlang.org/)
   - [es-lint](https://eslint.org/docs/user-guide/configuring/)
   - [prettier](https://prettier.io/docs/en/index.html)
2. UI:
   - [React](https://reactjs.org/docs/react-api.html),
   - [Material-UI v5](https://material-ui.com/guides/api/),
   - [styled-components](https://styled-components.com/docs).
3. State Management:
   - [react-redux](https://react-redux.js.org/api/connect)
   - [redux-saga](https://redux-saga.js.org/)
4. Form management:
   - [React Hook Form](https://react-hook-form.com/api/)
   - [Form validation - yup](https://www.npmjs.com/package/yup)
5. Utilities:
   - [date-fns](https://date-fns.org/)
   - [lodash](https://lodash.com/docs/4.17.15)
6. HTTP Client:
   - [axios](https://github.com/axios/axios)
7. List Virtualization:
   - [react-window](https://react-window.now.sh/#/examples/list/fixed-size)
8. Table:
   - [react-table v7](https://react-table.tanstack.com/docs/api/overview)
9. Animations:
   - [react-spring](https://react-spring.io/)
10. PDF creation:
    - [react-pdf](https://react-pdf.org/).
11. Internationalization:
    - [react-intl](https://formatjs.io/docs/react-intl/)

- note - @emotion is included because it's peer dependency of Material-UI v5.

## Installation

1. Clone the repository and navigate to root directory.
2. Run `npm install`.
3. Run `npm start`.
4. Navigate to `localhost:3000`.

## Style Guides

- Javascript/React: [AirBnB](https://github.com/airbnb/javascript).
- Commit Message Format: [Angular commit message format](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-format).
- [Styled-components & Material-UI](https://levelup.gitconnected.com/material-ui-styled-components-fff4d345fb07).

## Folder Structure:

```
src
├── pages                                       # app screens
│   ├── [app-name]                              # private routes
│   │    ├── <screen-name>
│   │    │     ├── package.json                 # Indicate the main file entry
│   │    │     └── ScreenName.tsx
│   │    └── layout                             # layout components
│   │
│   └── auth                                    # public routes
│         └── <screen-name>
│               ├── package.json                # Indicate the main file entry
│               └── ScreenName.tsx
├── constants                                   # app config & constants
│       └── <type.constants.ts>
├── components
│       └── <ComponentName>
│                ├── package.json               # Indicate the main file entry
│                └── ComponentName.tsx
├── documents                                   # PDF screens
│     ├── components                            # PDF specific components
│     ├── documents.config.ts                   # PDF configurations(fonts, etc.)
│     └── <DocumentName>                        # PDF Document implementation
│            ├── package.json                   # Indicate the main file entry
│            └── DocumentName.tsx
├── hooks                                       # custom hooks
├── i18n                                        # internationalization
│     ├── IntlProvider.tsx                      # Provider of intl. messages and locales
│     ├── messages.config.ts                    # Message-id constants
│     ├── messages.<lang>.ts                    # Messages declaration for a specific language
│     └── messages.ts                           # an Object containing all the supported message declarations
├── utils                                       # Tools and utilities
│     └── <util-name>.utils.ts
├── assets                                      # assets folder
├── router
│     ├── routes.config.ts                      # routes array
|     ├── [app].routes.ts                       # app route urls
│     ├── PrivateRoute.tsx                      # protected routes gate
│     └── RouterGate.tsx                        # router switch component
├── style
│     ├── GlobalStyles.tsx                      # global styles will be here
│     ├── SharedStyle.tsx                       # shared styled components
│     └── theme
│           ├── index.ts                        # styled-components theme
│           └── ThemeProvider.tsx               # styled-components theme provider
├── store
│     ├── actions                               # actions folder
│     │      └── <reducerName.actions>.ts       # name should be related to reducer name
│     ├── constants                             # constants folder
│     │      └── <reducerName.constants>.ts     # name should be related to reducer name
│     ├── reducers                              # constants folder
│     │      ├── index.ts                       # exports combined reducer
│     │      └── <reducerName.reducer>.ts
│     ├── sagas                                 # sagas folder
│     │      └── <reducerName.saga>.ts          # name should be related to reducer name
│     ├── selectors                             # selectors folder
│     │      └── <reducerName.selector>.ts      # name should be related to reducer name
│     └── types                                 # types folder - contains store related types
│            └── <reducerName.types>.ts         # name should be related to reducer name
├── types
│     └── <reducerName.types>.ts                # generic types
│
└── api
     ├── client.ts                              # api call
     ├── methods.ts                             # custom calls
     ├── responses.ts                           # responses types definition
     └── transform.ts                           # responses transformers
```

## State Management:

Async actions with saga should have three action types:

1. `ACTION_NAME_REQUEST` - the action which should be dispatched by the component, and start the saga.
2. `ACTION_NAME_FULFILLED` - success action which should be dispatched by the saga and expected by the reducer.
3. `ACTION_NAME_REJECTED` - the action which should be dispatched by the saga and expected by the reducer.

- the constant strings should be formatted as following: "reducerName/actionNamePending".

## Internationalization

Currently, We support the following languages and locales:

- English.
- Hebrew - IN PROGRESS.

All of the intl. goes into `i18n` folder, message ids should be declared on the `messages.config.ts`, and then on each supported language (`messages.<lang>.ts`).
the message ids should be formatted as following: `<app>.<scope>.<id>` (e.g. `client.homepage.ENTER_HOME_BUTTON`).

- For RTL adaptations, you can use the [styled-components-rtl adapter](https://github.com/maxkudla/styled-components-rtl#readme)

## Contribution

1. When ready to commit, run `npm run isready` to validate the format/lint/build workflow.
2. After staging your changes, you should create a commit message according to the [commit style guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-format) (provided by Angular).
3. Push your changes to a new branch, and compare it to the `dev` branch.

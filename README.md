# feathers-splunk

[![Dependency Status](https://img.shields.io/david/senthiljruby/feathers-splunk.svg?style=flat-square)](https://david-dm.org/senthiljruby/feathers-splunk)
[![Download Status](https://img.shields.io/npm/dm/feathers-splunk.svg?style=flat-square)](https://www.npmjs.com/package/feathers-splunk)

>

## Installation

```
npm install feathers-splunk --save
```

## Documentation


### Complete Example

Here's an example of a Feathers server that uses `feathers-splunk`.

#### app.js

```js
const feathers = require("@feathersjs/feathers");
const splunk = require("feathers-splunk");

// Initialize the application
const app = feathers();

// Initialize the plugin
app.configure(
  splunk({
    token: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    url: "<SPLUNK_URL>" // usually have the port of 8088
  })
);
```

#### xx.hooks.js

```js
const { splunkHooks } = require("feathers-splunk");

// Add it to the hooks of services

module.exports = {
  before: {
    all: [splunkHooks()], // for logging data when before hook called
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [splunkHooks()], // for logging data when after hook called
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [splunkHooks()], // For logging errors
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
```

### Customization

##### For creating custom index for splunk

1. Create New Index in settings/Indexes (splunk)
2. Link the created indexes into settings/indexes (HTTP Event Collector)
3. Modify the app.js configuration to the below

```js
  app.configure(
    splunk({
      token: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      url: "<SPLUNK_URL>" // usually have the port of 8088,
      index: 'senthil'
    })
  );
```

##### Changing the metadata of the splunk logging

1.  Modify the xx.hooks.js to the metadata below

```js
  before: {
    all: [
      splunkHooks({
        source: "/message",
        sourcetype: "rest-call",
        index: "senthil",
        host: "http://localhost",
        port: "3000"
      })
    ], // for logging data when before hook called
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
```

## License

Copyright (c) 2018

Licensed under the [MIT license](LICENSE).

## Author
 
[Senthil Kumar Bhaskaran](https://www.linkedin.com/in/senthil-kumar-bhaskaran-3b117925)
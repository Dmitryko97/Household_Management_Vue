let clearDB = require('./testutil').clearDB;
let axios = require('axios');
let auth = require('../REST/auth');
let serverConfig = require('../REST/serverConfig');

let chai = require("chai");
let chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

let chaiSubset = require('chai-subset');
let server = require("../REST/server");
chai.use(chaiSubset);

let chaiDateString = require('chai-date-string');
chai.use(chaiDateString);

axios.defaults.withCredentials = true;

before((done) => {
  serverConfig.loginEnabled = false;
  require("../REST/runserver_test")(() => done());
});

after(() => {
  return clearDB();
});

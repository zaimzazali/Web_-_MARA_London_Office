/* eslint-disable no-console */
/* eslint-disable vars-on-top */
/* eslint-disable func-names */
/* eslint-disable camelcase */
/* eslint-disable no-var */
/* eslint-disable strict */

'use strict';

// --------------------------------------------------------------------------------------------------------------
// Modules initialisation

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

// --------------------------------------------------------------------------------------------------------------
// Other Server-Side files

var services_contactUs = require('./routes/serverSideJs/services_contactUs');
var services_signUp = require('./routes/serverSideJs/services_signUp');
var services_forgetPassword = require('./routes/serverSideJs/services_forgetPassword');
var services_login = require('./routes/serverSideJs/services_login');

var cookieSession = require('cookie-session');
var services_cookieSession = require('./routes/serverSideJs/services_cookieSession');
var extraFunctions = require('./routes/serverSideJs/extraFunctions');

// --------------------------------------------------------------------------------------------------------------
// Express setting

var app = express();
var port = 80;
// --------------------------------------------------------------------------------------------------------------
// Serving Public Page

app.use(express.static('./public'));
app.get('/', function (request, response) {
  response.sendFile('./public/index.html');
});

// --------------------------------------------------------------------------------------------------------------
// Prevent direct access to other pages

var permittedLinker = ['localhost', '127.0.0.1'];

function directAccess(request, response, next) {
  var i = 0;
  var notFound = 1;
  var referer = request.get('Referer');
  if (request.path === '/' || request.path === '') next();

  if (referer) {
    while (i < permittedLinker.length && notFound) {
      notFound = referer.indexOf(permittedLinker[i]) === -1;
      i += 1;
    }
  }

  if (notFound) {
    response.redirect('/');
  } else {
    next(); // access is permitted, proceed
  }
}

app.use(directAccess);

// --------------------------------------------------------------------------------------------------------------
// Cookie Session

app.set('trust proxy', 1);
app.use(
  cookieSession({
    name: 'sessionMARA',
    keys: [extraFunctions.randomString(50), extraFunctions.randomString(50)],
    maxAge: 4 * 60 * 60 * 1000, // 4 hours to keep the cookie
  })
);

app.post('/check_cookie', function (request, response, next) {
  async function run() {
    await services_cookieSession
      .checkCookie(request)
      .then(function (result) {
        response.send(result);
      })
      .catch(function () {
        response.send('ERROR');
      })
      .finally(function () {
        next();
      });
  }

  run();
});

app.post('/remove_cookie', function (request, response, next) {
  async function run() {
    await services_cookieSession
      .removeCookie(request)
      .then(function () {
        response.send('OK');
      })
      .catch(function () {
        response.send('ERROR');
      })
      .finally(function () {
        next();
      });
  }

  run();
});

// --------------------------------------------------------------------------------------------------------------
// Other Pages

const routes = '/routes';
app.use(express.static(path.join(__dirname, `${routes}`)));

const pages = '/routes/pages';
app.use(express.static(path.join(__dirname, `${pages}`)));

// --------------------------------------------------------------------------------------------------------------
// Not compatible matters

app.get('/not_compatible', function (request, response) {
  response.sendFile(path.join(__dirname, `${pages}/not_compatible/browser_not_compatible.html`));
});

// --------------------------------------------------------------------------------------------------------------
// Pages - Student Portal

app.get('/portal_student', function (request, response) {
  response.sendFile(path.join(__dirname, `${pages}/portal_student/portal_student.html`));
});

// --------------------------------------------------------------------------------------------------------------
// Extra functions

app.use(bodyParser.json());

// --------------------------------------------------------------------------------------------------------------
// Contact Us

app.post('/send_message_contact_us', function (request, response) {
  async function run() {
    await services_contactUs
      .sendEmail(request)
      .then(function () {
        response.send('OK');
      })
      .catch(function () {
        response.send('ERROR');
      });
  }

  run();
});

// --------------------------------------------------------------------------------------------------------------
// Sign Up

app.post('/check_MARA_id', function (request, response) {
  async function run() {
    await services_signUp
      .checkMaraID(request)
      .then(function (result) {
        response.send(result);
      })
      .catch(function () {
        response.send('ERROR');
      });
  }

  run();
});

app.post('/register_user', function (request, response) {
  async function run() {
    await services_signUp
      .registerUser(request)
      .then(function () {
        response.send('OK');
      })
      .catch(function () {
        response.send('ERROR');
      });
  }

  run();
});

// --------------------------------------------------------------------------------------------------------------
// Forget Password

app.post('/forget_password', function (request, response) {
  async function run() {
    await services_forgetPassword
      .resetPassword(request)
      .then(function (result) {
        response.send(result);
      })
      .catch(function () {
        response.send('ERROR');
      });
  }

  run();
});

// --------------------------------------------------------------------------------------------------------------
// Login

app.post('/login', function (request, response) {
  async function run() {
    await services_login
      .tryLogin(request)
      .then(function (result) {
        response.send(result);
      })
      .catch(function () {
        response.send('ERROR');
      });
  }

  run();
});

// --------------------------------------------------------------------------------------------------------------
// Logon
/*
app.post('/logon', function (request, response) {
  var run = async function run() {
    try {
      var data = await services_login.setLogon(request);
      response.send(data);
    } catch (error) {
      response.send('ERROR');
    }
  };

  run();
});
*/
// --------------------------------------------------------------------------------------------------------------
// Before exit user page
/*
app.post('/setLogout', function (request, response) {
  services_login.setLogout(request);
  response.send('OK');
});
*/
// --------------------------------------------------------------------------------------------------------------
// Hosting

app.listen(port, function () {
  console.log('Express server is listening on port '.concat(port, '!'));
});

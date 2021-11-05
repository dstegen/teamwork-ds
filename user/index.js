/*!
 * user/index.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const path = require('path');
const bcrypt = require('bcryptjs');
const { cookie, uniSend, getFormObj, SendObj, Auth } = require('webapputils-ds');
const locale = require('../lib/locale');
const config = require('../main/models/model-config').getConfig();
const { initUsers, getPasswdObj, getUserDetails, updatePassword, updateUser } = require('./models/model-user');
const getNaviObj = require('../lib/getNaviObj');
const settingsView = require('./views/settings-view');
const view = require('../main/views/base-view');
const userOverView = require('./views/user-over-view');

const authenticate = new Auth(path.join(__dirname, '../sessionids.json'));
initUsers();
let passwd = getPasswdObj();


function userController (request, response) {
  let route = request.url.substr(1).split('?')[0];
  //console.log(route);
  if (route === 'user/settings') {
    uniSend(view('', getNaviObj(getUserDetails(authenticate.getUserId(cookie(request).sessionid))), settingsView(authenticate.getUserId(cookie(request).sessionid))),response);
  } else if (route === 'user/updatepassword') {
    updatePasswordAction(request, response);
  } else if (route === 'user/updateuser') {
    updateUserAction(request, response);
  } else if (route === 'user/overview') {
    uniSend(view('', getNaviObj(getUserDetails(authenticate.getUserId(cookie(request).sessionid))), userOverView()),response);
  } else {
    uniSend(new SendObj(302, [], '', '/'), response);
  }
}


function login (request, response) {
  getFormObj(request).then(
    data => {
      uniSend(new SendObj(302, ['sessionid='+authenticate.login(passwd, data.fields.username, data.fields.password)]), response);
    }
  ).catch(
    error => {
      console.log('ERROR login: '+error.message);
  });
}

function logout (request, response) {
  authenticate.logout(cookie(request).sessionid)
  uniSend(new SendObj(302, ['sessionid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;']), response);
}

function userLoggedIn (request) {
  return authenticate.loggedIn(cookie(request).sessionid);
}

function userDetails (request) {
  return getUserDetails(authenticate.getUserId(cookie(request).sessionid));
}


function updatePasswordAction (request, response) {
  getFormObj(request).then(
    data => {
      if (bcrypt.compareSync(data.fields.password, passwd[data.fields.userId]) && data.fields.new_password === data.fields.retype_password) {
        passwd = authenticate.addPasswd(passwd, data.fields.userId, data.fields.new_password);
        updatePassword(data.fields);
        uniSend(view('', getNaviObj(getUserDetails(authenticate.getUserId(cookie(request).sessionid))), settingsView(authenticate.getUserId(cookie(request).sessionid), locale.login.update_password_sucessfully[config.lang])),response);
      } else {
        console.log('- ERROR passwords didn\'t match for userId: '+data.fields.userId);
        uniSend(view('', getNaviObj(getUserDetails(authenticate.getUserId(cookie(request).sessionid))), settingsView(authenticate.getUserId(cookie(request).sessionid), locale.errors.old_password_wrong[config.lang])),response);
      }
    }
  ).catch(
    error => {
      console.log('- ERROR can\'t update password: '+error.message);
  });
}

function updateUserAction (request, response) {
  getFormObj(request).then(
    data => {
      updateUser(data.fields);
      uniSend(new SendObj(302, [], '', '/user/settings'), response);
    }
  ).catch(
    error => {
      console.log('ERROR can\'t update user seetings: '+error.message);
  });
}


module.exports = { userController, login, logout, userLoggedIn, userDetails, updateUserAction };

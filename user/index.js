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
const { initUsers, getPasswdObj, getUserDetails, updatePassword } = require('./models/model-user');
const getNaviObj = require('../lib/getNaviObj');
const setpasswordView = require('./views/setpassword-view');
const view = require('../main/views/base-view');

const authenticate = new Auth(path.join(__dirname, '../sessionids.json'));
initUsers();
let passwd = getPasswdObj();


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

function setPasswordAction (request, response) {
  uniSend(view('', getNaviObj(getUserDetails(authenticate.getUserId(cookie(request).sessionid))), setpasswordView(authenticate.getUserId(cookie(request).sessionid))),response);
}

function updatePasswordAction (request, response) {
  getFormObj(request).then(
    data => {
      if (bcrypt.compareSync(data.fields.password, passwd[data.fields.userId]) && data.fields.new_password === data.fields.retype_password) {
        passwd = authenticate.addPasswd(passwd, data.fields.userId, data.fields.new_password);
        updatePassword(data.fields);
        uniSend(view('', getNaviObj(getUserDetails(authenticate.getUserId(cookie(request).sessionid))), setpasswordView(authenticate.getUserId(cookie(request).sessionid), locale.login.update_password_sucessfully[config.lang])),response);
      } else {
        console.log('- ERROR passwords didn\'t match for userId: '+data.fields.userId);
        uniSend(view('', getNaviObj(getUserDetails(authenticate.getUserId(cookie(request).sessionid))), setpasswordView(authenticate.getUserId(cookie(request).sessionid), locale.errors.old_password_wrong[config.lang])),response);
      }
    }
  ).catch(
    error => {
      console.log('- ERROR can\'t update password: '+error.message);
  });
}


module.exports = { login, logout, userLoggedIn, userDetails, setPasswordAction, updatePasswordAction };

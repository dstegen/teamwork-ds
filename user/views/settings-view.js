/*!
 * user/views/settings-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../../main/models/model-config').getConfig();
const { getUserDetails } = require('../models/model-user');
const tooltip = require('../../main/templates/tooltip');


function settingsView (userId, message='') {
  let user = getUserDetails(userId);
  return `
    <div class="container py-3">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        User settings
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 gx-4 gy-1">
        <div class="col">
          <div class="card" style="min-height: 360px;">
            <div class="card-body">
              <h2 class="mb-0">${user.fname} ${user.lname}</h2>
              <h5 class="text-muted mt-0 mb-2">${user.position}</h5>
              <form action="/user/updateuser" method="post">
                <input type="text" name="id" class="d-none" hidden value="${user.id}" />
                <div class="form-group">
                  <label for="userId-field">Loggin-Name/UserId</label>
                  <input type="text" class="form-control" id="userId-field" name="userId" value="${user.userId}" required pattern="[a-zA-Z0-9.@-_]+">
                </div>
                <div class="form-group mt-2">
                  <label for="email-field">Email</label>
                  <input type="text" class="form-control" id="email-field" name="email" value="${user.email}">
                </div>
                <div class="form-group mt-2">
                  <label for="phone-field">Phone</label>
                  <input type="text" class="form-control" id="phone-field" name="phone" value="${user.phone}">
                </div>
                <div class="d-flex justify-content-end mb-2 mt-2">
                  <button type="submit" class="btn btn-sm btn-primary">${locale.buttons.update['en']}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card" style="min-height: 360px;">
            <div class="card-body">
              <h2 class="mb-3">User photo ${tooltip('Pls only upload square jpgs!')}</h2>
              <div class="d-flex justify-content-center mb-4">
                <img src="/data/users/pics/${user.id}.jpg" height="200" width="200" class="img-fluid border rounded-circle"/>
              </div>
              <form class="row mx-0 align-item-center" action="/fileupload" method="post" enctype="multipart/form-data">
                <input type="text" readonly class="d-none" id="id" name="id" value="${user.id}" />
                <input type="text" readonly class="d-none" id="urlPath" name="urlPath" value="/user/settings" />
                <input type="text" readonly class="d-none" id="filePath" name="filePath" value="/data/users/pics/" />
                <div class="col-sm-9">
                  <input type="file" class="form-control form-control-sm" id="filetoupload-${user.id}" name="filetoupload">
                  <div class="invalid-feedback">${locale.placeholder.invalid_feedback[config.lang]}</div>
                </div>
                <div class="col-sm-2 mt-2 mt-sm-0">
                  <button type="submit" class="btn btn-sm btn-primary">${locale.buttons.upload[config.lang]}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card" style="min-height: 360px;">
            <div class="card-body">
              <h2 class="mb-3">${locale.headlines.set_new_password[config.lang]}</h2>
              <form action="/user/updatepassword" method="post" enctype="application/x-www-form-urlencoded" name="setpassword-form">
                <input type="text" readonly class="d-none" id="userId" name="userId" value="${userId}">
                <div class="form-group">
                  <label for="login-password">${locale.placeholder.old_password[config.lang]}</label>
                  <input type="password" class="form-control mt-1" id="password" name="password" placeholder="${locale.placeholder.old_password[config.lang]}" required>
                </div>
                <div class="form-group mt-2">
                  <label for="login-password">${locale.placeholder.new_password[config.lang]}</label>
                  <input type="password" class="form-control mt-1" id="new_password" name="new_password" placeholder="${locale.placeholder.new_password[config.lang]}" required>
                </div>
                <div class="form-group mt-2">
                  <label for="login-password">${locale.placeholder.retype_password[config.lang]}</label>
                  <input type="password" class="form-control mt-1" id="retype_password" name="retype_password" onKeyUp="isPasswordMatch();" placeholder="${locale.placeholder.retype_password[config.lang]}" required>
                  <div id="divCheckPassword" class="small text-danger"></div>
                </div>
                <div class=" d-flex justify-content-end mt-3">
                  <button type="submit" class="btn btn-sm btn-primary">
                    ${locale.buttons.update[config.lang]}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container text-center">
      <p class="text-danger pb-5">
        ${message}
      </p>
    </div>
    <script>
      function isPasswordMatch() {
          var password = $("#new_password").val();
          var confirmPassword = $("#retype_password").val();
          if (password != confirmPassword) $("#divCheckPassword").html("${locale.errors.passwords_not_match[config.lang]}");
          else $("#divCheckPassword").html("");
      }
    </script>
   `;
}


module.exports = settingsView;

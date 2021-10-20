/*!
 * user/views/setpassword-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../../main/models/model-config').getConfig();


function setpasswordView (userId, message='') {
  return `
   <!-- Setpassword-form -->
    <div class="container py-3">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        User settings
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
      <div class="d-flex justify-content-center">
        <div class="border w-md-50">
          <div class="card-body">
            <h2 class="mb-3">${locale.headlines.set_new_password[config.lang]}</h2>
            <form action="/updatepassword" method="post" enctype="application/x-www-form-urlencoded" name="setpassword-form">
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
                <button type="submit" class="btn btn-secondary">
                  ${locale.buttons.update[config.lang]}
                </button>
              </div>
            </form>
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


module.exports = setpasswordView;

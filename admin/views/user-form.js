/*!
 * main/views/user-form.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const tooltip = require('../../main/templates/tooltip');
const formTextInput = require('../../main/templates/form-textinput');


function userForm (user) {
  return `
    <div class="border py-2 px-3 mb-3">
      <h3>Add/Update user:</h3>
      <form action="/admin/updateuser" method="post">
        <input type="text" name="id" class="d-none" hidden value="${user.id}" />
        <div class="form-group row mb-1">
          ${Object.keys(user).map( key => helperInputs(user[key], key, user)).join('<div class="w-100"></div>')}
        </div>
        <div class="d-flex justify-content-end mb-2">
          <button type="button" class="btn btn-secondary me-3" onclick="window.open('/admin', '_top', '');">${locale.buttons.cancle['en']}</a>
          <button type="submit" class="btn btn-primary">${locale.buttons.add_update['en']}</button>
        </div>
      </form>
    </div>
  `;
}


// Additional functions

function helperInputs (value, prop) {
  if (prop !== 'id' && prop !== 'role' && prop !== 'admin') {
    let required = 'required';
    if (prop === 'phone' || prop === 'email'|| prop === 'courses' || prop === 'password') required = '';
    if (prop === 'password') value = '';
    switch (prop) {
      case 'userId':
        return formTextInput(value, prop, 'required pattern="[a-zA-Z0-9.@\-_]+"',tooltip('Use email-address as userId'));
      default:
        return formTextInput(value, prop, required);
    }
  } else {
    return '';
  }
}


module.exports = userForm;

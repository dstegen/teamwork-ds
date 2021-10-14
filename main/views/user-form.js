/*!
 * main/views/user-form.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const { getGroupConfig } = require('../models/model-group');
const tooltip = require('../../main/templates/tooltip');
const formSelect = require('../../main/templates/form-select2');
const formTextInput = require('../../main/templates/form-textinput');


function userForm (user, classes) {
  return `
    <div class="border py-2 px-3 mb-3">
      <h3>Add/Update user:</h3>
      <form action="/admin/updateuser" method="post">
        <input type="text" name="id" class="d-none" hidden value="${user.id}" />
        <div class="form-group row mb-1">
          ${Object.keys(user).map( key => helperInputs(user[key], key, classes, user)).join('<div class="w-100"></div>')}
        </div>
        <div class="d-flex justify-content-end mb-2">
          <button type="button" class="btn btn-info ml-3" onclick="window.open('/admin', '_top', '');">${locale.buttons.cancle['en']}</a>
          <button type="submit" class="btn btn-primary ml-3">${locale.buttons.add_update['en']}</button>
        </div>
      </form>
    </div>
  `;
}


// Additional functions

function helperInputs (value, prop, classes, user) {
  if (prop !== 'id') {
    let required = 'required';
    if (prop === 'phone' || prop === 'email'|| prop === 'courses' || prop === 'password') required = '';
    if (prop === 'password') value = '';
    let courses = [];
    switch (prop) {
      case 'role':
        return formSelect(['','member','student'], value, prop);
      case 'gender':
        return formSelect(['','male','female'], value, prop);
      case 'group':
        return formSelect(classes, value, prop, '', 'multiple');
      case 'leader':
        return formSelect(classes, value, prop, '', 'multiple', '');
      case 'courses':
        if (user.group[0]) {
          for (let i=0; i<user.group.length; i++) {
            courses = courses.concat(getGroupConfig(user.group[i]).courses.map( item => { return item.name; } ));
            courses = Array.from(new Set(courses));
          }
          return formSelect(courses, value, prop, '', 'multiple');
        } else {
          return '';
        }
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

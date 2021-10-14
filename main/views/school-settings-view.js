/*!
 * main/views/school-settings-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../models/model-config').getConfig();
const formSelect = require('../../main/templates/form-select2');
const formTextInput = require('../../main/templates/form-textinput');


function schoolSettingsView () {
  return `
    <div id="dashboard" class="container">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        School-Settings
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
      <div class="border py-2 px-3 mb-3">
        <h3>School-Config</h3>
        <form action="/admin/school" method="post">
          <input type="text" name="action" class="d-none" hidden value="updatesettings" />
          <div class="form-group row mb-1">
            ${formSelect(['en','de'], config.lang, 'lang')}
            ${Object.keys(config).map( key => formTextInput(config[key], key)).join('<div class="w-100"></div>')}
          </div>
          <div class="d-flex justify-content-end mb-2">
            <button type="submit" class="btn btn-primary ml-3">${locale.buttons.update['en']}</button>
          </div>
        </form>
      </div>
      <div class="border py-2 px-3 mb-3">
        <h3>Add new class/group</h3>
        <form action="/admin/school" method="post">
          <input type="text" name="action" class="d-none" hidden value="addgroup" />
          <div class="form-group row mb-1">
          ${formTextInput('', 'newGroup', 'pattern="[a-zA-Z0-9]+"')}
          </div>
          <div class="d-flex justify-content-end mb-2">
            <button type="submit" class="btn btn-primary ml-3">Add new class</button>
          </div>
        </form>
      </div>
    </div>
  `;
}


module.exports = schoolSettingsView;

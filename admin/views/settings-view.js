/*!
 * main/views/settings-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../../main/models/model-config').getConfig();
const formSelect = require('../../main/templates/form-select');


function settingsView () {
  return `
    <div id="dashboard" class="container py-3">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        General Setup
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
      <div class="border py-2 px-3 mb-3">
        <h3>TeamWork-DS Config</h3>
        <form action="/admin/school" method="post">
          <input type="text" name="action" class="d-none" hidden value="updatesettings" />
          <div class="form-group row mb-1">
            ${formSelect(['en','de'], config.lang, 'lang')}

          </div>
          <div class="d-flex justify-content-end mb-2">
            <button type="submit" class="btn btn-primary ml-3">${locale.buttons.update['en']}</button>
          </div>
        </form>
      </div>
    </div>
  `;
}


module.exports = settingsView;

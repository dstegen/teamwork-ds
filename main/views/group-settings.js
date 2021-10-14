/*!
 * main/views/group-settings.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../models/model-config').getConfig();
const { getGroupConfig } = require('../models/model-group');
const formCheckbox = require('../../main/templates/form-checkbox');
const formSelect = require('../../main/templates/form-select2');
const formTextInput = require('../../main/templates/form-textinput');


function groupSettings (group) {
  if (group && group !== '') {
    return `
      <div class="border py-2 px-3 mb-3">
        <h5>Course-Config for class/group ${group}</h5>
        <form action="/admin/settings" method="post">
          <input type="text" name="action" class="d-none" hidden value="updategroupsettings" />
          <input type="text" name="group" class="d-none" hidden value="${group}" />
          <div class="form-group row mb-1">
          ${getGroupConfig(group).courses.map( item => formSelect(config.courseColors, item.color, item.name)).join('<div class="w-100"></div>')}
          </div>
          <div class="d-flex justify-content-end mb-2">
            <button type="submit" class="btn btn-primary ml-3">${locale.buttons.update['en']}</button>
          </div>
        </form>
      </div>
      <div class="border py-2 px-3 mb-3">
        <h5>Add new course to class/group ${group}</h5>
        <form action="/admin/settings" method="post">
          <input type="text" name="action" class="d-none" hidden value="updategroupsettings" />
          <input type="text" name="group" class="d-none" hidden value="${group}" />
          <div class="form-group row mb-1">
            ${formTextInput('', 'newCourse', 'pattern="[a-zA-Z0-9]+"')}
            <div class="w-100"></div>
            ${formSelect(config.courseColors, '', 'color')}
          </div>
          <div class="d-flex justify-content-end mb-2">
            <button type="submit" class="btn btn-primary ml-3">Add new course</button>
          </div>
        </form>
      </div>

      <div class="border py-2 px-3 mb-3">
        <h5>Advance/move class/group ${group}</h5>
        <form action="/admin/settings" method="post">
          <input type="text" name="action" class="d-none" hidden value="advancegroup" />
          <input type="text" name="oldGroup" class="d-none" hidden value="${group}" />
          <div class="form-group row mb-1">
          ${formTextInput('', 'newGroup', 'pattern="[a-zA-Z0-9]+"')}
          <div class="w-100"></div>
          ${formCheckbox(['delLessons','cleanBoard'], 'options', [], ['delLessons','cleanBoard'], true)}
          </div>
          <div class="d-flex justify-content-end mb-2">
            <button type="submit" class="btn btn-danger ml-3">${locale.buttons.update['en']}</button>
          </div>
        </form>
      </div>
    `;
  } else {
    return '';
  }
}


module.exports = groupSettings;

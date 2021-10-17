/*!
 * main/templates/form-textinput.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';


function formTextInput (value, prop, required='required', infoTooltip='', disabled='', type='text') {
  if (prop !== 'id' && prop !== 'classes' && prop !== 'courseColors' && prop !== 'lang') {
    return `
      <label for="${prop}-field" class="col-sm-2 col-form-label text-right text-truncate mb-2">${prop} ${infoTooltip}</label>
      <div class="col-sm-7">
        <input type="${type}" class="form-control" id="${prop}-field" name="${prop}" value="${value}" ${required} ${disabled}>
      </div>
    `;
  } else {
    return '';
  }
}


module.exports = formTextInput;

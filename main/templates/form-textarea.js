/*!
 * main/templates/form-textarea.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';


function formTextArea (value, prop, required='required', infoTooltip='') {
  if (prop !== 'id' && prop !== 'classes' && prop !== 'courseColors' && prop !== 'lang') {
    return `
      <label for="${prop}-field" class="col-sm-2 col-form-label text-right text-truncate mb-2">${prop} ${infoTooltip}</label>
      <div class="col-sm-7">
        <textarea class="form-control mb-2" id="${prop}-field" name="${prop}" rows="3" ${required}>${value}</textarea>
      </div>
    `;
  } else {
    return '';
  }
}


module.exports = formTextArea;

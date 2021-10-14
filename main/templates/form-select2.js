/*!
 * main/templates/form-select2.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';


function formSelect2 (optionsList, value, prop, onchange='', multiple='', required='required') {
  return `
    <label for="${prop}-field" class="col-sm-2 col-form-label text-right text-truncate">${prop}</label>
    <div class="col-sm-7 mb-2">
      <select ${multiple} class="form-control form-control-sm" id="${prop}-field" name="${prop}" ${required} ${onchange}>
        ${optionsList.map( item => helperSelectOption(item, value) ).join('')}
      </select>
    </div>
  `;
}


// Additional functions

function helperSelectOption (item, value) {
  let myValue = item;
  if (typeof(item) === 'object') {
    myValue = item[0];
    item = item[1];
  }
  let selected = '';
  if (value.includes(item)) selected = 'selected'
  return `
    <option ${selected} value="${myValue}">${item}</option>
  `;
}


module.exports = formSelect2;

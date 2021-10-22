/*!
 * main/templates/noard-form-select.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';


function boardFormSelect (optionsList, value, prop, disabled='') {
  return `
    <label for="${prop}-field" class="mt-2">${prop}</label>
    <select class="custom-select custom-select-sm" id="${prop}-field" name="${prop}" ${disabled}>
      <option value=""></option>
      ${optionsList.map( item => helperSelectOption(item, value) ).join('')}
    </select>
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
  if (value && value.includes(item)) selected = 'selected'
  return `
    <option ${selected} value="${myValue}">${item}</option>
  `;
}


module.exports = boardFormSelect;

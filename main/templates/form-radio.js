/*!
 * main/templates/form-radio.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';


function formRadio (prop, valueArray, disabled='', checkedValue='', required='', onchange='') {
  return `
    <div class="col-12 row form-${prop}">
      <div class="col-sm-2 pt-1 col-form-label text-right">
        ${prop}
      </div>
      <div class="col-sm-7">
        ${valueArray.map( value => helperRadios(value, prop, disabled, checkedValue, required, onchange)).join('')}
      </div>
    </div>
  `;
}


// Additional Functions

function helperRadios (value, prop, disabled, checkedValue, required, onchange) {
  let checked = '';
  if (checkedValue === value) checked = 'checked';
  return `
    <div class="form-check form-check-inline">
      <input class="form-check-input" type="radio" name="${prop}" id="${value}" value="${value}" ${onchange} ${disabled} ${required} ${checked}>
      <label class="form-check-label" for="${value}">${value}</label>
    </div>
  `;
}


module.exports = formRadio;

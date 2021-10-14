/*!
 * main/templates/form-checkbox.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';


function formCheckbox (valueArray, prop, checkedArray=[], disabledArray=[], oneGroup=true) {
  return `
      <div class="col-sm-2 pt-1 col-form-label text-right">
        ${prop}
      </div>
      <div class="col-sm-7">
        ${valueArray.map( value => helperCheckbox(value, prop, checkedArray, disabledArray, oneGroup)).join('')}
      </div>
  `;
}


// Additional Functions

function helperCheckbox (valueIn, prop, checkedArray, disabledArray, oneGroup) {
  let value = '';
  let label = '';
  let checked = '';
  let disabled = '';
  if (typeof(valueIn) === 'object') {
    value = valueIn[0];
    label = valueIn[1]
  } else {
    value = valueIn;
    label = valueIn;
  }
  let inputName = prop;
  if (oneGroup === false) inputName = label;
  if (checkedArray.includes(value)) checked = 'checked';
  if (disabledArray.includes(value)) disabled = 'disabled';
  if (value === true && checkedArray.includes(label)) checked = 'checked';
  if (value === true && disabledArray.includes(label)) disabled = 'disabled';
  return `
    <div class="form-check form-check-inline">
      <input class="form-check-input" type="checkbox" name="${inputName}" id="${prop}-${label}" value="${value}" ${disabled} ${checked}>
      <label class="form-check-label" for="${prop}-${label}">${label}</label>
    </div>
  `;
}


module.exports = formCheckbox;

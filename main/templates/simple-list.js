/*!
 * main/templates/simple-list.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';


function simpleList (headline='', itemsList=[]) {
  if (itemsList.length > 0) {
    return `
      ${headline !== '<h5>' ? ''+headline+'' : '</5>'}
      <div class="border py-3 mt-3">
        <ul>
          ${itemsList.map(listItem).join('')}
        </ul>
      </div>
    `;
  } else {
    return '';
  }
}


//Additional functions

function listItem (item) {
  return `
    <li class="my-2">${item}</li>
  `;
}


module.exports = simpleList;

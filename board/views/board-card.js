/*!
 * views/board/board-card.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../../main/models/model-config').getConfig();
const { formatDateShort } = require('../../lib/dateJuggler');
const getIcon = require('../../main/views/get-icon');
const boardCardForm = require('./board-card-form');


function boardCard (card, myTopic, role, group) {
  let topicColor = myTopic.color;
  let returnHtml = '';
  let linkNFile = '';
  if (card.files && card.files.length > 0) {
    linkNFile += `<hr class="my-1" />`;
    card.files.forEach( (file, i) => {
      linkNFile += `
        <a href="${file}" target="_blank">
          <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-download" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
            <path fill-rule="evenodd" d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
          </svg>
          <span class="small"> Download ${i+1}</span>
        </a><br />`
        ;
    });
  }
  if (card.link && card.link != '') {
    linkNFile += `
      <hr class="my-1" />
      <a text-truncate" href="${card.link}" target="_blank">
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-link-45deg" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.715 6.542L3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.001 1.001 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
          <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 0 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 0 0-4.243-4.243L6.586 4.672z"/>
        </svg>
        <span class="small">${card.link.split('//')[1]}
      </a>`;
  }
  if (card.chapter != '') {
      returnHtml += `
        <div class="border mt-2 bg-light board-card">
          <div class="py-2 px-3 h-100 w-100 d-flex justify-content-between ${topicColor}">
            <strong>${card.chapter}</strong>
            ${role === 'member' && myTopic.autofill !== true ? helperEditCardButton(myTopic, card.id) : ''}
            ${myTopic.autofill === true && role === 'student' ? '<span class="m-0">' + getIcon(card.lessonType) + '</span>' : ''}
            ${myTopic.autofill === true && role === 'teacher' ? `<a href="/lessons/show/${group}/${card.id}" class="${topicColor}">${getIcon(card.lessonType)}</a>` : ''}
          </div>
          ${boardCardForm(group, myTopic.id, card)}
          <div id="card-details-${card.id}" class="collapse show">
            <p class="small py-2 px-3">
              ${card.lessonType === 'onlinelesson' ? '<strong>' + formatDateShort(card.startDate, card.weekdays[0]) + ' - ' + card.time + ' ' + locale.lessons.oclock[config.lang] + '</strong><br />' : ''}
              ${card.details}
            </p>
            <div class="py-2 px-3 text-truncate">
              ${linkNFile}
            </div>
          </div>
        </div>
      `;
  }
  return returnHtml;
}


// Additional functions

function helperEditCardButton (myTopic, myCardId) {
  return `
    <a href="#" class="${myTopic.color}" data-bs-toggle="collapse" data-bs-target="#addCardForm-${myTopic.id}-${myCardId}" onclick="javascript: $('#card-details-${myCardId}').collapse('toggle')">
      <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pencil-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
      </svg>
    </a>
  `;
}


module.exports = boardCard;

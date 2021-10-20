/*!
 * issue/templates/issue-pills.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';


function issuePills (state, noPillText='') {
  switch (state) {
    // priority
    case 'blocker':
      return `<span class="badge bg-danger rounded-pill">${state}</span>`;
    case 'critical':
      return `<span class="badge bg-danger rounded-pill">${state}</span>`;
    case 'high':
      return `<span class="badge bg-warning rounded-pill">${state}</span>`;
    // state
    case 'backlog':
      return `<span class="badge bg-secondary rounded-pill">${state}</span>`;
    case 'open':
      return `<span class="badge bg-primary rounded-pill">${state}</span>`;
    case 'in progress':
      return `<span class="badge bg-success rounded-pill">${state}</span>`;
    case 'resolved':
      return `<span class="badge bg-primary rounded-pill">${state}</span>`;
    case 'closed':
      return `<span class="badge bg-info rounded-pill">${state}</span>`;
    // type
  case 'Bug':
    return `<span class="badge bg-danger rounded-pill">${state}</span>`;
    default:
      return noPillText;
  }
}


module.exports = issuePills;

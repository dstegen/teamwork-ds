/*!
 * main/templates/member-card.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules


function memberCard (user) {
  return `
    <div class="col">
      <div class="card">
        <div class="card-body">
          <div class="d-flex justify-content-center mb-4">
            <img src="/data/users/pics/${user.id}.jpg" height="200" width="200" class="img-fluid border rounded-circle"/>
          </div>
          <div class="text-center">
            <h5 class="card-title mb-1">${user.fname} ${user.lname}</h5>
            <h6 class="text-muted">${user.position}</h6>
          </div>
          <p class="card-text"></p>
        </div>
      </div>
    </div>
  `;
}


module.exports = memberCard;

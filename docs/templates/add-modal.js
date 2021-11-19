/*!
 * docs/templates/add-modal.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';


function addModal (headline, actionUrl, type, buttonText='Add/update') {
  return `
    <!-- Add-Topic-Modal -->
    <div class="modal fade" id="add-${type}-modal" tabindex="-1" aria-labelledby="add-${type}-modal" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="add-${type}-modal-title">${headline}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="add-${type}-modal-form" action="${actionUrl}" method="post">
              <input type="text" class="form-control" id="${type}-topicObjId-field" name="topicObjId" value="" hidden>
              <input type="text" class="form-control" id="${type}-id-field" name="id" value="" hidden>
              <input type="text" class="form-control" id="${type}-name-field" name="name" value="" required>
              <div class="d-flex justify-content-end mt-2">
                <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" class="btn btn-sm btn-primary ms-3">${buttonText}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
}


module.exports = addModal;

/*!
 * calendar/templates/new-calendar-modal.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const formTextInput = require('../../main/templates/form-textinput');
const formSelect = require('../../main/templates/form-select');


function newCalendarModal () {
  return `
    <!-- New Calendar Modal -->
    <div class="modal fade" id="newCalendarModal" tabindex="-1" aria-labelledby="editEventModal" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Add new calendar</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="new-calendar-form" name="new-calendar-form" action="/calendar/create" method="post">
              <div class="form-group row">
                ${formTextInput('', 'name', 'required', '', '', 'text')} <div class="col-3"></div>
                ${formSelect(['success','warning','info','secondary'], 'success', 'color', '', '', 'required')} <div class="col-3"></div>
              </div>
              <div class="d-flex justify-content-between mt-3">
                <button type="button" class="btn btn-sm btn-secondary me-3" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" class="btn btn-sm btn-primary">Update</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
}


module.exports = newCalendarModal;
